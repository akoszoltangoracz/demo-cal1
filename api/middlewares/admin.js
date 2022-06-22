const errors = require("../../services/error");
const handler = require("./handler");

const adminMiddleware = async (req, res, next) => {
  if (!req?.user?.isAdmin) {
    throw new errors.UnauthorizedError("You don't have permission to do that!");
  }

  return next();
};

module.exports = handler(adminMiddleware);