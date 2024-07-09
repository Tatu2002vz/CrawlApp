
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
};

const errHandle = (err, req, res, next) => {
  const stt =
    res.statusCode === 200 ? 400 : res.statusCode;
  return res.status(stt).json({
    mes: err.message,
  });
};

module.exports = {
  notFound,
  errHandle,
};
