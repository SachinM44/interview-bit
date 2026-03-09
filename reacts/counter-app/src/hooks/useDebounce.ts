import { useRef } from "react";

export interface IDebounceInterface {
  delay: string;
  fn: () => void;
}

const useDebounce = ({ delay, fn }: IDebounceInterface) => {
  const timerRef = useRef();
  return (...args) => {
    clearInterval(timeRef.current());
    timerRef.current() = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export default { useDebounce };
