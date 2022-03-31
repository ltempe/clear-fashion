// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
"use strict";

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = "all";

// inititiqte selectors
const inputShow = document.querySelector("#show-input");
const selectPage = document.querySelector("#page-select");
const selectBrand = document.querySelector("#brand-select");
const sectionProducts = document.querySelector("#products");

const spanShow = document.querySelector("#spanShow");
const spanNbProducts = document.querySelector("#nbProducts");
const spanNbNewProducts = document.querySelector("#nbNewProducts");
const spanNbDispProducts = document.querySelector("#nbDispProducts");

const checkReleased = document.querySelector("#recentlyReleased");
const checkPrice = document.querySelector("#reasonablePrice");
const checkFavoriteProducts = document.querySelector("#favoriteProducts");

const selectSort = document.querySelector("#sort-select");

const spanP50 = document.querySelector("#p50");
const spanP90 = document.querySelector("#p90");
const spanP95 = document.querySelector("#p95");

const spanLastReleased = document.querySelector("#lastReleased");
const checkFav = document.getElementsByClassName("favProduct");

const serverLink = "https://server-omega-olive.vercel.app/";
const searchLink = serverLink + "products/:search?";

const favorites = localStorage.favorites
  ? new Set(JSON.parse(localStorage.favorites))
  : new Set();

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({ result, meta }) => {
  currentProducts = result;
  currentPagination = meta;
};

const fetchProducts = async (link) => {
  try {
    const response = await fetch(link);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return { currentProducts, currentPagination };
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return { currentProducts, currentPagination };
  }
};

/**
 * Get the pX value price of the displayed products
 * @param {Array} products
 * @param {number} pVal
 * @returns
 */
const getP = (products, pVal) => {
  let sortedProducts = products.slice();
  sortedProducts.sort((p1, p2) =>
    p1.price < p2.price ? 1 : p1.price === p2.price ? 0 : -1
  );
  const n = Math.floor(sortedProducts.length * (pVal / 100));
  return sortedProducts[n].price;
};

/**
 * Create a template of a table for displaying the products
 * @param {Array} products
 * @returns
 */
const createTemplate = (products) => {
  let template = `
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Product</th>
          <th>Image</th>
          <th>Price</th>
          <th>Released</th>
          <th>Favorite</th>
        </tr>
    </thead>
    <tbody>`;
  template += products
    .map((product) => {
      return `
      <tr class="product" id=${product._id}>
        <th>${product.brand}</th>
        <th><a href="${product.link}">${product.name}</a></th>
        <th style="max-height: 150px; max-width: 150px;">
            <img height="100%" width="100%" src="${
              product.photo ? product.photo : "#"
            }">
        </th>
        <th>${product.price}€</th>
        <th>${product.released}</th>
        <th><input class="favProduct" type="checkbox"></input></th>
      </tr>
    `;
    })
    .join("");
  template += "</tbody></table>";

  return template;
};

/**
 * Create event listeners to checkbox of 'favorite' for products, and check all
 * favorite products
 * @param {Object} products
 */
const manageFavorite = (products) => {
  [...checkFav].forEach((chk) => {
    chk.addEventListener("change", (event) => {
      const id = chk.parentElement.parentElement.id;
      const product = products.find((product) => product._id === id);
      product["favorite"] = chk.checked;
      if (product["favorite"]) favorites.add(id);
      else favorites.delete(id);
      refresh(parseInt(selectPage.value));
    });
  });

  if (products) {
    products.forEach((product) => {
      if (favorites.has(product._id))
        [...checkFav].find(
          (chk) => chk.parentElement.parentElement.id === product._id
        ).checked = true;
    });
  }

  localStorage.favorites = JSON.stringify([...favorites]);
};

const renderProducts = (products) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement("div");

  let template;

  if (products && products.length > 0) {
    spanP50.innerHTML = getP(products, 50) + "€";
    spanP90.innerHTML = getP(products, 90) + "€";
    spanP95.innerHTML = getP(products, 95) + "€";
    template = createTemplate(products);
  } else template = `<p>No products to display...</p>`;

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = "<h2>Products</h2>";
  sectionProducts.appendChild(fragment);

  manageFavorite(products);
  spanNbDispProducts.innerHTML = products ? products.length : 0;
};

const renderBrand = (brands) => {
  let options = '<option value = "all">All brands</option>\n';
  brands.forEach(
    (brand) => (options += `<option value = "${brand}">${brand}</option>\n`)
  );

  selectBrand.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = (pagination) => {
  const { currentPage, pageCount } = pagination;
  const options = Array.from(
    { length: pageCount },
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join("");

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination) => {
  const { count } = pagination;
  spanNbProducts.innerHTML = count;

  inputShow.max = count;
  spanShow.innerHTML = inputShow.value;
};

const render = async (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

const refresh = (nbPage = 1) => {
  const queries = ["page=" + nbPage];
  queries.push("size=" + parseInt(inputShow.value));

  if (checkPrice.checked) queries.push("price=$lte:50");

  if (checkFavoriteProducts.checked)
    queries.push("_id=$in:" + Array.from(favorites).join(","));

  if (selectBrand.selectedIndex != 0)
    queries.push("brand=" + selectBrand.value);

  switch (selectSort.value) {
    case "price-asc":
      queries.push("sort=price:1");
      break;

    case "price-desc":
      queries.push("sort=price:-1");
      break;

    case "date-asc":
      queries.push("sort=released:-1");
      break;

    case "date-desc":
      queries.push("sort=released:1");
      break;
  }

  const daysAgo = new Date().getDate() - 15;
  const d = new Date(new Date().setDate(daysAgo));
  const d_15 = d.toLocaleDateString().split("/").reverse().join("-");
  if (checkReleased.checked) {
    queries.push("released=$gte:" + d_15);
  }

  const link = (searchLink + queries.join("&")).replace(" ", "%20");
  const linkInfo =
    link + (checkReleased.checked ? "" : "&released=$gte:" + d_15) + "&info=1";
  fetch(linkInfo)
    .then((res) => res.json())
    .then((infos) => {
      spanLastReleased.innerHTML = infos["lastReleased"];
      spanNbNewProducts.innerHTML = infos["nbNew"];
    });
  fetchProducts(link)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
};

document.addEventListener("DOMContentLoaded", async () => {
  const daysAgo = new Date().getDate() - 15;
  const d = new Date(new Date().setDate(daysAgo));
  const d_15 = d.toLocaleDateString().split("/").reverse().join("-");
  const linkInfo =
    searchLink.replace(" ", "%20") + "released=$gte:" + d_15 + "&info=1";
  fetch(linkInfo)
    .then((res) => res.json())
    .then((infos) => {
      spanLastReleased.innerHTML = infos["lastReleased"];
      spanNbNewProducts.innerHTML = infos["nbNew"];
    });

  await fetchProducts(searchLink)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
  const response = await fetch(serverLink + "brands");
  const brands = await response.json();
  await renderBrand(brands);
});

selectPage.addEventListener("change", (event) =>
  refresh(parseInt(event.target.value))
);

inputShow.addEventListener("change", () => refresh());

selectBrand.addEventListener("change", () => refresh());

checkReleased.addEventListener("change", () => refresh());

checkPrice.addEventListener("change", () => refresh());

selectSort.addEventListener("change", () => refresh());

checkFavoriteProducts.addEventListener("change", () => refresh());
