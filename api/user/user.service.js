const { constants } = require("../../config");
const { getDb } = require("../../services/db");
const errors = require("../../services/error");
const { ObjectId } = require('mongodb');

const findById = async (id) => {
  return getDb().collection(constants.USER_COLLECTION).findOne({ _id: ObjectId(id) });
};

const find = async ({criteria}) => {
  return getDb().collection(constants.USER_COLLECTION).find(criteria);
};

module.exports = {
  findById,
  find,
};