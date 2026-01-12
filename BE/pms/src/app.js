import express from "express";
import routers from './routes/index.js'
const app = express();
const port = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    msg: "app is healthy",
  });
});

app.use("/api", routers);

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
