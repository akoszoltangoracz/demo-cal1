require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express()

const { getDb } = require('./db');

const JWT_SECRET = 'abc'; // TODO

const port = process.env.PORT || 8001;
app.use(bodyParser.json({limit: '50mb'}));
app.use('/static', express.static('static'))

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

app.post('/api/activities', async (req, res) => {
  try {
    const { title, description } = req.body;

    await getDb().collection('activities').insertOne({
      title,
      description,
    });

    res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    json.status(500).json(err);
  }
});

app.get('/api/activities', async (req, res) => {
  try {
    const results = await getDb().collection('activities').find().toArray();
    const count = await getDb().collection('activities').count();

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
