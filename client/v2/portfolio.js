// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
"use strict";

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = "all";

// inititiqte selectors
const selectShow = document.querySelector("#show-select");
const selectPage = document.querySelector("#page-select");
const selectBrand = document.querySelector("#brand-select");
const sectionProducts = document.querySelector("#products");
const spanNbProducts = document.querySelector("#nbProducts");
const filtReleased = document.querySelector("#recentlyReleased");

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({ result, meta }) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
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
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = (products) => {
  let toDisplay =
    currentBrand == "all" ? products : byBrands(products)[currentBrand];
  if (filtReleased.checked)
    toDisplay = toDisplay.filter((product) => {
      const one_day = 24 * 60 * 60 * 1000;
      const diff = (new Date() - new Date(product.released)) / one_day;
      if (diff < 15) return product;
    });

  const fragment = document.createDocumentFragment();
  const div = document.createElement("div");
  let template;
  try {
    template = `
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Product</th>
          <th>Price</th>
          <th>Released</th>
        </tr>
    </thead>
    <tbody>`;
    template += toDisplay
      .map((product) => {
        return `
      <tr class="product" id=${product.uuid}>
        <th>${product.brand}</th>
        <th><a href="${product.link}">${product.name}</a></th>
        <th>${product.price}€</th>
        <th>${product.released}</th>
      </tr>
    `;
      })
      .join("");
    template += "</tbody></table>";
  } catch {
    template = `<p>No ${currentBrand} products in that page.</p>`;
  }

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = "<h2>Products</h2>";
  sectionProducts.appendChild(fragment);
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
 * Render brand selector
 * @param {Object} brand
 */
const renderBrand = (brands) => {
  let options = '<option value = "all">All brands</option>\n';
  Object.keys(brands).forEach((brand) => {
    options += `<option value = "${brand}">${brand}</option>\n`;
  });

  selectBrand.innerHTML = options;
  if (currentBrand == "all") selectBrand.selectedIndex = 0;
  else
    selectBrand.selectedIndex = Object.keys(brands).indexOf(currentBrand) + 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination) => {
  const { count } = pagination;
  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrand(byBrands(products));
};

/**
 * Get the products by brand
 * @param {Object} products
 * @returns Object
 */
const byBrands = (products) => {
  let brands = {};
  if (!products) return {};
  products.forEach((article) => {
    if (!brands[article.brand]) {
      brands[article.brand] = [];
    }

    let props = {};
    Object.keys(article)
      .slice(1)
      .forEach((prop) => (props[prop] = article[prop]));

    brands[article.brand].push(props);
  });
  return brands;
};

/**
 * Declaration of all Listeners
 */

/**
 * Refresh after a new selection
 */
const refresh = () => {
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
};

document.addEventListener("DOMContentLoaded", () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener("change", (event) => {
  currentPagination.pageSize = parseInt(event.target.value);
  refresh();
});

/**
 * Select page to display
 */
selectPage.addEventListener("change", (event) => {
  currentPagination.currentPage = parseInt(event.target.value);
  refresh();
});

/**
 * Select brand to display products
 */
selectBrand.addEventListener("change", (event) => {
  currentBrand = event.target.value;
  refresh();
});

filtReleased.addEventListener("change", refresh);
