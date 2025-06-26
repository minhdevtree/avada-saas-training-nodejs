const Router = require('@koa/router');
const Shopify = require('shopify-api-node');
const crypto = require('crypto');

const router = new Router();

const shopify = new Shopify({
  shopName: process.env.SHOP.replace('.myshopify.com', ''),
  accessToken: process.env.ACCESS_TOKEN,
});

// GET /webhooks => List all webhooks
router.get('/', async ctx => {
  try {
    const webhooks = await shopify.webhook.list();
    ctx.body = webhooks;
  } catch (error) {
    console.error('Failed to fetch webhooks:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch webhooks' };
  }
});

// POST /webhooks => Create new webhook
router.post('/', async ctx => {
  const { topic, address } = ctx.request.body;

  if (!topic || !address) {
    ctx.status = 400;
    ctx.body = { error: 'Missing topic or address' };
    return;
  }

  try {
    const webhook = await shopify.webhook.create({
      topic,
      address,
      format: 'json',
    });

    ctx.status = 201;
    ctx.body = webhook;
  } catch (error) {
    console.error('Failed to create webhook:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to create webhook' };
  }
});

// Not run💀
// HMAC validator (optional but recommended)
function isValidShopifyWebhook(ctx, secret) {
  const hmacHeader = ctx.headers['x-shopify-hmac-sha256'];
  const body = JSON.stringify(ctx.request.body);
  const generatedHash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(generatedHash, 'utf8'),
    Buffer.from(hmacHeader, 'utf8')
  );
}

// POST /webhooks/orders/create
router.post('/orders/create', async ctx => {
  const shopifySecret = process.env.SHOPIFY_API_SECRET;

  console.log('🔔 Received order webhook request');

  // if (!isValidShopifyWebhook(ctx, shopifySecret)) {
  //   console.error('❌ Invalid webhook signature');
  //   ctx.status = 401;
  //   ctx.body = 'Unauthorized webhook';
  //   return;
  // }

  const order = ctx.request.body;

  console.log('✅ Received order webhook:', {
    id: order.id,
    email: order.email,
    total_price: order.total_price,
    line_items: order.line_items?.map(i => ({
      title: i.title,
      quantity: i.quantity,
    })),
  });

  ctx.status = 200;
  ctx.body = 'Order received';
});

module.exports = router;
