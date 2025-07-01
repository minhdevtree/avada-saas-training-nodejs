const yup = require('yup');

/**
 * Middleware to validate product data.
 * @param {*} validationType Type of validation ('create' or 'update'). Defaults to 'update'.
 * @returns {Function} Middleware function
 * @throws {Error} If validation fails, responds with 400 status and error details.
 */
function createProductValidationMiddleware(validationType = 'update') {
  return async function productValidationMiddleware(ctx, next) {
    try {
      const postData = ctx.request.body;

      const baseSchema = {
        name: yup.string(),
        price: yup.number().positive(),
        description: yup.string(),
        product: yup.string(),
        color: yup.string(),
        image: yup.string().url(),
      };

      let schema;

      switch (validationType) {
        case 'create':
          schema = yup.object().shape({
            id: yup.number().positive().integer().required(),
            name: baseSchema.name.required(),
            price: baseSchema.price.required(),
            description: baseSchema.description.required(),
            product: baseSchema.product.required(),
            color: baseSchema.color.required(),
            image: baseSchema.image.required(),
          });
          break;
        case 'update':
          schema = yup.object().shape(baseSchema);
      }

      await schema.validate(postData);
      await next();
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        errors: e.errors,
        errorName: e.name,
      };
    }
  };
}

module.exports = createProductValidationMiddleware;
