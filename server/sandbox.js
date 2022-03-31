/* eslint-disable no-console, no-process-exit */
//const dedicatedbrand = require("./sites/dedicatedbrand");
const { v5: uuidv5 } = require("uuid");
const montlimart = require("./sites/montlimart");
const adresseparis = require("./sites/adresseparis");
const dedicatedapi = require("./sites/dedicatedapi");
const mongo = require("./mongodb");
const fs = require("fs");

// inspect https://vercel.com/ltempe/server/GCumKXqLoxk47Evp7wCdggUFLxG8
// production https://server-omega-olive.vercel.app

async function sandbox(eshop) {
  try {
    let allProducts = [];
    console.log(`🕵️‍♀️  browsing ${eshop.link} source`);
    const products = await eshop.module.scrape(eshop.link);
    allProducts = await allProducts.concat(products);
    const file = `products/${eshop.brand}.json`;
    await fs.writeFileSync(file, JSON.stringify(allProducts));

    console.log("Saved in " + file);
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

//const [, , eshop] = process.argv;
const eshops = [
  {
    module: dedicatedapi,
    brand: "dedicated",
    link: "https://www.dedicatedbrand.com/en/loadfilter",
  },
  {
    module: montlimart,
    brand: "montlimart",
    link: "https://www.montlimart.com/toute-la-collection.html",
  },
  {
    module: adresseparis,
    brand: "adresseparis",
    link: "https://adresse.paris/630-toute-la-collection?id_category=630&n=123",
  },
];

const test = async () => {
  for (let eshop of eshops) await sandbox(eshop);

  products = [];
  for (const file of fs.readdirSync("./products"))
    products = await products.concat(require("./products/" + file));

  await mongo.insert(products);
  await mongo.close();
};

test();
