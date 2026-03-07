const express = require("express");
 const express =require("express"),
 const app1=express();
 app1.post('/login', (req, res)=>[
  const {email , name , }
 ])
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("well come to api");
});

app.get("/health", (req, res) => {
  const now = new Date();
  res.send({
    status: "ok",
    timeStamp: now.toISOString(),
  });
});

app.post("/echo", (req, res) => {
  res.json(req.body);
});

const port = 3000;
app.listen(port, () => {
  console.log(`app is listen on ${port}`);
});
