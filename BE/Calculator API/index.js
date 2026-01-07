const express = require("express");
const { basicURLParse } = require("whatwg-url");

const app = express();
app.use(express.json());

const port = 3000;
//end point which does the mathematical fn

app.get("/health", (req, res) => {
  res.send("hello im runnign ");
});


app.post("/calculate", (req, res) => {
  ///firt u get the two number and the operation
  const { num1, num2, operator } = req.body;
  console.log(num1, num2, operator);
  let result;
  switch (operator) {
    case "+":
      result = parseInt(num1) + parseInt(num2);
      break;

    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;

    case "/":
      if (num2 === 0) {
       return res.send("num2 value cannot be zoro");
      }
      result = num1 / num2;
      break;

    default:
     return res.status(500).send("invalid operations");
  }
  res.json({ result });
});

app.listen(port, () => {
  console.log(`app is running on the ${port}`);
});
