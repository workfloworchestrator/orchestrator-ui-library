import React from 'react';

import type { PydanticFormApiProvider } from 'pydantic-forms';

import { render } from '@testing-library/react';

import { ToastTypes } from '@/types';

import { WfoStepForm } from './WfoStepForm';

// The form builds its API provider and hands it to the config hook; capture it there and call it
// the way PydanticForm does on submit, without rendering pydantic-forms itself.
let mockProvider: PydanticFormApiProvider;
const mockShowToastMessage = jest.fn();
const mockResumeProcess = jest.fn();

jest.mock('pydantic-forms', () => ({ PydanticForm: () => null }));
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('@/components/WfoWorkflowSteps/WfoStep/WfoStepFormFooter', () => ({ StepFormFooter: () => null }));
jest.mock('@/hooks', () => ({
  useOrchestratorTheme: () => ({ theme: { size: { m: 0 } } }),
  useShowToastMessage: () => ({ showToastMessage: mockShowToastMessage }),
  useGetPydanticFormsConfig: (getProvider: () => PydanticFormApiProvider) => {
    mockProvider = getProvider();
    return {};
  },
}));
jest.mock('@/rtk/endpoints/forms', () => ({ useResumeProcessMutation: () => [mockResumeProcess] }));

const ROOT_FORBIDDEN = { loc: ['__root__'], type: 'forbidden' };
const USER_INPUT = [{ field: 'typed value' }];

const submit = (error: unknown) => {
  mockResumeProcess.mockReturnValue({ unwrap: () => Promise.reject(error) });
  render(
    <WfoStepForm
      userInputForm={{}}
      isTask={false}
      processId="process-1"
      userPermissions={{ retryAllowed: true, resumeAllowed: true }}
    />,
  );
  return mockProvider({ formKey: 'process-1', requestBody: USER_INPUT });
};

describe('WfoStepForm on a denied resume', () => {
  it('shows the API detail as toast and root error', async () => {
    const detail = 'User is not authorized to resume this step';

    await expect(submit({ status: 403, data: { detail } })).resolves.toEqual({
      validation_errors: [{ ...ROOT_FORBIDDEN, msg: detail }],
    });
    expect(mockShowToastMessage).toHaveBeenCalledWith(ToastTypes.ERROR, detail, 'forbiddenTitle');
  });

  it('falls back to the translated message when the 403 body has no detail', async () => {
    await expect(submit({ status: 'PARSING_ERROR', originalStatus: 403, data: '', error: 'x' })).resolves.toEqual({
      validation_errors: [{ ...ROOT_FORBIDDEN, msg: 'forbiddenFallback' }],
    });
    expect(mockShowToastMessage).toHaveBeenCalledWith(ToastTypes.ERROR, 'forbiddenFallback', 'forbiddenTitle');
  });

  it('sends the typed input unchanged', async () => {
    await submit({ status: 403, data: {} });

    expect(mockResumeProcess).toHaveBeenCalledWith({ processId: 'process-1', userInputs: USER_INPUT });
  });

  it('rethrows other errors without a toast', async () => {
    const error = { status: 500, data: {} };

    await expect(submit(error)).rejects.toBe(error);
    expect(mockShowToastMessage).not.toHaveBeenCalled();
  });
});
