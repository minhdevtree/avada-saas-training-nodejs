const {
  getAll: getAllTodos,
  getMany: getManyTodos,
  getOne: getOneTodo,
  add: addTodo,
  update: updateTodo,
  remove: removeTodo,
  removeMany: removeTodos,
  updateMany: updateTodos,
} = require('../../database/todoRepository');
const { Timestamp } = require('firebase-admin/firestore');

/**
 * Fetch many todos from the database with pagination.
 * @param {*} ctx Koa context object
 * @returns {Promise<void>} Returns a promise that resolves when the todos are fetched.
 */
async function getTodos(ctx) {
  try {
    const { limit, sort, lastTimestamp } = ctx.query;
    const parseTimestamp = lastTimestamp
      ? Timestamp.fromDate(new Date(lastTimestamp))
      : null;
    const { todos, pagination } = await getManyTodos(
      +limit,
      sort,
      parseTimestamp
    );
    ctx.body = {
      todos,
      pagination,
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
 * Fetch a single todo by its ID.
 * @param {*} ctx Koa context object
 * @returns {Promise<void>} Returns a promise that resolves when the todo is fetched.
 */
async function getTodo(ctx) {
  try {
    const { id } = ctx.params;
    const getCurrentTodo = await getOneTodo(id);
    if (getCurrentTodo) {
      return (ctx.body = {
        todo: getCurrentTodo,
      });
    }
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: 'Todo Not Found with that id!',
    });
  } catch (e) {
    ctx.status = 400;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Save a new todo to the database.
 * @param {*} ctx Koa context object
 * @returns {Promise<void>} Returns a promise that resolves when the todo is saved.
 */
async function save(ctx) {
  try {
    const postData = ctx.request.body;
    const newTodo = await addTodo(postData);

    ctx.status = 201;
    return (ctx.body = {
      success: true,
      data: newTodo,
    });
  } catch (e) {
    ctx.status = 400;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Update an existing todo in the database.
 * @param {*} ctx Koa context object
 * @returns {Promise<void>} Returns a promise that resolves when the todo is updated.
 */
async function update(ctx) {
  try {
    const { id } = ctx.params;
    const postData = ctx.request.body;
    const updatedTodo = await updateTodo(id, postData);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: updatedTodo,
    });
  } catch (e) {
    ctx.status = 400;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Remove a todo from the database.
 * @param {*} ctx Koa context object
 * @returns {Promise<void>} Returns a promise that resolves when the todo is removed.
 */
async function remove(ctx) {
  try {
    const { id } = ctx.params;
    const removedTodo = await removeTodo(id);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: removedTodo,
    });
  } catch (e) {
    ctx.status = 400;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Remove multiple todos from the database.
 * @param {*} ctx Koa context object
 * @returns {Promise<void>} Returns a promise that resolves when the todos are removed.
 */
async function removeMany(ctx) {
  try {
    const { ids } = ctx.request.body;
    console.log('>>> ids', ids);
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid or empty IDs array');
    }

    const { success, failed } = await removeTodos(ids);

    if (failed.length > 0) {
      success.length > 0 ? (ctx.status = 207) : (ctx.status = 400);
      return (ctx.body = {
        success: success.length > 0 ? true : false,
        data: { success, failed },
      });
    }

    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: { success, failed },
    });
  } catch (e) {
    ctx.status = 400;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Update multiple todos in the database.
 * @param {*} ctx Koa context object
 * @returns {Promise<void>} Returns a promise that resolves when the todos are updated.
 */
async function updateMany(ctx) {
  try {
    const updates = ctx.request.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Invalid or empty updates array');
    }
    const { success, failed } = await updateTodos(updates);

    if (failed.length > 0) {
      success.length > 0 ? (ctx.status = 207) : (ctx.status = 400);
      return (ctx.body = {
        success: success.length > 0 ? true : false,
        data: { success, failed },
      });
    }
    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: { success, failed },
    });
  } catch (e) {
    ctx.status = 400;
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
