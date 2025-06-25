import { BASE_API_URL } from './const';

const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
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
