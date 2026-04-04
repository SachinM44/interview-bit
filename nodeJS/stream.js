//### Interview Question: How would you process a 10GB log file?


///streams in the js

const fs = require("fs");

const readble = fs.ReadStream("csv_file");

const { Transform } = require("stream");

const upperCase = new Transform({
  chunk,
  encoding,
  callback,
});

///pipeing them together

/// so here illl use the steam, which is the fs

const readline = require("readline");
const { error } = require("console");

const readLargerFile = (filePapth) => {
  const fileStream = fs.createReadStream(filePapth);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for (const line in rl) {
    const error = 0;
    if (line.includes("ERROR")) {
      error++;
    }
  }
  return error;
};
