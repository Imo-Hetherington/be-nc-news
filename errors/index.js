exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else next(err);
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error" });
};
