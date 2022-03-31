const fetch = require("node-fetch");
const { v5: uuidv5 } = require("uuid");

const randomDate = (start = new Date(2021, 0, 1), end = new Date()) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split("T")[0];

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async (url) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const products = (await response.json()).products;
      let final = [];
      products.forEach((element) => {
        const link = `https://www.dedicatedbrand.com/en/${element["canonicalUri"]}`;
        if (element["name"])
          final.push({
            _id: uuidv5(link, uuidv5.URL),
            link,
            brand: "dedicated",
            name: element["name"],
            price: parseFloat(element["price"]["price"]),
            photo: element["image"][0],
            _id: uuidv5(link, uuidv5.URL),
            released: randomDate(),
          });
      });
      return final;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
