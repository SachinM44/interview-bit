import { useCallback, useRef } from "react";

export interface IDebounceInterface {
  delay: number;
  fn: (...args: any[]) => void;
}

const useDebounce = ({ delay, fn }: IDebounceInterface) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: any[]) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay],
  );
};

export default useDebounce;
