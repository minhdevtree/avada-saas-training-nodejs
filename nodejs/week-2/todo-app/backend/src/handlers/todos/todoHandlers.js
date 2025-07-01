const {
  getAll: getAllTodos,
  getOne: getOneTodo,
  add: addTodo,
  update: updateTodo,
  remove: removeTodo,
  removeMany: removeTodos,
  updateMany: updateTodos,
} = require('../../database/todoRepository');

/**
 * Get all todos
 * @param {*} ctx - Koa context object
 * @return {Promise<void>}
 */
async function getTodos(ctx) {
  try {
    const todos = getAllTodos();

    ctx.body = {
      todos,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

/**
 * Get a todo by ID
 * @param {*} ctx - Koa context object
 * @returns {Promise<void>}
 */
async function getTodo(ctx) {
  try {
    const { id } = ctx.params;
    const getCurrentTodo = getOneTodo(id);
    if (getCurrentTodo) {
      return (ctx.body = {
        todo: getCurrentTodo,
      });
    }
    throw new Error('Todo Not Found with that id!');
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Save a new todo
 * @param {*} ctx - Koa context object
 * @returns {Promise<void>}
 */
async function save(ctx) {
  try {
    const postData = ctx.request.body;
    const newTodo = addTodo(postData);

    ctx.status = 201;
    return (ctx.body = {
      success: true,
      data: newTodo,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Update a todo by ID
 * @param {*} ctx - Koa context object
 * @returns {Promise<void>}
 */
async function update(ctx) {
  try {
    const { id } = ctx.params;
    const postData = ctx.request.body;
    const updatedTodo = updateTodo(id, postData);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: updatedTodo,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Remove a todo by ID
 * @param {*} ctx - Koa context object
 * @returns {Promise<void>}
 */
async function remove(ctx) {
  try {
    const { id } = ctx.params;
    const removedTodo = removeTodo(id);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: removedTodo,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Remove multiple todos by their IDs
 * @param {*} ctx - Koa context object
 * @returns {Promise<void>}
 */
async function removeMany(ctx) {
  try {
    const { ids } = ctx.request.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid or empty IDs array');
    }
    const removedTodos = removeTodos(ids);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: removedTodos,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Update multiple todos
 * @param {*} ctx Koa context object
 * @returns {Promise<void>}
 */
async function updateMany(ctx) {
  try {
    const updates = ctx.request.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Invalid or empty updates array');
    }
    const updatedTodos = updateTodos(updates);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: updatedTodos,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

module.exports = {
  getTodos,
  getTodo,
  save,
  update,
  remove,
  removeMany,
  updateMany,
};
