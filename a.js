///major fuck //the debouse when u have to call the cuntion with only given time only once

///so debounce fun exprecut fun after the even iof the avtivity happend ,it may be the settimout
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearInterval(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
////
const handleSubut = debounce(() => {
  console.log("hello debounce");
}, 5000);

handleSubut()