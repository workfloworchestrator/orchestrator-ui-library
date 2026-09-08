import { useCallback, useEffect, useRef, useState } from 'react';

// The run currently scheduled: its `delay` lets a countdown indicator animate over exactly the
// remaining wait, and its `id` changes per scheduled run so the indicator can restart itself.
export type DebouncedPendingRun = {
  id: number;
  delay: number;
};

interface DebouncedCallback {
  trigger: (delay?: number) => void;
  pendingRun?: DebouncedPendingRun;
}

export function useDebouncedCallback(callback: () => void): DebouncedCallback {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const runIdRef = useRef(0);
  const [pendingRun, setPendingRun] = useState<DebouncedPendingRun>();
  callbackRef.current = callback;

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const trigger = useCallback((delay?: number) => {
    clearTimeout(timeoutRef.current);

    if (delay === undefined) {
      setPendingRun(undefined);
      callbackRef.current();
      return;
    }

    const id = ++runIdRef.current;
    setPendingRun({ id, delay });
    timeoutRef.current = setTimeout(() => {
      setPendingRun(undefined);
      callbackRef.current();
    }, delay);
  }, []);

  return { trigger, pendingRun };
}
