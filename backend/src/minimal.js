const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("OK MINIMAL");
});

const server = app.listen(5000, () => {
  console.log("MINIMAL SERVER RUNNING");
});

/* keep process alive explicitly */
setInterval(() => {
  console.log("still alive...");
}, 5000);

/* debug exit */
process.on("exit", (code) => {
  console.log("PROCESS EXITED WITH CODE:", code);
});
