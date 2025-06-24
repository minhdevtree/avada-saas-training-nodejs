const fs = require('fs');
const products = require('./products.json');

function getAll(limit = 5, sort = 'asc') {
  const sortedProducts = [...products].sort((a, b) =>
    sort === 'asc'
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );
  return sortedProducts.slice(0, limit);
}

function getOne(id, fields) {
  const product = products.find(product => product.id === parseInt(id));
  if (!product) return undefined;
  if (!fields) return product;

  const pickedFields = {};
  fields.split(',').forEach(field => {
    if (field in product) {
      pickedFields[field] = product[field];
    }
  });
  return pickedFields;
}

function add(data) {
  const updatedProducts = [
    { ...data, createdAt: new Date().toISOString() },
    ...products,
  ];
  return fs.writeFileSync(
    './src/database/products.json',
    JSON.stringify(updatedProducts)
  );
}

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
  getAll,
  add,
  update,
  remove,
};
