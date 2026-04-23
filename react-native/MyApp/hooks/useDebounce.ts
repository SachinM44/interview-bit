//// so you need to build the debounce generic function , which does the job

import { useCallback, useEffect, useRef, useState } from "react";

const useDebounce = <T>(value: T, delay: number): T => {
  const [debouceValue, setDebouceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setInterval(() => setDebouceValue(value), delay);

    return () => clearInterval(timer);
  }, [delay, value]);
  return debouceValue;
};
//// is abouve is the one way , whats the next and  better way according to me

const useDbounceForOneMore = <T extends (...args: unknown[]) => unknown>(
  callBackFn: T,
  deplay: number,
) => {
  /// so then i need the timerRef to get the current time

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callBackFn.apply(this, args);
      }, deplay);
    },
    [callBackFn, deplay],
  );
};
 /// so this suppoed to work 