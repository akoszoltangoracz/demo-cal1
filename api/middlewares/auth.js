const jwt = require('jsonwebtoken');
const { getDb } = require("../../services/db");
const { ObjectId } = require('mongodb');
const { constants, JWT_SECRET } = require("../../config");
const errors = require("../../services/error");
const handler = require("./handler");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new errors.UnauthorizedError("Invalid token");
  }
  const token = authorization.split(" ")[1];
  let tokenContents;
  try {
    tokenContents = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new errors.UnauthorizedError(err.message);
  }
  const { id: userId } = tokenContents;
  const user = await getDb().collection(constants.USER_COLLECTION).findOne({
    _id: ObjectId(userId),
  });
  req.user = user;
  return next();
};

module.exports = handler(authMiddleware);