const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const { name } = req.body;
  const newUser = { name };
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise_1");

  await db.collection("users").insertOne(newUser);

  client.close();

  res.status(201).json({ status: 201, data: newUser });
};

module.exports = { addUser };
