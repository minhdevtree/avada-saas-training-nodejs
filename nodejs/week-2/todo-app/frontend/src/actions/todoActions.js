// TODO: Change to use hook (useFetch, useCreate,...)

import { BASE_API_URL } from '../config/link';

/**
 * Sends a request to the API.
 * @param {*} url The URL to send
 * @param {*} options The options to configure the request
 * @param {*} defaultResponse The default response to return in case of an error
 * @returns {Promise<any>} The response data from the API or the default response
 * @throws {Error} If the request fails or the response is not ok
 */
export const request = async (url, options = {}, defaultResponse = null) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
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

/**
 * Add a new todo to the database.
 * @param {*} text The text of the todo to add
 * @returns {Promise<Object>} The response data
 */
export const addTodo = async text => {
  const result = await request(`${BASE_API_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return result.data;
};

/**
 * Update an existing todo in the database.
 * @param {*} id The ID of the todo to update
 * @param {*} updatedFields The fields to update in the todo
 * @returns {Promise<Object>} The response data
 */
export const updateTodo = async (id, updatedFields) => {
  const result = await request(`${BASE_API_URL}/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedFields),
  });
  return result.data;
};

/**
 * Remove a todo from the database.
 * @param {*} id The ID of the todo to remove
 * @returns {Promise<Object>} The response data
 */
export const removeTodo = async id => {
  const result = await request(`${BASE_API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  return result.data;
};

/**
 * Remove multiple todos from the database.
 * @param {*} ids The IDs of the todos to remove
 * @returns {Promise<Object>} The response data
 */
export const removeManyTodos = async ids => {
  const result = await request(`${BASE_API_URL}/todos/removeMany`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  return result.data;
};

/**
 * Update multiple todos in the database.
 * @param {*} updates The updates data to apply to the todos
 * @returns {Promise<Object>} The response data
 */
export const updateManyTodos = async updates => {
  const result = await request(`${BASE_API_URL}/todos/updateMany`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return result.data;
};

/**
 * Fetch todos from the API.
 * @param {*} limit The maximum number of todos to fetch
 * @param {*} sort The sort order for the todos
 * @param {*} lastTimestamp The timestamp to fetch todos after
 * @returns {Promise<Object>} The fetched todos
 */
export const getTodos = async (
  limit = 10,
  sort = 'desc',
  lastTimestamp = null
) => {
  const url = new URL(`${BASE_API_URL}/todos`);
  url.searchParams.append('limit', limit);
  url.searchParams.append('sort', sort);
  if (lastTimestamp) {
    url.searchParams.append('lastTimestamp', lastTimestamp);
  }
  const result = await request(url.toString(), {
    method: 'GET',
  });

  return result;
};
