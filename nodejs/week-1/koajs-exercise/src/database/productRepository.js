const fs = require('fs');
const products = require('./products.json');
const pick = require('../utils/pick');

/**
 *
 * @param {*} limit Limit of products to return
 * @param {*} sort Sort order (asc or desc) by createdAt field
 * @returns Array of products
 */
function getMany(limit = 5, sort = 'asc') {
  const sortedProducts = [...products].sort((a, b) =>
    sort === 'asc'
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );
  return sortedProducts.slice(0, limit);
}

/**
 *
 * @param {*} id ID of the product to retrieve
 * @param {*} fields Comma-separated fields to return from the product
 * @returns Product object or null if not found
 */
function getOne(id, fields) {
  const product = products.find(product => product.id === parseInt(id));
  if (!product) return null;
  if (!fields) return product;

  return pick(product, fields.split(','));
}

/**
 *
 * @param {*} data Data of the product to add
 * @returns void
 */
function add(data) {
  const updatedProducts = [
    { ...data, createdAt: new Date().toISOString() },
    ...products,
  ];
  fs.writeFileSync(
    './src/database/products.json',
    JSON.stringify(updatedProducts)
  );
}

/**
 *
 * @param {*} id ID of the product to update
 * @param {*} data Data to update the product with
 * @returns void
 */
function update(id, data) {
  const productIndex = products.findIndex(
    product => product.id === parseInt(id)
  );
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  const updatedProduct = {
    ...products[productIndex],
    ...data,
    id: parseInt(id),
  };

  products[productIndex] = updatedProduct;
  fs.writeFileSync('./src/database/products.json', JSON.stringify(products));
}

/**
 *
 * @param {*} id ID of the product to remove
 * @returns void
 */
function remove(id) {
  const productIndex = products.findIndex(
    product => product.id === parseInt(id)
  );
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  products.splice(productIndex, 1);
  fs.writeFileSync('./src/database/products.json', JSON.stringify(products));
}

module.exports = {
  getOne,
  getMany,
  add,
  update,
  remove,
};
