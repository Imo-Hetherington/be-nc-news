const express = require("express");
const app = express();
const apiRouter = require("./routes/api-route");
const {
  handle404s,
  handle500s,
  handleCustomErrors
} = require("./errors/index");

app.use("/api", apiRouter);

app.all("/*", handle404s);

app.use(handleCustomErrors);

app.use(handle500s);

module.exports = app;
