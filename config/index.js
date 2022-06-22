module.exports = {
  constants: require("./constants"),
  JWT_SECRET: process.env.JWT_SECRET,
  AWS_REGION: process.env.AWS_REGION,
  IMAGE_BUCKET: process.env.IMAGE_BUCKET,
}