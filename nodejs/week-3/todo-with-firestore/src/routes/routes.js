const Router = require('koa-router');
const todoHandler = require('../handlers/todos/todoHandlers');
const createTodoValidationMiddleware = require('../middleware/todoValidationMiddleware');

// Prefix all routes with /books
const router = new Router({
  prefix: '/api',
});

router.get('/todos', todoHandler.getTodos);
router.get('/todos/:id', todoHandler.getTodo);
router.post(
  '/todos',
  createTodoValidationMiddleware('create'),
  todoHandler.save
);
router.put(
  '/todos/:id',
  createTodoValidationMiddleware('update'),
  todoHandler.update
);
router.delete('/todos/:id', todoHandler.remove);

module.exports = router;
