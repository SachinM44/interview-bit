//// so deboaund executes one afte the event is ended

const debounceFN = (callbackFn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callbackFn.apply(this, args);
    }, delay);
  };
};

const usingtheDebound = debounceFN(() => {
  console.log("helllo ");
}, 5000);

usingtheDebound();

const numbs = [1, 3, 4, 5, 6];

const indexResult = numbs.findIndex((n) => n > 5);

const valueResult = numbs.findIndex((n) => n > 5);

console.log();

const promisifiedFn = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(data);
    }, 2000);
  });
};

promisifiedFn()
  .then((data) => {
    console.log(data);
  })
  .catch((errror) => {
    console.log(errror);
  });

const throttledFN = (fn, delay) => {
  const lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (lastCall - now >= delay) {
      lastCall = now;
      fn(this, args);
    }
  };
};


export async function getServerSideProp(context) {
  const {params, req, res, qyert }=context;
  const user=await debounceFN.findOne
  return
}