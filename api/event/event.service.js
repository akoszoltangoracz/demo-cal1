const { constants } = require("../../config");
const { getDb } = require("../../services/db");
const errors = require("../../services/error");
const { ObjectId } = require("mongodb");
const { fileUpload } = require("../../services/aws");

const checkPermission = async (id, user) => {
  if (!id) {
    throw new errors.BadRequestError("Missing event id");
  }
  const event = await findById(id);
  if (!user.isAdmin && event.createdBy.toString() !== user._id.toString()) {
    throw new errors.UnauthorizedError("You don't have permission to do that!");
  }
}

const findById = async (id) => {
  const event = await getDb().collection(constants.EVENT_COLLECTION).findOne({ _id: ObjectId(id) });
  if (!event) {
    throw new errors.NotFoundError("Event not found");
  }
  return event;
};

const list = async (interestId) => {
  const query = interestId ? { interestId } : {};
  return getDb().collection(constants.EVENT_COLLECTION).find(query).sort({ startDate: -1 }).toArray();
};

const create = async ({ title, description, startDate, endDate, interestId }, user) => {
  if (!title) {
    throw new errors.BadRequestError("Missing event name");
  }
  if (!interestId) {
    throw new errors.BadRequestError("Missing event's interestId");
  }
  const result = await getDb().collection(constants.EVENT_COLLECTION).insertOne({
    title,
    description,
    interestId: ObjectId(interestId),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    createdBy: user._id,
    createdAt: new Date(),
  });
  return findById(result.insertedId);
};

const update = async (id, updateObj) => {
  if (!id) {
    throw new errors.BadRequestError("Missing event id");
  }
  const event = await findById(id);

  await getDb().collection(constants.EVENT_COLLECTION).updateOne({ _id: ObjectId(id) }, {
    $set: {
      ...updateObj,
      interestId: event.interestId,
      startDate: new Date(updateObj.startDate || event.startDate),
      endDate: new Date(updateObj.endDate || event.endDate),
    }
  });
  return findById(id);
};

const remove = async (id) => {
  if (!id) {
    throw new errors.BadRequestError("Missing event id");
  }
  return getDb().collection(constants.EVENT_COLLECTION).remove({ _id: ObjectId(id) });
};

const coverUpload = async (id, filePath) => {
  const coverUrl = await fileUpload(filePath, "events");
  return update(id, { coverUrl });
};


module.exports = {
  checkPermission,
  findById,
  list,
  create,
  update,
  remove,
  coverUpload,
};