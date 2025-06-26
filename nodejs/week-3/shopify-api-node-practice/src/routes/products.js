const Router = require('@koa/router');
const Shopify = require('shopify-api-node');

const router = new Router();

const shopify = new Shopify({
  shopName: process.env.SHOP.replace('.myshopify.com', ''),
  accessToken: process.env.ACCESS_TOKEN,
});

// GET /products => list products
router.get('/', async ctx => {
  try {
    const products = await shopify.product.list({ limit: 5 });
    ctx.body = products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch products' };
  }
});

// POST /products => create product
router.post('/', async ctx => {
  try {
    const { title, body_html, vendor } = ctx.request.body;

    const newProduct = await shopify.product.create({
      title,
      body_html,
      vendor,
    });

    ctx.status = 201;
    ctx.body = newProduct;
  } catch (error) {
    console.error('Failed to create product:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to create product' };
  }
});

module.exports = router;
