const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

console.log(MONGO_URI, "mongo");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbFunction = async (dbName) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db(dbName);
  console.log("Connected!");

  await db.collection("users").insertOne({ name: "Buck Rogers" });

  client.close();
  console.log("disconnected!");
};

dbFunction("exercise_1");
