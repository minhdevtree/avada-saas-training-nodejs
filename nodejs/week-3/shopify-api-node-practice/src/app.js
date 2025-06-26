require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const productsRoutes = require('./routes/products');
const webhooksRoutes = require('./routes/webhooks');

const app = new Koa();
const router = new Router();

router.use('/products', productsRoutes.routes());
router.use('/webhooks', webhooksRoutes.routes());

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
