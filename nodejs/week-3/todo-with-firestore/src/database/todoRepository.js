const { BATCH_SIZE } = require('../const/batch');
const { batchProcess } = require('../helpers/batchHelper');
const { paginateCollection } = require('../helpers/paginationHelper');
const db = require('./firebase');
const { Timestamp } = require('firebase-admin/firestore');

const collection = db.collection('todos');

/**
 * Fetch all todos from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of todo objects.
 */
async function getAll() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// DONE: Should create helper file to make pagination

/**
 * Fetch many todos from the database with pagination.
 * @param {*} limit The maximum number of todos to fetch, default is 10.
 * @param {*} sort The sort order, either 'asc' or 'desc', default is 'desc'.
 * @param {*} lastTimestamp The timestamp to start fetching from, default is null.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of todo objects.
 */
async function getMany(limit = 10, sort = 'desc', lastTimestamp = null) {
  const result = await paginateCollection(collection, {
    limit,
    sort,
    lastTimestamp,
    keyName: 'todos',
  });

  return result;
}

// TODO: Should defined type in ts file
/**
 * Fetch a single todo by its ID.
 * @param {*} id The ID of the todo to fetch.
 * @returns {Promise<Object>} Returns a promise that resolves to a todo object.
 */
async function getOne(id) {
  const todo = await collection.doc(id).get();
  if (!todo.exists) {
    return null;
  }
  return {
    id: todo.id,
    ...todo.data(),
  };
}

/**
 * Add a new todo to the database.
 * @param {*} todo The todo object to add.
 * @returns {Promise<Object>} Returns a promise that resolves to the added todo object.
 */
async function add(todo) {
  const docRef = await collection.add({
    isCompleted: false,
    ...todo,
    createdAt: Timestamp.now(),
  });

  const doc = await docRef.get();
  return {
    id: doc.id,
    ...doc.data(),
  };
}

/**
 * Update an existing todo in the database.
 * @param {*} id The ID of the todo to update.
 * @param {*} data The updated todo data.
 * @returns {Promise<Object>} Returns a promise that resolves to the updated todo object.
 */
async function update(id, data) {
  await collection.doc(id).update(data);

  const updatedTodo = await getOne(id);
  return updatedTodo;
}

/**
 * Remove a todo from the database.
 * @param {*} id The ID of the todo to remove.
 * @returns {Promise<Object>} Returns a promise that resolves to the removed todo object.
 */
async function remove(id) {
  const deleteTodo = await getOne(id);
  if (!deleteTodo) {
    throw new Error('Todo not found');
  }
  await collection.doc(id).delete();
  return deleteTodo;
}

// DONE: Should make a helper file to write common code of remove many and update many

/**
 * Remove multiple todos from the database.
 * @param {*} ids The IDs of the todos to remove.
 * @returns {Promise<Object>} Returns a promise that resolves to an object containing the success and failed IDs.
 */
async function removeMany(ids) {
  return batchProcess(ids, BATCH_SIZE, (batch, id) => {
    const ref = collection.doc(id);
    batch.delete(ref);
  });
}

/**
 * Update multiple todos in the database.
 * @param {*} updates The updates to apply to the todos.
 * @returns {Promise<Object>} Returns a promise that resolves to an object containing the success and failed IDs.
 */
async function updateMany(updates) {
  return batchProcess(updates, BATCH_SIZE, (batch, data) => {
    const todoRef = collection.doc(data.id);
    const { id, ...updateData } = data;
    batch.update(todoRef, updateData);
  });
}

module.exports = {
  getOne,
  getAll,
  getMany,
  add,
  update,
  remove,
  removeMany,
  updateMany,
};
