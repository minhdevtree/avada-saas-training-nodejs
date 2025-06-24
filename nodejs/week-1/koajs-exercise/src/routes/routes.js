const Router = require('koa-router');
const productHandler = require('../handlers/products/productHandlers');
const productQueryMiddleware = require('../middleware/productQueryMiddleware');
const { getAll: getAllProducts } = require('../database/productRepository');
const createProductValidationMiddleware = require('../middleware/productValidationMiddleware');

const router = new Router();
//   {
//   prefix: '/api',
// }

router.get('/products', async ctx => {
  const limit = 1000;
  const sort = 'desc';
  const products = getAllProducts(limit, sort);
  await ctx.render('pages/product', { products });
});

router.get('/api/products', productQueryMiddleware, productHandler.getProducts);
router.get('/api/products/:id', productHandler.getProduct);
router.post(
  '/api/products',
  createProductValidationMiddleware('create'),
  productHandler.save
);
router.put(
  '/api/products/:id',
  createProductValidationMiddleware('update'),
  productHandler.update
);
router.delete('/api/products/:id', productHandler.remove);

module.exports = router;
