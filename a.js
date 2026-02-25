const nums = [3, 44, 6, 44, 2, 2, 1];

const reult = nums.findIndex((n) => n >= 44);
console.log(reult);

///promis

const fetcDaat = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(nums);
    }, 2000);
  })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const docker = new Promise((res, rej) => {
  let success = false;
  if (success) {
    res("completed");
  } else {
    rej("go home");
  }
});

docker
  .then((msg) => {
    console.log(msg);
  })
  .catch((err) => {
    console.log(err);
  });

///promisfied dn

const promisifiedFn = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ name: "sachin" });
      rej({ error: "go  home" });
    }, 2000);
  });
};

promisifiedFn()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
