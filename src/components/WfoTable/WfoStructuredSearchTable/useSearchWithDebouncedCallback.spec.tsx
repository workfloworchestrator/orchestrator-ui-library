import React from 'react';

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { FILTER_CHANGE_DEBOUNCE_DELAY, useSearchWithDebouncedCallback } from './utils';

type SearchHookProps = { filterString: string; hasEmptyRuleValue?: boolean };

const renderSearchHook = (searchCallback: () => void, initialFilterString = 'subscription.status == "active"') =>
  renderHook(
    ({ filterString, hasEmptyRuleValue = false }: SearchHookProps) =>
      useSearchWithDebouncedCallback({ filterString, isValidFilterString: true, hasEmptyRuleValue, searchCallback }),
    { initialProps: { filterString: initialFilterString } as SearchHookProps },
  );

describe('useSearchWithDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('schedules a search when the filter string changes, and not for the one it starts with', () => {
    const searchCallback = jest.fn();
    const { result, rerender } = renderSearchHook(searchCallback);

    act(() => {
      jest.advanceTimersByTime(FILTER_CHANGE_DEBOUNCE_DELAY);
    });
    expect(searchCallback).not.toHaveBeenCalled();

    rerender({ filterString: 'subscription.status == "activ"' });
    expect(result.current.pendingSearchRun).toBeDefined();

    act(() => {
      jest.advanceTimersByTime(FILTER_CHANGE_DEBOUNCE_DELAY);
    });
    expect(searchCallback).toHaveBeenCalledTimes(1);
    expect(result.current.pendingSearchRun).toBeUndefined();
  });

  it('searches immediately on click, dropping the countdown and the run it had scheduled', () => {
    const searchCallback = jest.fn();
    const { result, rerender } = renderSearchHook(searchCallback);

    rerender({ filterString: 'subscription.status == "activ"' });
    expect(result.current.pendingSearchRun).toBeDefined();

    act(() => {
      result.current.handleSubmitSearchOnClick();
    });
    expect(searchCallback).toHaveBeenCalledTimes(1);
    expect(result.current.pendingSearchRun).toBeUndefined();

    // The scheduled run was cancelled rather than left to fire a second search.
    act(() => {
      jest.advanceTimersByTime(FILTER_CHANGE_DEBOUNCE_DELAY);
    });
    expect(searchCallback).toHaveBeenCalledTimes(1);
  });

  it('does the same on enter, and leaves shift+enter alone', () => {
    const searchCallback = jest.fn();
    const { result, rerender } = renderSearchHook(searchCallback);

    rerender({ filterString: 'subscription.status == "activ"' });

    act(() => {
      result.current.handleSubmitSearchOnEnter({
        key: 'Enter',
        shiftKey: true,
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLElement>);
    });
    expect(searchCallback).not.toHaveBeenCalled();
    expect(result.current.pendingSearchRun).toBeDefined();

    act(() => {
      result.current.handleSubmitSearchOnEnter({
        key: 'Enter',
        shiftKey: false,
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLElement>);
    });
    expect(searchCallback).toHaveBeenCalledTimes(1);
    expect(result.current.pendingSearchRun).toBeUndefined();

    act(() => {
      jest.advanceTimersByTime(FILTER_CHANGE_DEBOUNCE_DELAY);
    });
    expect(searchCallback).toHaveBeenCalledTimes(1);
  });

  it('does not schedule a search while a value editor is empty', () => {
    const searchCallback = jest.fn();
    const { result, rerender } = renderSearchHook(searchCallback);

    // Clearing the value editor empties the value out of the filter string.
    rerender({ filterString: 'subscription.status == ""', hasEmptyRuleValue: true });
    expect(result.current.pendingSearchRun).toBeUndefined();

    act(() => {
      jest.advanceTimersByTime(FILTER_CHANGE_DEBOUNCE_DELAY);
    });
    expect(searchCallback).not.toHaveBeenCalled();

    // Typing a value again resumes the automatic search.
    rerender({ filterString: 'subscription.status == "a"', hasEmptyRuleValue: false });
    expect(result.current.pendingSearchRun).toBeDefined();

    act(() => {
      jest.advanceTimersByTime(FILTER_CHANGE_DEBOUNCE_DELAY);
    });
    expect(searchCallback).toHaveBeenCalledTimes(1);
  });

  it('drops a scheduled search when the value editor is cleared before it runs', () => {
    const searchCallback = jest.fn();
    const { result, rerender } = renderSearchHook(searchCallback);

    rerender({ filterString: 'subscription.status == "activ"' });
    expect(result.current.pendingSearchRun).toBeDefined();

    rerender({ filterString: 'subscription.status == ""', hasEmptyRuleValue: true });
    expect(result.current.pendingSearchRun).toBeUndefined();

    act(() => {
      jest.advanceTimersByTime(FILTER_CHANGE_DEBOUNCE_DELAY);
    });
    expect(searchCallback).not.toHaveBeenCalled();
  });

  it('still searches on click while a value editor is empty', () => {
    const searchCallback = jest.fn();
    const { result, rerender } = renderSearchHook(searchCallback);

    rerender({ filterString: 'subscription.status == ""', hasEmptyRuleValue: true });

    act(() => {
      result.current.handleSubmitSearchOnClick();
    });
    expect(searchCallback).toHaveBeenCalledTimes(1);
  });
});
