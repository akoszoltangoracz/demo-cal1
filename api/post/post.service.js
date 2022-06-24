const { constants } = require("../../config");
const { getDb } = require("../../services/db");
const errors = require("../../services/error");
const { ObjectId } = require("mongodb");
const { fileUpload } = require("../../services/aws");

const checkPermission = async (id, user) => {
  if (!id) {
    throw new errors.BadRequestError("Missing post id");
  }
  const post = await findById(id);
  if (!user.isAdmin && post.createdBy.toString() !== user._id.toString()) {
    throw new errors.UnauthorizedError("You don't have permission to do that!");
  }
}

const findById = async (id) => {
  const post = await getDb().collection(constants.POST_COLLECTION).findOne({ _id: ObjectId(id) });
  if (!post) {
    throw new errors.NotFoundError("Post not found");
  }
  return post;
};

const list = async (interestId) => {
  const query = interestId ? { interestId } : {};
  return getDb().collection(constants.POST_COLLECTION).find(query).sort({ startDate: -1 }).toArray();
};

const create = async ({ content, interestId }, user) => {
  if (!content) {
    throw new errors.BadRequestError("Missing post content");
  }
  if (!interestId) {
    throw new errors.BadRequestError("Missing post's interestId");
  }

  const result = await getDb().collection(constants.POST_COLLECTION).insertOne({
    content,
    interestId: ObjectId(interestId),
    createdBy: user._id,
    createdAt: new Date(),
  });
  return findById(result.insertedId);
};

const update = async (id, updateObj) => {
  if (!id) {
    throw new errors.BadRequestError("Missing post id");
  }
  const post = await findById(id);

  await getDb().collection(constants.POST_COLLECTION).updateOne({ _id: ObjectId(id) }, {
    $set: {
      ...updateObj,
      interestId: post.interestId,
    }
  });
  return findById(id);
};

const remove = async (id) => {
  if (!id) {
    throw new errors.BadRequestError("Missing post id");
  }
  return getDb().collection(constants.POST_COLLECTION).remove({ _id: ObjectId(id) });
};

const imageUpload = async (id, filePath) => {
  const imageUrl = await fileUpload(filePath, "posts");
  return update(id, { imageUrl });
};


module.exports = {
  checkPermission,
  findById,
  list,
  create,
  update,
  remove,
  imageUpload,
};