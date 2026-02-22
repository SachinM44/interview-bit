// ///debound

// const debounce = (fn, delay) => {
//   let timer;
//   return (...args) => {
//     clearInterval(timer);
//     timer = setTimeout(() => {
//       fn.apply(this, args);
//     }, delay);
//   };
// };

// /// to use that

// const debouncedCall = debounce(() => {
//   console.log("hello from debounce");
// }, 5000);

// debouncedCall();

///// throttling

const throttling = (fn, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    console.log(now);
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
};

const thorttledFN = throttling(() => {
  console.log("hello there from thottling");
}, 20000);

//thorttledFN();

setInterval(() => {
    thorttledFN()
}, 500);
