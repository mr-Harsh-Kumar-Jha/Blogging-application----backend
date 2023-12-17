class AppError extends Error {
  payload;
  statusCode;
  status;
  constructor(payload, statusCode) {
    const data = JSON.stringify(payload);
    super(data);
    this.statusCode = statusCode;
    this.payload = payload;
    this.status = statusCode >= 500 ? "error" : "fail";
  }
}
module.exports = AppError;