/// jus the api login

const apiEndpoint = new Promise((res, rej) => {
  const apiMockData = {
    name: "sachin",
    age: 22,
  };
  const SC = 200;
  if ((SC = 200)) {
    res(apiMockData);
  } else {
    res.json({
      msg: "somthign went wrong",
    });
  }

  apiEndpoint.then(() => {});
});
