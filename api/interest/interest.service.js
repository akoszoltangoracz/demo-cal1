const { constants } = require("../../config");
const { getDb } = require("../../services/db");
const errors = require("../../services/error");
const { ObjectId } = require("mongodb");
const { fileUpload } = require("../../services/aws");

const findById = async (id) => {
  const interest = await getDb().collection(constants.INTEREST_COLLECTION).findOne({ _id: ObjectId(id) });
  if (!interest) {
    throw new errors.NotFoundError("Interest not found");
  }
  return interest;
};

const list = async () => {
  return await getDb().collection(constants.INTEREST_COLLECTION).find({}).sort({ name: 1 }).toArray();
};

const create = async ({ name, description }, user) => {
  if (!name) {
    throw new errors.BadRequestError("Missing interest name");
  }
  const interest = await getDb().collection(constants.INTEREST_COLLECTION).findOne({ name });

  if (interest) {
    throw new errors.BadRequestError("Interest already exists");
  }

  const result = await getDb().collection(constants.INTEREST_COLLECTION).insertOne({
    name,
    description,
    createdBy: user._id,
    createdAt: new Date(),
  });
  return findById(result.insertedId);
};

const update = async (id, updateObj) => {
  if (!id) {
    throw new errors.BadRequestError("Missing interest id");
  }
  const interest = await getDb().collection(constants.INTEREST_COLLECTION).findOne({ _id: ObjectId(id) });

  if (!interest) {
    throw new errors.NotFoundError("Interest not found");
  }

  await getDb().collection(constants.INTEREST_COLLECTION).updateOne({ _id: ObjectId(id) }, {
    $set: {
      ...updateObj
    }
  });
  return findById(id);
};

const remove = async (id) => {
  if (!id) {
    throw new errors.BadRequestError("Missing interest id");
  }
  return getDb().collection(constants.INTEREST_COLLECTION).remove({ _id: ObjectId(id) });
};

const coverUpload = async (id, filePath) => {
  const coverUrl = await fileUpload(filePath, "interests");
  return update(id, { coverUrl });
};


module.exports = {
  findById,
  list,
  create,
  update,
  remove,
  coverUpload,
};