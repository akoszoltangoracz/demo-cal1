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

const update = async (id, updates) => {
  const update = {
    ...updates,
  };

  if (update.interests) {
    update.interests = update.interests.map(interest => ObjectId(interest));
  }

  return getDb().collection(constants.USER_COLLECTION).findOneAndUpdate({
    _id: id,
  }, {
    $set: {
      ...update,
    }
  }, {
    returnNewDocument: true,
  })
};

module.exports = {
  findById,
  find,
  update,
};