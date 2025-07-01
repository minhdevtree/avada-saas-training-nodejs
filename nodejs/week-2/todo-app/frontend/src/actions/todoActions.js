import { BASE_API_URL } from '../config/link';

const request = async (url, options = {}, defaultResponse = null) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      if (!defaultResponse) {
        throw new Error(errorData.message || 'Something went wrong');
      }
      return defaultResponse;
    }
    return await response.json();
  } catch (err) {
    console.error('API Error:', err.message);
    throw err;
  }
};

export const addTodo = async text => {
  const result = await request(`${BASE_API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return result.data;
};

export const updateTodo = async (id, updatedFields) => {
  const result = await request(`${BASE_API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields),
  });
  return result.data;
};

export const removeTodo = async id => {
  const result = await request(`${BASE_API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  return result.data;
};

export const removeManyTodos = async ids => {
  const result = await request(`${BASE_API_URL}/todos/removeMany`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return result.data;
};

export const updateManyTodos = async updates => {
  console.log('Updating many todos:', updates.length);
  const result = await request(`${BASE_API_URL}/todos/updateMany`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return result.data;
};
