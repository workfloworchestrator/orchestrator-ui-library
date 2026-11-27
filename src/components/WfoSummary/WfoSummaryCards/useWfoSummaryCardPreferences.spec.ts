import { act, renderHook } from '@testing-library/react';

import { useWfoSummaryCardPreferences } from './useWfoSummaryCardPreferences';

const STORAGE_KEY = 'cards';

describe('useWfoSummaryCardPreferences', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => jest.restoreAllMocks());

  it.each([
    ['invalid JSON', '{bad json'],
    ['values that are not lists', JSON.stringify({ order: 'alpha', expanded: null })],
  ])('starts empty with %s in storage', (_description, storedValue) => {
    window.localStorage.setItem(STORAGE_KEY, storedValue);

    const { result } = renderHook(() => useWfoSummaryCardPreferences(STORAGE_KEY));

    expect(result.current.preferences).toEqual({ order: [], expanded: [] });
  });

  it('still works for this session when the browser cannot save', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const { result } = renderHook(() => useWfoSummaryCardPreferences(STORAGE_KEY));

    act(() => result.current.updatePreferences(() => ({ order: ['beta'], expanded: [] })));

    expect(result.current.preferences.order).toEqual(['beta']);
  });

  it('applies two quick changes on top of each other', () => {
    const { result } = renderHook(() => useWfoSummaryCardPreferences(STORAGE_KEY));

    act(() => {
      result.current.updatePreferences((current) => ({ ...current, order: ['beta', 'alpha'] }));
      result.current.updatePreferences((current) => ({ ...current, expanded: ['alpha'] }));
    });

    expect(result.current.preferences).toEqual({ order: ['beta', 'alpha'], expanded: ['alpha'] });
  });
});
