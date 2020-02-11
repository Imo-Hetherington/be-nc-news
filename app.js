const express = require("express");
const app = express();
const apiRouter = require("./routes/api-route");

app.use("/api", apiRouter);
module.exports = app;
