import React from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import type { PathInfo } from '@/types';

import { WfoValueEditor } from './WfoValueEditor';

jest.mock('@/hooks', () => ({
  useWithOrchestratorTheme: () => ({}),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const BOOLEAN_PATH_INFO = { ui_types: ['boolean'] } as PathInfo;

const renderBooleanValueEditor = (value: unknown, handleOnChange = jest.fn()) => {
  render(
    <WfoValueEditor
      {...({
        field: 'lldp',
        operator: '=',
        value,
        handleOnChange,
        className: 'rule-value',
        context: { fieldPathInfoMap: new Map([['lldp', BOOLEAN_PATH_INFO]]) },
      } as unknown as ValueEditorProps)}
    />,
  );
  return handleOnChange;
};

describe('WfoValueEditor boolean editor', () => {
  it('commits the default true on mount for a freshly selected field without a value', () => {
    const handleOnChange = renderBooleanValueEditor('');

    expect(handleOnChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'True', pressed: true })).toBeInTheDocument();
  });

  it('does not re-commit a restored boolean value', () => {
    const handleOnChange = renderBooleanValueEditor(false);

    expect(handleOnChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'False', pressed: true })).toBeInTheDocument();
  });

  it('does not overwrite a half-typed literal from the filter string textarea', () => {
    // While the user edits `lldp == false` in the textarea, intermediate states like
    // `lldp == fals` parse to a non-boolean value. Committing a normalized boolean here
    // would echo back into the filter string and snap the textarea back mid-edit.
    const handleOnChange = renderBooleanValueEditor('fals');

    expect(handleOnChange).not.toHaveBeenCalled();
  });
});
