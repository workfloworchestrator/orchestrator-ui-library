import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback(callback: () => void, defaultDelay: number): (delay?: number) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  callbackRef.current = callback;

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return useCallback(
    (delay?: number) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(), delay ?? defaultDelay);
    },
    [defaultDelay],
  );
}
