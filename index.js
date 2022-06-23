require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require("./api/router");

app.use(morgan('tiny'));

const port = process.env.PORT || 8001;
app.use(bodyParser.json({limit: '50mb'}));
app.use('/static', express.static('static'))

app.use("/api", router);

app.use(function (err, req, res, next) {
  res.status(err.httpCode || 500).json({
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
