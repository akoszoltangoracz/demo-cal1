const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);
let db;

const connect = async () => {
  await client.connect();
  db = client.db(process.env.MONGODB_DATABASE);
  console.log('connected to mongo');
};

const getDb = () => {
  return db;
}

connect();

module.exports = {
    client,
    getDb,
};
