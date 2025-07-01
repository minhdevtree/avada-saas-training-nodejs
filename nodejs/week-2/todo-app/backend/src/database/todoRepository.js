const fs = require('fs');
const todos = require('./todos.json');

/**
 *
 * @returns {Array} - Returns all todos
 */
function getAll() {
  return todos;
}

/**
 *
 * @param {*} id ID of the todo to be retrieved
 * @returns {Object} - Returns the todo with the specified id
 */
function getOne(id) {
  return todos.find(todo => todo.id === id);
}

/**
 *
 * @param {*} todo Todo object to be added
 * @returns {Object} - Returns the added todo
 */
function add(todo) {
  const newTodo = { isCompleted: false, ...todo, id: parseInt(Date.now()) };
  todos.push(newTodo);
  fs.writeFileSync('./src/database/todos.json', JSON.stringify(todos));
  return newTodo;
}

/**
 *
 * @param {*} id ID of the todo to be updated
 * @param {*} data Updated todo object
 * @returns {Object} - Returns the updated todo
 */
function update(id, data) {
  const index = todos.findIndex(todo => todo.id === parseInt(id));
  if (index === -1) {
    throw new Error('Todo not found');
  }
  const updatedTodo = {
    ...todos[index],
    ...data,
    id: parseInt(id),
  };
  console.log('>>> udtd', updatedTodo);
  todos[index] = updatedTodo;
  fs.writeFileSync('./src/database/todos.json', JSON.stringify(todos));
  return todos[index];
}

/**
 *
 * @param {*} id ID of the todo to be removed
 * @returns {Object} - Returns the removed todo
 */
function remove(id) {
  const index = todos.findIndex(todo => todo.id === parseInt(id));
  if (index === -1) {
    throw new Error('Todo not found');
  }
  const removedTodo = todos.splice(index, 1);

  fs.writeFileSync('./src/database/todos.json', JSON.stringify(todos));
  return removedTodo[0];
}

/**
 * Remove multiple todos by their IDs
 * @param {*} ids - Array of todo IDs to be removed
 * @returns {Array} - Returns an array of removed todos
 */
function removeMany(ids) {
  const removedTodos = [];
  ids.forEach(id => {
    const index = todos.findIndex(todo => todo.id === parseInt(id));
    if (index !== -1) {
      removedTodos.push(todos.splice(index, 1)[0]);
    }
  });
  fs.writeFileSync('./src/database/todos.json', JSON.stringify(todos));
  return removedTodos;
}

/**
 *
 * @param {*} updates Array of objects containing id and data for updating todos
 * @returns {Array} - Returns an array of updated todos
 */
function updateMany(updates) {
  const updatedTodos = [];
  updates.forEach(data => {
    const updatedTodo = update(data.id, data);
    console.log('Updated todo:', updatedTodo);
    updatedTodos.push(updatedTodo);
  });
  return updatedTodos;
}

module.exports = {
  getOne,
  getAll,
  add,
  update,
  remove,
  removeMany,
  updateMany,
};
