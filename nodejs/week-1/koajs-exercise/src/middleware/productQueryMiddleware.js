// limit: number of products to return
// sort: sorting order (asc|desc)

async function productQueryMiddleware(ctx, next) {
  const { limit, sort } = ctx.query;

  ctx.state.query = {
    limit: parseInt(limit) || 5,
    sort: sort === 'desc' ? 'desc' : 'asc',
  };

  await next();
}

module.exports = productQueryMiddleware;
