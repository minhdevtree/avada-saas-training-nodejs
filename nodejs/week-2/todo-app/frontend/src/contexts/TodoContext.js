import { createContext, useContext, useEffect, useState } from 'react';
import useFetchApi from '../hooks/api/useFetchApi';
import { BASE_API_URL } from '../config/link';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const { data, loading } = useFetchApi({
    url: `${BASE_API_URL}/todos`,
    defaultResponse: { todos: [] },
  });

  useEffect(() => {
    if (data) {
      setTodos(data.todos || []);
    }
  }, [data]);

  const add = async todo => {
    setTodos(prev => [...prev, todo]);
  };

  const update = async updateTodo => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === updateTodo.id ? { ...todo, ...updateTodo } : todo
      )
    );
  };

  const remove = async id => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        add,
        update,
        remove,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
