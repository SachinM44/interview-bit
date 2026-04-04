const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const coresCount = os.cpus().length;
  console.log(coresCount);
  console.log(process.pid)
  for (let i = 0; i < coresCount; i++) {
    cluster.fork(); ///to spawn the new worker , can be done inside the main thread
    console.log(worker.process.pid)
  }
} else {
  const http = require("http");
   
  http.createServer((req, res) => {
    res.end(`the worker is running in this process ${process.pid}`);
  }).listen(3000)
}
