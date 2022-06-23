const multer = require('multer');
const path = require("path");
const uuid = require("uuid");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, './uploads'); },
    filename: function (req, file, callback) {
      callback(null, `${uuid.v4()}${path.extname(file.originalname)}`);
    }
  })
});

module.exports = upload;