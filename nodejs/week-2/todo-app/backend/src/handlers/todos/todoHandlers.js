const {
  getAll: getAllTodos,
  getOne: getOneTodo,
  add: addTodo,
  update: updateTodo,
  remove: removeTodo,
} = require('../../database/todoRepository');

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

module.exports = {
  getTodos,
  getTodo,
  save,
  update,
  remove,
};
