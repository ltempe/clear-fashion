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
const spanNbNewProducts = document.querySelector("#nbNewProducts");

const checkReleased = document.querySelector("#recentlyReleased");
const checkPrice = document.querySelector("#reasonablePrice");

const selectSort = document.querySelector("#sort-select");

const spanP50 = document.querySelector("#p50");
const spanP90 = document.querySelector("#p90");
const spanP95 = document.querySelector("#p95");

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

const getNewProducts = (products) => {};

/**
 * Filter products by new released or not.
 * @param {Object} products
 */
const filterByReleased = (products) => {
  return products.filter((product) => {
    const one_day = 24 * 60 * 60 * 1000;
    const diff = (new Date() - new Date(product.released)) / one_day;
    if (diff < 15) return product;
  });
};

/**
 * Filter products by reasonable price or not.
 * @param {Object} products
 */
const filterByPrice = (products) => {
  return products.filter((product) => {
    if (product.price <= 50) return product;
  });
};

/**
 * Sort products by the value of the sortSelect item.
 * @param {Object} products
 */
const sortBy = (products) => {
  switch (selectSort.value) {
    case "price-asc":
      products.sort((p1, p2) =>
        p1.price < p2.price ? -1 : p1.price === p2.price ? 0 : 1
      );
      break;

    case "price-desc":
      products.sort((p1, p2) =>
        p1.price < p2.price ? 1 : p1.price === p2.price ? 0 : -1
      );
      break;

    case "date-asc":
      products.sort((p1, p2) =>
        p1.released < p2.released ? 1 : p1.released === p2.released ? 0 : -1
      );
      break;

    case "date-desc":
      products.sort((p1, p2) =>
        p1.released < p2.released ? -1 : p1.released === p2.released ? 0 : 1
      );
      break;
  }
};

const getP = (products, pVal) => {
  let sortedProducts = products.slice();
  sortedProducts.sort((p1, p2) =>
    p1.price < p2.price ? 1 : p1.price === p2.price ? 0 : -1
  );
  const n = Math.floor(sortedProducts.length * (pVal / 100));
  return sortedProducts[n].price;
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = (products) => {
  let toDisplay =
    currentBrand == "all" ? products : byBrands(products)[currentBrand];

  const fragment = document.createDocumentFragment();
  const div = document.createElement("div");

  spanNbNewProducts.innerHTML = 0;
  let template;

  if (toDisplay) {
    const newProducts = filterByReleased(toDisplay);
    if (checkReleased.checked) toDisplay = newProducts;
    if (checkPrice.checked) toDisplay = filterByPrice(toDisplay);
    sortBy(toDisplay);

    spanNbNewProducts.innerHTML = newProducts.length;
    spanP50.innerHTML = getP(toDisplay, 50) + "€";
    spanP90.innerHTML = getP(toDisplay, 90) + "€";
    spanP95.innerHTML = getP(toDisplay, 95) + "€";

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
  } else {
    template = `<p>No ${currentBrand} products in that page.</p>`;
    currentBrand = "all";
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

/**
 * Filter by new released
 */
checkReleased.addEventListener("change", refresh);

/**
 * Filter by reasonable price
 */
checkPrice.addEventListener("change", refresh);

selectSort.addEventListener("change", refresh);
