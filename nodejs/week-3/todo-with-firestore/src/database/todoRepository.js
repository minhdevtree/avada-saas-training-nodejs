const { BATCH_SIZE } = require('../const/batch');
const db = require('./firebase');
const { Timestamp } = require('firebase-admin/firestore');

const todosCollection = db.collection('todos');

/**
 * Fetch all todos from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of todo objects.
 */
async function getAll() {
  const snapshot = await todosCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

//https://firebase.google.com/docs/firestore/query-data/query-cursors
/**
 * Fetch many todos from the database with pagination.
 * @param {*} limit The maximum number of todos to fetch, default is 10.
 * @param {*} sort The sort order, either 'asc' or 'desc', default is 'desc'.
 * @param {*} lastTimestamp The timestamp to start fetching from, default is the beginning of time.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of todo objects.
 */
async function getMany(limit = 10, sort = 'desc', lastTimestamp = null) {
  let query = todosCollection.orderBy('createdAt', sort);

  if (lastTimestamp) {
    query = query.startAfter(lastTimestamp);
  }

  query = query.limit(limit);

  const snapshot = await query.get();
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  let hasNext = false;
  if (todos.length > 0) {
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextQuery = todosCollection
      .orderBy('createdAt', sort)
      .startAfter(lastDoc.get('createdAt'))
      .limit(1);
    const nextSnap = await nextQuery.get();
    hasNext = !nextSnap.empty;
  }

  // let hasPrev = false;
  // if (todos.length > 0 && lastTimestamp) {
  //   const firstDoc = snapshot.docs[0];
  //   const prevQuery = todosCollection
  //     .orderBy('createdAt', sort)
  //     .endBefore(firstDoc.get('createdAt'))
  //     .limitToLast(1);
  //   const prevSnap = await prevQuery.get();
  //   hasPrev = !prevSnap.empty;
  // }

  return {
    todos,
    pagination: {
      hasNext,
      // hasPrev,
      lastTimestamp:
        todos.length > 0 ? todos[todos.length - 1].createdAt.toDate() : null,
    },
  };
}

/**
 * Fetch a single todo by its ID.
 * @param {*} id The ID of the todo to fetch.
 * @returns {Promise<Object>} Returns a promise that resolves to a todo object.
 */
async function getOne(id) {
  const todo = await todosCollection.doc(id).get();
  if (!todo.exists) {
    throw new Error('Todo not found');
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
  const docRef = await todosCollection.add({
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
  await todosCollection.doc(id).update(data);

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
  await todosCollection.doc(id).delete();
  return deleteTodo;
}

//https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
/**
 * Remove multiple todos from the database.
 * @param {*} ids The IDs of the todos to remove.
 * @returns {Promise<Object>} Returns a promise that resolves to an object containing the success and failed IDs.
 */
async function removeMany(ids) {
  const batches = Math.ceil(ids.length / BATCH_SIZE);
  const results = {
    success: [],
    failed: [],
  };

  for (let i = 0; i < batches; i++) {
    const batch = db.batch();
    const start = i * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const batchIds = ids.slice(start, end);

    try {
      for (const id of batchIds) {
        const todoRef = todosCollection.doc(id);
        batch.delete(todoRef);
      }

      await batch.commit();
      results.success.push(...batchIds);
    } catch (error) {
      results.failed.push(...batchIds);
    }
  }

  if (results.success.length === 0 && results.failed.length > 0) {
    throw new Error('Failed to remove any todos.');
  }

  if (results.failed.length > 0) {
    console.warn(
      `${results.success.length} deleted, ${results.failed.length} failed.`
    );
  }

  return results;
}

/**
 * Update multiple todos in the database.
 * @param {*} updates The updates to apply to the todos.
 * @returns {Promise<Object>} Returns a promise that resolves to an object containing the success and failed IDs.
 */
async function updateMany(updates) {
  const batches = Math.ceil(updates.length / BATCH_SIZE);
  const results = {
    success: [],
    failed: [],
  };

  for (let i = 0; i < batches; i++) {
    const batch = db.batch();
    const start = i * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const batchUpdates = updates.slice(start, end);

    try {
      for (const { id, data } of batchUpdates) {
        const todoRef = todosCollection.doc(id);
        batch.update(todoRef, data);
      }

      await batch.commit();

      results.success.push(...batchUpdates);
    } catch (error) {
      results.failed.push(...batchUpdates);
    }
  }

  if (results.success.length === 0 && results.failed.length > 0) {
    throw new Error('Failed to update any todos.');
  }

  if (results.failed.length > 0) {
    console.warn(
      `${results.success.length} updated, ${results.failed.length} failed.`
    );
  }

  return results;
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
