const { MongoClient } = require("mongodb");
const fs = require("file-system");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise_1");

  const newGreetings = await db.collection("greetings").insertMany(greetings);
  assert.equal(1, newGreetings.insertedCount);

  console.log("success");

  client.close();
};

batchImport();
