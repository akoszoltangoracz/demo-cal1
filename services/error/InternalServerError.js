const ApiError = require("./ApiError");
class InternalServerError extends ApiError {
  constructor(message) {
    super(message, 500);
  }
}
module.exports = InternalServerError;