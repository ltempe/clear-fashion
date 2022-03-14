const fs = require("fs");
let products = [];

const { MongoClient } = require("mongodb");
const MONGODB_URI =
  "mongodb+srv://ltempe:ltempe@clearfashion.4nii2.mongodb.net?retryWrites=true&w=majority";
const MONGODB_DB_NAME = "clearfashion";
let client;
let db;
let collectionProducts;

const connect = (module.exports.connect = async () => {
  if (db) console.log("Already connected");
  else {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });
    db = await client.db(MONGODB_DB_NAME);
    collectionProducts = await db.collection("products");
    console.log("Connection success");
  }
});

const insert = (module.exports.insert = async (products) => {
  try {
    await connect();
    await collectionProducts.deleteMany();
    const results = await collectionProducts.insertMany(products, {
      ordered: false,
    });
    console.log("Everything was insered");
    return results;
  } catch (error) {
    console.log(error);
    return null;
  }
});

const close = (module.exports.close = async () => {
  await client.close();
  console.log("Connection closed");
});

const find = (module.exports.find = async (query = {}) => {
  try {
    await connect();
    const result = await collectionProducts.find(query).toArray();
    console.log(result.length);
    return result;
  } catch (error) {
    console.log(error);
  }
});

//console.log(require("../products/dedicated.json") + );
for (const file of fs.readdirSync("./products"))
  products = products.concat(require("../products/" + file));

const test = async () => {
  await insert(products);
  await find({ brand: "montlimart" });
};

test();
