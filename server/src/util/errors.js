class BaseError extends Error {
  constructor(message, message_vi, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.message_vi = message_vi;
  }
}

class NotFoundError extends BaseError {
  constructor(
    message = "Resource not found",
    message_vi = "Tài nguyên không tồn tại."
  ) {
    super(message, message_vi, 404);
  }
}

class ValidationError extends BaseError {
  constructor(
    message = "Invalid request",
    message_vi = "Request không hợp lệ"
  ) {
    super(message, message_vi, 400);
  }
}

class InternalServerError extends BaseError {
  constructor(message = "Something went wrong", message_vi = "Lỗi hệ thống") {
    super(message, message_vi, 500);
  }
}
class DuplicateResourceError extends BaseError {
  constructor(
    message = "Resource already exists",
    message_vi = "Tài nguyên đã tồn tạitại"
  ) {
    super(message, message_vi, 409);
  }
}

module.exports = {
  BaseError,
  NotFoundError,
  ValidationError,
  InternalServerError,
  DuplicateResourceError,
};
