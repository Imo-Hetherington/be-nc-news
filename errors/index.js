exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Invalid Method" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error" });
};
