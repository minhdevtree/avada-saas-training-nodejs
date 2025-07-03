/**
 * Middleware to process query parameters with default values.
 * It sets the limit to 10, sort order to 'asc' by default and lastItem to 0 if not provided.
 * @param {*} ctx Koa context
 * @param {*} next Next middleware function
 */
async function queryMiddleware(ctx, next) {
  const { limit, sort, lastTimestamp } = ctx.query;

  ctx.state.query = {
    limit: parseInt(limit) || 10,
    sort: sort === 'desc' ? 'desc' : 'asc',
    lastTimestamp: lastTimestamp,
  };

  await next();
}

module.exports = queryMiddleware;
