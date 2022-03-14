const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongo = require("./mongodb");

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require("body-parser").json());
app.use(cors());
app.use(helmet());

app.options("*", cors());

app.get("/", (request, response) => {
  response.send({ ack: true });
});

app.get("/products", async (request, response) => {
  const products = await mongo.find();
  response.send(products);
});

app.get("/:id", async (request, response) => {
  const product = await mongo.find({ _id: request.params.id });
  await response.send(product);
});

app.get("/products/search", async (request, response) => {
  const query = request.query;
  const toFind = {};
  if (query.brand) toFind["brand"] = query.brand;
  if (query.price) toFind["price"] = parseFloat(query.price);
  //if (query.limit) toFind["limit"] = parseInt(query.limit);
  const result = await mongo.find(toFind).toArray();
  await response.send(result);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
