import React from 'react';

import type { PydanticFormApiProvider } from 'pydantic-forms';

import { render } from '@testing-library/react';

import { ToastTypes } from '@/types';

import { WfoPydanticForm } from './WfoPydanticForm';

// Same approach as WfoStepForm.spec.tsx: capture the provider through the config hook.
let mockProvider: PydanticFormApiProvider;
const mockShowToastMessage = jest.fn();
const mockStartProcess = jest.fn();
const mockReplace = jest.fn();

jest.mock('pydantic-forms', () => ({ PydanticForm: () => null }));
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('next/router', () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock('@/components', () => ({ PATH_TASKS: '/tasks', PATH_WORKFLOWS: '/workflows' }));
jest.mock('@/components/WfoPydanticForm/Footer', () => ({ Footer: () => null }));
jest.mock('@/hooks', () => ({ useShowToastMessage: () => ({ showToastMessage: mockShowToastMessage }) }));
jest.mock('@/hooks/useGetPydanticFormsConfig', () => ({
  useGetPydanticFormsConfig: (getProvider: () => PydanticFormApiProvider) => {
    mockProvider = getProvider();
    return {};
  },
}));
jest.mock('@/rtk/endpoints/forms', () => ({ useStartProcessMutation: () => [mockStartProcess] }));

const ROOT_FORBIDDEN = { loc: ['__root__'], type: 'forbidden' };

const start = (error: unknown) => {
  mockStartProcess.mockResolvedValue({ error });
  render(<WfoPydanticForm processName="create_thing" />);
  return mockProvider({ formKey: 'create_thing', requestBody: [] });
};

describe('WfoPydanticForm on a denied start', () => {
  it('shows the API detail as toast and root error and stays on the form', async () => {
    const detail = "User is not authorized to start 'create_thing' workflow";

    await expect(start({ status: 403, data: { detail } })).resolves.toEqual({
      validation_errors: [{ ...ROOT_FORBIDDEN, msg: detail }],
    });
    expect(mockShowToastMessage).toHaveBeenCalledWith(ToastTypes.ERROR, detail, 'forbiddenTitle');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('falls back to the translated message when the 403 body has no detail', async () => {
    await expect(start({ status: 'PARSING_ERROR', originalStatus: 403, data: '', error: 'x' })).resolves.toEqual({
      validation_errors: [{ ...ROOT_FORBIDDEN, msg: 'forbiddenFallback' }],
    });
    expect(mockShowToastMessage).toHaveBeenCalledWith(ToastTypes.ERROR, 'forbiddenFallback', 'forbiddenTitle');
  });

  it('still leaves the page on 412, unlike 403', async () => {
    await start({ status: 412, data: { detail: 'not now' } });

    expect(mockReplace).toHaveBeenCalledWith('/workflows');
  });

  it('resolves empty without a toast for other errors', async () => {
    await expect(start({ status: 500, data: {} })).resolves.toEqual({});
    expect(mockShowToastMessage).not.toHaveBeenCalled();
  });
});
