/**
 * Middleware to process product query parameters with default values.
 * It sets the limit to 5 and sort order to 'asc' by default.
 * @param {*} ctx Koa context
 * @param {*} next Next middleware function
 */
async function productQueryMiddleware(ctx, next) {
  const { limit, sort } = ctx.query;

  ctx.state.query = {
    limit: parseInt(limit) || 5,
    sort: sort === 'desc' ? 'desc' : 'asc',
  };

  await next();
}

module.exports = productQueryMiddleware;
