const { AWS_REGION, IMAGE_BUCKET } = require("../config");
const fs = require("fs");
const path = require("path");
const AWS = require('aws-sdk');
AWS.config.update({ region: AWS_REGION });
const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: AWS_REGION });

const fileUpload = async (filePath, folder) => {
  const readStream = fs.createReadStream(filePath);
  const key = `${folder}/${path.basename(filePath)}`;
  const params = {
    ACL: 'public-read',
    Bucket: IMAGE_BUCKET,
    Key: key,
    Body: readStream
  };

  await s3.putObject(params).promise();
  return `https://${IMAGE_BUCKET}.s3-${AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = {
  fileUpload,
}