const { fetchEndpoints } = require("../models/endpoints-model");

exports.getEndpoints = (req, res, next) => {
  const endpoints = fetchEndpoints();
  res.status(200).send({ endpoints });
};
