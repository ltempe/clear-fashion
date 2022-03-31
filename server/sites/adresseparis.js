const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { v5: uuidv5 } = require("uuid");

const randomDate = (start = new Date(2021, 0, 1), end = new Date()) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split("T")[0];

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = (data) => {
  const $ = cheerio.load(data);
  return $(".right-block")
    .map((i, element) => {
      link = $(element).find(".product-name").attr("href");
      return {
        _id: uuidv5(link, uuidv5.URL),
        link,
        brand: "adresse paris",
        price: parseFloat($(element).find(".price").text()),
        name: $(element).find(".product-name").attr("title"),
        photo: $(element)
          .parent()
          .find(".product_img_link")
          .find("img")
          .attr("data-original"),
        released: randomDate(),
      };
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
const scrape = (module.exports.scrape = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.text();
      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
});

scrape("https://adresse.paris/630-toute-la-collection?id_category=630&n=118");
