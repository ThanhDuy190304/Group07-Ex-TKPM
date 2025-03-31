const { BaseError, InternalServerError } = require("../util/errors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof BaseError) {
    return res
      .status(err.statusCode)
      .json({ error: err.message, error_vn: err.message_vi });
  }

  console.error("Unexpected Error:", err);
  res
    .status(500)
    .json({ error: "Internal Server Error", error_vn: "Lỗi hệ thống" });
};

module.exports = errorHandler;
