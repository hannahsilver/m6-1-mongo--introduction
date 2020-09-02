const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();

    const db = client.db("exercise_1");

    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const { _id } = req.params;

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("exercise_1");

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });

    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise_1");

  const greetings = await db.collection("greetings").find().toArray();

  let start = 0;
  let limit = 24;

  if (req.query.start !== undefined) {
    start = Number(req.query.start);
  }

  if (req.query.limit !== undefined) {
    limit = Number(req.query.limit);
  }

  if (greetings.length > 0) {
    res
      .status(200)
      .json({ status: 200, data: greetings.slice(start, start + limit) });
  } else {
    res.status(400).json({ status: 404, data: "Greetings Not Found" });
  }

  client.close();
};

const deleteGreeting = async (req, res) => {
  const { _id } = req.params;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercise_1");

    const r = await db.collection("greetings").deleteOne({ _id });
    assert.equal(1, r.deletedCount);

    res.status(204).json({ status: 204, data: _id });
    client.close();
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: "error" });
  }
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const newValues = { $set: { ...req.body } }; //{$set: {hello:salut}}

  const query = { _id }; //{_id: 'KM'}
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("exercise_1");

  const r = await db.collection("greetings").updateOne(query, newValues);
  // const r = await db.collection("greetings").updateOne({_id:'KM'}, {$set: {hello:'salut', goodbye:'bye', _id:'EN'}});

  assert.equal(1, r.matchedCount);
  assert.equal(1, r.modifiedCount);

  client.close();

  res.status(200).json({ status: 200, _id, ...req.body });
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
