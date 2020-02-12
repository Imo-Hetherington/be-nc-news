const express = require("express");
const app = express();
const apiRouter = require("./routes/api-route");
const {
  handle404s,
  handle500s,
  handleCustomErrors,
  handlePSQLErrors
} = require("./errors/index");

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", handle404s);

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handle500s);

module.exports = app;
