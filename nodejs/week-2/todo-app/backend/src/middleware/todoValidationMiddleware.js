const yup = require('yup');

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
      }

      await schema.validate(postData);
      await next();
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        errors: e.errors,
      };
    }
  };
}

module.exports = createTodoValidationMiddleware;
