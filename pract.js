///debound

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearInterval(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/// to use that

const debouncedCall = debounce(() => {
  console.log("hello from debounce");
}, 5000);

debouncedCall();
