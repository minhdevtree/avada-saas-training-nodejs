import { createContext, useContext, useEffect, useState } from 'react';
import useFetchApi from '../hooks/useFetchApi';

const BASE_API_URL = 'http://localhost:5000/api';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const { data, loading } = useFetchApi({
    url: `${BASE_API_URL}/todos`,
  });

  useEffect(() => {
    if (data) {
      setTodos(data.todos || []);
    }
  }, [data]);

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

  const addTodo = async text => {
    const result = await request(`${BASE_API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setTodos(prev => [...prev, result.data]);
  };

  const updateTodo = async (id, updatedFields) => {
    const result = await request(`${BASE_API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, ...result.data } : todo))
    );
  };

  const removeTodo = async id => {
    await request(`${BASE_API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        addTodo,
        updateTodo,
        removeTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
