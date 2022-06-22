const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { constants, JWT_SECRET } = require("../../config");
const { getDb } = require("../../services/db");
const errors = require("../../services/error");

const register = async ({ username, password }) => {
  const user = await getDb().collection(constants.USER_COLLECTION).findOne({ username });
  if (user) {
    throw new errors.BadRequestError("Username is already taken");
  }
  const hashedPassword = await bcrypt.hash(password, constants.SALT_ROUNDS);

  await getDb().collection(constants.USER_COLLECTION).insertOne({
    username,
    password: hashedPassword,
    interests: [],
    createdAt: new Date(),
  });
};

const login = async ({ username, password }) => {
  const user = await getDb().collection(constants.USER_COLLECTION).findOne({
    username,
  });

  if (!user) {
    throw new errors.UnauthorizedError("Username or password is not valid");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new errors.UnauthorizedError("Username or password is not valid");
  }
  const userData = {
    id: user._id.toString(),
    username: user.username
  };

  const token = jwt.sign(userData, JWT_SECRET, {
    expiresIn: '1y'
  });

  return {
    user: userData,
    token,
  };
};


module.exports = {
  register,
  login,
};