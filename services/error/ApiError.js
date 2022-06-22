class ApiError extends Error {
  constructor(message, httpCode) {
    super(message);
    this.httpCode = httpCode || 500;
  }
  toJSON() {
    return {
      message: this.message,
      code: this.httpCode,
    }
  }
}

module.exports = ApiError;