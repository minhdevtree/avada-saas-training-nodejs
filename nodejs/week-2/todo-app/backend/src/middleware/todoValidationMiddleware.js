const yup = require('yup');

/**
 * Middleware to validate todo data
 * @param {*} validationType Type of validation ('create' or 'update' or 'updateMany'). Defaults to 'update'.
 * @returns {Function} Middleware function
 * @throws {Error} If validation fails, responds with 400 status and error details.
 */
function createTodoValidationMiddleware(validationType = 'update') {
  return async function todoValidationMiddleware(ctx, next) {
    try {
      const postData = ctx.request.body;

      const baseSchema = {
        text: yup.string().min(3).max(100),
        isCompleted: yup.boolean(),
      };

      let schema;

      switch (validationType) {
        case 'create':
          schema = yup.object().shape({
            text: yup.string().min(3).max(100).required(),
            isCompleted: yup.boolean(),
          });
          break;
        case 'update':
          schema = yup.object().shape(baseSchema);
          break;
        case 'updateMany':
          schema = yup.array().of(
            yup.object().shape({
              id: yup.number().required(),
              text: yup.string().min(3).max(100),
              isCompleted: yup.boolean(),
            })
          );
          break;
      }

      await schema.validate(postData);
      await next();
    } catch (e) {
      console.log('Validation errors found:', e.errors);
      ctx.status = 400;
      ctx.body = {
        success: false,
        errors: e.errors,
      };
    }
  };
}

module.exports = createTodoValidationMiddleware;
