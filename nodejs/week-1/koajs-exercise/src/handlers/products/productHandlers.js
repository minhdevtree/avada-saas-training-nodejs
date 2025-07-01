const {
  getMany,
  getOne: getOneProduct,
  add: addProduct,
  update: updateProduct,
  remove: removeProduct,
} = require('../../database/productRepository');

/**
 * Get products
 * @param {*} ctx Koa context
 * @returns {Promise<void>}
 */
async function getProducts(ctx) {
  try {
    const { limit, sort } = ctx.query;
    const products = getMany(limit, sort);

    ctx.body = {
      products,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

/**
 * Get product by ID
 * @param {*} ctx Koa context
 * @returns {Promise<void>}
 */
async function getProduct(ctx) {
  try {
    const { id } = ctx.params;
    const fields = ctx.query.fields;
    const getCurrentProduct = getOneProduct(id, fields);
    if (getCurrentProduct) {
      return (ctx.body = {
        product: getCurrentProduct,
      });
    }

    throw new Error('Product Not Found with that id!');
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Save a new product
 * @param {*} ctx Koa context
 * @returns {Promise<void>}
 */
async function save(ctx) {
  try {
    const postData = ctx.request.body;
    addProduct(postData);

    ctx.status = 201;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Update a product by ID
 * @param {*} ctx Koa context
 * @returns {Promise<void>}
 */
async function update(ctx) {
  try {
    const { id } = ctx.params;
    const postData = ctx.request.body;
    updateProduct(id, postData);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Remove a product by ID
 * @param {*} ctx Koa context
 * @returns {Promise<void>}
 */
async function remove(ctx) {
  try {
    const { id } = ctx.params;
    removeProduct(id);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

module.exports = {
  getProducts,
  getProduct,
  save,
  update,
  remove,
};
