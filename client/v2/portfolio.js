// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = 'all';

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = currentBrand == 'all' ?
    result : byBrands(result)[currentBrand];
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
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');
  
  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};


/**
 * Render brand selector
 * @param {Object} brand
 */
 const renderBrand = brands => 
 {
    let options = '<option value = "all">All brands</option>\n';
    Object.keys(brands).forEach(brand =>
      {
        options += `<option value = "${brand}">${brand}</option>\n`;
        i++;
      });
 
   selectBrand.innerHTML = options;
   if (currentBrand == 'all') selectBrand.selectedIndex = 0;
   else selectBrand.selectedIndex = 1;
 };


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
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
const byBrands = products =>
{
  let brands = {};
  products.forEach(article => 
  { 
    if (!brands[article.brand]) 
    {brands[article.brand] = [];}

    let props = {};
    Object.keys(article).slice(1).forEach(prop => props[prop] = article[prop]);
    
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
const refresh = () =>
{
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
};

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);


/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  currentPagination.pageSize = parseInt(event.target.value);
  refresh();
});

/**
 * Select page to display
 */
selectPage.addEventListener('change', event =>
{
  currentPagination.currentPage = parseInt(event.target.value);
  refresh();
});

/**
 * Select brand to display products
 */
selectBrand.addEventListener('change', event => {
  currentBrand = event.target.value;
  refresh();
});