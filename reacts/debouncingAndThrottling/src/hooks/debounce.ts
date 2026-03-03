import { useCallback, useRef } from "react";

// const useDbounce = <T extends (...args: unknown[]) => unknown>(
//   callback: T,
//   delay: number,
// ) => {
//   const timerRef = useRef<typeof setTimeout>(null);
//   return useCallback(
//     (...args: Parameters<T>) => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }

//       timerRef.current = setTimeout(() => {
//         callback(...args);
//       }, delay);
//     },
//     [callback, delay],
//   );
// };

// export default useDbounce;

export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callBackFn: T,
  delay: number,
) => {
  const timerRef = useRef<typeof setTimeout>(null);
  return useCallback((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callBackFn.apply(this, args);
    }, delay);
  });
};
