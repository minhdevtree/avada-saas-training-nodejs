const fs = require('fs');
const todos = require('./todos.json');

function getAll() {
  return todos;
}

function getOne(id) {
  return todos.find(todo => todo.id === id);
}

function add(todo) {
  const newTodo = { isCompleted: false, ...todo, id: parseInt(Date.now()) };
  todos.push(newTodo);
  fs.writeFileSync('./src/database/todos.json', JSON.stringify(todos));
  return newTodo;
}

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
  todos[index] = updatedTodo;
  fs.writeFileSync('./src/database/todos.json', JSON.stringify(todos));
  return todos[index];
}

function remove(id) {
  const index = todos.findIndex(todo => todo.id === parseInt(id));
  if (index === -1) {
    throw new Error('Todo not found');
  }
  const removedTodo = todos.splice(index, 1);

  fs.writeFileSync('./src/database/todos.json', JSON.stringify(todos));
  return removedTodo[0];
}

module.exports = {
  getOne,
  getAll,
  add,
  update,
  remove,
};
