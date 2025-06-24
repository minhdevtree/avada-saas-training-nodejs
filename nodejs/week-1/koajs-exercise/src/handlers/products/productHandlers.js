const {
  getAll: getAllProducts,
  getOne: getOneProduct,
  add: addProduct,
  update: updateProduct,
  remove: removeProduct,
} = require('../../database/productRepository');

async function getProducts(ctx) {
  try {
    const { limit, sort } = ctx.query;
    const products = getAllProducts(limit, sort);

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
