import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { useBulkEdit } from './useBulkEdit';

jest.mock('@/hooks', () => ({
  useGetOrchestratorConfig: () => ({ environmentName: 'Development' }),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const tableRows = [{ processId: 'task-1' }, { processId: 'task-2' }];

describe('useBulkEdit', () => {
  it('clears the selection', () => {
    const { result } = renderHook(() => useBulkEdit(tableRows, { uniqueRowId: 'processId' }));

    act(() => result.current.handleToggleBulkEditMode(true));
    act(() => result.current.handleToggleSelectAll());
    expect(result.current.selectedRows).toEqual(tableRows);

    act(() => result.current.handleClearSelection());
    expect(result.current.selectedRows).toEqual([]);
    expect(result.current.isBulkEditMode).toBe(true);
  });
});
