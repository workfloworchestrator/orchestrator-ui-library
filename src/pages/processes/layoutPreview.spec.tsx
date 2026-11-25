import { renderHook } from '@testing-library/react';

import { useNewUiPreview } from './layoutPreview';

const mockConfig = { showBetaWorkflowLayoutToggle: false };
jest.mock('@/hooks', () => ({ useGetOrchestratorConfig: () => mockConfig }));

describe('useNewUiPreview', () => {
  beforeEach(() => localStorage.setItem('wfoNewUiPreview', '1'));

  it('shows only the classic layout and no toggle when the flag is off, even with a stored beta choice', () => {
    mockConfig.showBetaWorkflowLayoutToggle = false;
    const { result } = renderHook(() => useNewUiPreview());
    expect(result.current.showToggle).toBe(false);
    expect(result.current.isNewUi).toBe(false);
  });

  it('shows the toggle and uses the stored choice when the flag is on', () => {
    mockConfig.showBetaWorkflowLayoutToggle = true;
    const { result } = renderHook(() => useNewUiPreview());
    expect(result.current.showToggle).toBe(true);
    expect(result.current.isNewUi).toBe(true);
  });
});
