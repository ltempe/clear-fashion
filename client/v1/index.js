// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */
 
//#########################################################################################
// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable
console.log('###############################################################################');
console.log('🎯 TODO: The cheapest t-shirt');

console.log(MY_FAVORITE_BRANDS.some(brand => brand.name === 'Hopaal'));
var min = 1000;
var link = '';

marketplace.forEach(article => 
{
	if (MY_FAVORITE_BRANDS.some(brand => 
		brand.name.toLowerCase() === article.brand.toLowerCase()
		&& article.name.toLowerCase().includes('t-shirt') ))
	{
		const actualPrice = article.price;
		if (actualPrice < min)
		{
			min = actualPrice;
			link = article.link;
		}
	}
});

console.log(link + '\n' + min + '€');




/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

//#########################################################################################
// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable
console.log('###############################################################################');
console.log('🎯 TODO: The cheapest t-shirt');

const nb = marketplace.length;
console.log('Number of products');
console.log(nb + ' products');


//#########################################################################################
// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have
console.log('###############################################################################');
console.log('🎯 TODO: Brands name');

let brand_names = new Set();
marketplace.forEach(article =>
{ brand_names.add(article.brand); })

console.log(brand_names);
console.log(brand_names.size + ' brands');


//#########################################################################################
// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable
console.log('###############################################################################');
console.log('Sort by price');

/*
First methode
function InsertionSort(market, condition)
{
	for (let i = 0; i < market.length; i++)
	{
		let article = market[i];
		let j = i;
		while (j > 0 && condition(market[j-1], article))
		{
			market[j] = market[j-1];
			j--;
		}
		market[j] = article;
	}
}

let market_sorted_prices = marketplace.slice();
InsertionSort(market_sorted_prices, (m, a) => m.price > a.price);
*/

//That one is better
let market_sorted_prices = marketplace.slice();
market_sorted_prices.sort((a1, a2) => 
	a1.price < a2.price ?  -1 : 
		a1.price === a2.price ?  0 : 1);

console.table(market_sorted_prices);

/*
// To check the prices ascending.
let prices_string = '';
market_sorted_prices.forEach(article => prices_string += article.price + ';');
console.log(prices_string);
*/


//#########################################################################################
// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable
console.log('###############################################################################');
console.log('🎯 TODO: Sort by date');

let market_sorted_dates = marketplace.slice();
//InsertionSort(market_sorted_dates, (m, a) => m.date > a.date);

market_sorted_dates.sort((a1, a2) => 
	a1.date < a2.date ?  -1 : 
		a1.date === a2.date ?  0 : 1);
console.table(market_sorted_dates);

/*
// To check the dates ascending.
let dates_string = '';
market_sorted_dates.forEach(article => dates_string += article.date + '\t');
console.log(dates_string);
*/


//#########################################################################################
// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list
console.log('###############################################################################');
console.log('🎯 TODO: Filter a specific price range');
let products_50_100 = new Array();
market_sorted_prices.forEach(article =>
{
	if (article.price >= 50 && article.price <= 100)
	{products_50_100.push(article);}
});
console.table(products_50_100);


<<<<<<< HEAD
//#########################################################################################
// 🎯 TODO: Average Basket
// 1. Determine the average basket of the marketplace
=======
// 🎯 TODO: Average price
// 1. Determine the average price of the marketplace
>>>>>>> 366a5ecac46cc22874c918455f258da430ba06ca
// 2. Log the average
console.log('###############################################################################');
console.log('🎯 TODO: Average Basket');
function mean(market)
{
	let m = 0;
	market.forEach(article => m += article.price);
	return m / market.length;
}

console.log(`Average basket of marketplace : ${mean(marketplace).toFixed(2)}€`);


//#########################################################################################
/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands
console.log('###############################################################################');
console.log('🎯 TODO: Products by brands');

let brands = {};

marketplace.forEach(article => 
{ 
	if (!brands[article.brand]) 
	{brands[article.brand] = [];}

	let props = {};
	Object.keys(article).slice(1).forEach(prop => props[prop] = article[prop]);
	
	brands[article.brand].push(props);
});

Object.keys(brands).forEach(brand => 
{
	console.log(brand);
	console.table(brands[brand]);
});

let nb_products = {};
//console.log(brands[0].length);
Object.keys(brands).forEach(brand => nb_products[brand] = brands[brand].length);
console.table(nb_products);


//#########################################################################################
// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort
console.log('###############################################################################');
console.log('🎯 TODO: Sort by price for each brand');

let brands_sort_price = JSON.parse(JSON.stringify(brands));

Object.keys(brands_sort_price).forEach(brand => brands_sort_price[brand].sort((a1, a2) => 
	a1.price < a2.price ?  1 : 
		a1.price === a2.price ?  0 : -1));
		
Object.keys(brands_sort_price).forEach(brand => 
{
	console.log(brand);
	console.table(brands_sort_price[brand]);
});	


//#########################################################################################
// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort
console.log('###############################################################################');
console.log('🎯 TODO: Sort by date for each brand');

let brands_sort_date = JSON.parse(JSON.stringify(brands));

Object.keys(brands_sort_date).forEach(brand => brands_sort_date[brand].sort((a1, a2) => 
	a1.date < a2.date ?  1 : 
		a1.date === a2.date ?  0 : -1));
		
Object.keys(brands_sort_date).forEach(brand => 
{
	console.log(brand);
	console.table(brands_sort_date[brand]);
});



//#########################################################################################
/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products
console.log('###############################################################################');
console.log('🎯 TODO: Compute the p90 price value');

let p90_map = {};

Object.keys(brands_sort_price).forEach(brand =>
{
	const n90 = Math.ceil(brands_sort_price[brand].length*0.9);
	p90_map[brand] = { 'P90 price value' : brands_sort_price[brand][n90].price + ' €'};
	
});
console.table(p90_map);


//#########################################################################################
/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

//#########################################################################################
// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.
console.log('###############################################################################');
console.log('🎯 TODO: New released products');

let cotele_sort_date = COTELE_PARIS.slice();
cotele_sort_date.sort((a1,a2) => 
	a1.released < a2.released ?  1 : 
		a1.released === a2.released ?  0 : -1);
		
const max_date = new Date(cotele_sort_date[0].released);
const min_date = new Date(cotele_sort_date.slice(-1)[0].released);

const one_day = 24 * 60 * 60 * 1000;
const diff = (max_date - min_date) / one_day;
let check = diff < 15;
console.log(check);
console.log(check ?
	'Assuming that today is the most recent product\'s released date, the difference \
between today and the oldest product\'s released date is less than 2 weeks : only\
 ' + diff + ' days, so we have only new released products' :
	'More than 2 weeks separate the newest and the oldest product of the list ' + diff + ' days, \
so we cannot have only new released products, even if today was the \
most recent product\'s released date');


//#########################################################################################
// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€
console.log('###############################################################################');
console.log('🎯 TODO: Reasonable price');

check = true;
COTELE_PARIS.forEach(article =>
{
	if (article.price >= 100)
	{ check = false; }
});
console.log(check);
console.log(check ?
	'All the articles are under 100€, it\'s a reasonable price shop' :
	'Some articles are more expensive than 100€, it\'s not a reasonable price shop');


//#########################################################################################
// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product
console.log('###############################################################################');
console.log('🎯 TODO: Find a specific product');
let product_expected;
COTELE_PARIS.forEach(article => 
{
	if (article.uuid === 'b56c6d88-749a-5b4c-b571-e5b5c6483131')
	{product_expected = article}
});
console.table(product_expected);


//#########################################################################################
// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product
console.log('###############################################################################');
console.log('🎯 TODO: Delete a specific product');

const index_remove = COTELE_PARIS.indexOf(product_expected);
COTELE_PARIS.splice(index_remove, 1)
console.table(COTELE_PARIS);


// 🎯 TODO: Save the favorite product
console.log('###############################################################################');
console.log('🎯 TODO: Save the favorite product');

let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

blueJacket.name = 'BLUE JACKET';
blueJacket.released = new Date().toISOString().slice(0, 10);
COTELE_PARIS.push(blueJacket);
console.table(COTELE_PARIS);

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;

jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?
console.log('Blue jacket');
console.table(blueJacket);

console.log('Jacket');
console.table(jacket);

console.log('Both blueJacket and jacket have favorite as property');

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties

jacket = {};
Object.keys(blueJacket).forEach(prop => jacket[prop] = blueJacket[prop]);
jacket.favorite = true;

console.log('Blue jacket');
console.table(blueJacket);

console.log('Jacket');
console.table(jacket);

console.log('Now we notice jacket has a favorite property while blueJacket doesn\'t.');

/**
 * 🎬
 * The End
 * 🎬
 */


//#########################################################################################
// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage
//localStorage.setItem('favorite_brands', MY_FAVORITE_BRANDS);
//const obj = localStorage.getItem('favorite_brands');
console.log('###############################################################################');
console.log('🎯 TODO: Save in localStorage');

localStorage.object = JSON.stringify(MY_FAVORITE_BRANDS);
console.table(JSON.parse(localStorage.object));
//Object.keys(obj).forEach(a => console.log(obj[a]));
//console.table(JSON.parse(obj));