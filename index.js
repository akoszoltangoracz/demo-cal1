require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const { ObjectID }  = require('mongodb');
const multer = require('multer');
const app = express();
const fs = require('fs');
const AWS = require('aws-sdk');
const _ = require('lodash');

const { getDb } = require('./db');

app.use(morgan('tiny'));

const { AWS_REGION, IMAGE_BUCKET, JWT_SECRET } = process.env;

const eventCoverUrl = filename => `https://${IMAGE_BUCKET}.s3-${AWS_REGION}.amazonaws.com/eventCover/${filename}`;
const interestGroupCoverUrl = filename => `https://${IMAGE_BUCKET}.s3-${AWS_REGION}.amazonaws.com/interestGroupCover/${filename}`;

AWS.config.update({region: AWS_REGION});
const s3 = new AWS.S3({apiVersion: '2006-03-01', region: AWS_REGION});

const INTEREST_GROUP_COLLECTION = 'interestGroups';
const EVENT_COLLECTION = 'events';
const USER_COLLECTION = 'users';
const EVENT_CHAT_COLLECTION = 'eventChat';
const INTEREST_GROUP_CHAT_COLLECTION = 'interestGroupChat';

const MASKED_USER_FIELDS = ['password'];

const port = process.env.PORT || 8001;
app.use(bodyParser.json({limit: '50mb'}));
app.use('/static', express.static('static'))

const authMw = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return next();
  const tokenContents = jwt.verify(authorization, JWT_SECRET);
  const { id: userId } = tokenContents;

  const user = await getDb().collection(USER_COLLECTION).findOne({
    _id: ObjectID(userId),
  });

  req.user = user;
  next();
};

app.use(authMw);

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, './uploads'); },
    filename: function (req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

app.get('/', (req, res) => {
  res.redirect('/static')
})

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    await getDb().collection('users').insertOne({
      username,
      password, // TODO hash
    });

    res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await getDb().collection('users').findOne({
      username,
      password,
    });

    if (!user) {
      return res.json({
        status: false,
        user: null,
        token: null,
      });
    }

    const userData = {
      id: user._id.toString(),
      username: user.username
    };

    const token = jwt.sign(userData, JWT_SECRET, {
      expiresIn: '1y'
    })
    res.json({
      status: true,
      user: userData,
      token,
    });
  } catch (err) {
    console.log(err)
  }
});

app.get('/api/me', (req, res) => {
  if (!req.user) {
    return res.json({
      status: false,
      user: null,
    });
  }

  return res.json({
    status: true,
    user: _.omit(req.user, MASKED_USER_FIELDS),
  });
});

app.get('/api/users', async (req, res) => {
  try {
    const { ids } = req.query;
    const query = {};

    console.log(ids)

    if (ids) {
      const idList = ids.split(',');
      query._id = {
        $in: idList.map(id => ObjectID(id))
      };
    }
    const results = await getDb().collection(USER_COLLECTION).find(query).toArray();
    const count = await getDb().collection(USER_COLLECTION).count(query);

    res.json({
      status: true,
      results: results.map(u => _.omit(u, MASKED_USER_FIELDS)),
      count,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.post('/api/me/addInterestGroup', async (req, res) => {
  try {
    const { interestGroupId } = req.body;

    const { _id: userId } = req.user;

    await getDb().collection(USER_COLLECTION).updateOne({
      _id: userId,
    }, {
      $addToSet: {
        interestGroupIds: ObjectID(interestGroupId),
      },
    });

    await getDb().collection(INTEREST_GROUP_COLLECTION).updateOne({
      _id: ObjectID(interestGroupId),
    }, {
      $addToSet: {
        userIds: userId,
      },
    });

    return res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post('/api/me/addEvent', async (req, res) => {
  try {
    const { eventId } = req.body;

    const { _id: userId } = req.user;

    await getDb().collection(USER_COLLECTION).updateOne({
      _id: userId,
    }, {
      $addToSet: {
        eventIds: ObjectID(eventId),
      },
    });

    await getDb().collection(EVENT_COLLECTION).updateOne({
      _id: ObjectID(eventId),
    }, {
      $addToSet: {
        userIds: userId,
      },
    });

    return res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post('/api/interestGroups', async (req, res) => {
  try {
    const { title, description } = req.body;

    await getDb().collection(INTEREST_GROUP_COLLECTION).insertOne({
      title,
      description,
      userIds: [],
    });

    res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    json.status(500).json(err);
  }
});

// multipart, not json!
app.post('/api/interestGroups/:interestGroupId/cover', upload.single('coverFile'), async (req, res) => {
  try {
    const { interestGroupId } = req.params;
    const readStream = fs.createReadStream(req.file.path);

    const params = {
      ACL: 'public-read',
      Bucket: IMAGE_BUCKET,
      Key: `interestGroupCover/${req.file.filename}`,
      Body: readStream
    };
      
    await s3.putObject(params).promise();

    await getDb().collection(INTEREST_GROUP_COLLECTION).updateOne({
        _id: ObjectID(interestGroupId),
    },
    {
      $set: {
          coverUrl: interestGroupCoverUrl(req.file.filename),
      }
    });

    res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// if `ids` query param is present then assume it's comma separated and filter by id
app.get('/api/interestGroups', async (req, res) => {
  try {
    const { ids } = req.query;
    const query = {};

    if (ids) {
      const idList = ids.split(',');
      query._id = {
        $in: idList.map(id => ObjectID(id))
      };
    }
    const results = await getDb().collection(INTEREST_GROUP_COLLECTION).find(query).toArray();
    const count = await getDb().collection(INTEREST_GROUP_COLLECTION).count(query);

    res.json({
      status: true,
      results,
      count,
    });
  } catch (err) {
    console.log(err);
    json.status(500).json(err);
  }
});

// if `ids` query param is present then assume it's comma separated and filter by id
app.get('/api/events', async (req, res) => {
  try {
    const { ids } = req.query;
    const query = {};

    console.log(ids)
    if (ids) {
      const idList = ids.split(',');
      query._id = {
        $in: idList.map(id => ObjectID(id))
      };
    }
    const results = await getDb().collection(EVENT_COLLECTION).find(query).toArray();
    const count = await getDb().collection(EVENT_COLLECTION).count(query);

    res.json({
      status: true,
      results,
      count,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, interestGroupId } = req.body;

    await getDb().collection(EVENT_COLLECTION).insertOne({
      title,
      description,
      date: new Date(date),
      interestGroupId: ObjectID(interestGroupId),
      userIds: [],
    });

    res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post('/api/events/:eventId/cover', upload.single('coverFile'), async (req, res) => {
  try {
    const { eventId } = req.params;
    const readStream = fs.createReadStream(req.file.path);

    const params = {
      ACL: 'public-read',
      Bucket: IMAGE_BUCKET,
      Key: `eventCover/${req.file.filename}`,
      Body: readStream
    };
      
    await s3.putObject(params).promise();

    await getDb().collection(EVENT_COLLECTION).updateOne({
        _id: ObjectID(eventId),
    },
    {
      $set: {
          coverUrl: eventCoverUrl(req.file.filename),
      }
    });

    res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post('/api/events/:eventId/chat', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { _id: userId} = req.user;
    const { message } = req.body;

    await getDb().collection(EVENT_CHAT_COLLECTION).insertOne({
      eventId: ObjectID(eventId),
      userId,
      message,
      createdAt: new Date(),
    });

    return res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// interest group chat
app.post('/api/interestGroups/:interestGroupId/chat', async (req, res) => {
  try {
    const { interestGroupId } = req.params;
    const { _id: userId} = req.user;
    const { message } = req.body;

    await getDb().collection(INTEREST_GROUP_CHAT_COLLECTION).insertOne({
      interestGroupId: ObjectID(interestGroupId),
      userId,
      message,
      createdAt: new Date(),
    });

    return res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.get('/api/interestGroups/:interestGroupId/chat', async (req, res) => {
  try {
    const { interestGroupId } = req.params;

    const results = await getDb().collection(INTEREST_GROUP_CHAT_COLLECTION).find({
      interestGroupId: ObjectID(interestGroupId),
    })
    .sort({ createdAt: 1})
    .toArray();

    const count = await getDb().collection(INTEREST_GROUP_CHAT_COLLECTION).find({
      interestGroupId: ObjectID(interestGroupId),
    }).count();

    return res.json({
      status: true,
      results,
      count,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.get('/api/events/:eventId/chat', async (req, res) => {
  try {
    const { eventId } = req.params;

    const results = await getDb().collection(EVENT_CHAT_COLLECTION).find({
      eventId: ObjectID(eventId),
    })
    .sort({ createdAt: 1})
    .toArray();

    const count = await getDb().collection(EVENT_CHAT_COLLECTION).find({
      eventId: ObjectID(eventId),
    }).count();

    return res.json({
      status: true,
      results,
      count,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
