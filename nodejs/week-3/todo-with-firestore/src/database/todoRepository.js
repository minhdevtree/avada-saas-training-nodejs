const db = require('./firebase');

const todosCollection = db.collection('todos');

async function getAll() {
  const snapshot = await todosCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

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

async function add(todo) {
  const docRef = await todosCollection.add({
    isCompleted: false,
    ...todo,
  });

  const doc = await docRef.get();
  return {
    id: doc.id,
    ...doc.data(),
  };
}

async function update(id, data) {
  const updatedTodo = await todosCollection
    .doc(id)
    .update(data)
    .then(async () => await getOne(id))
    .catch(error => {
      throw new Error(`Error updating todo: ${error.message}`);
    });
  return updatedTodo;
}

async function remove(id) {
  const deleteTodo = await getOne(id);
  if (!deleteTodo) {
    throw new Error('Todo not found');
  }
  await todosCollection.doc(id).delete();
  return deleteTodo;
}

module.exports = {
  getOne,
  getAll,
  add,
  update,
  remove,
};
