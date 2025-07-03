import { createContext, useContext, useEffect, useState } from 'react';
// import useFetchApi from '../hooks/api/useFetchApi';
// import { BASE_API_URL } from '../config/link';
import { getTodos } from '../actions/todoActions';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [sort, setSort] = useState('desc');
  // const { data, loading } = useFetchApi({
  //   url: `${BASE_API_URL}/todos`,
  //   defaultResponse: { todos: [] },
  // });
  const [hasNext, setHasNext] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(null);

  /**
   * Fetch todos from the API.
   * @param {*} clear - Whether to clear the current todos.
   * @returns {Promise<void>} A promise that resolves when the todos are fetched.
   */
  const fetchTodos = async (clear = false) => {
    setLoading(true);
    const result = await getTodos(10, sort, clear ? null : lastTimestamp);
    if (result) {
      clear
        ? setTodos(result.todos)
        : setTodos(prev => [...prev, ...result.todos]);
      setHasNext(result.pagination?.hasNext || false);
      setLastTimestamp(result.pagination?.lastTimestamp || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos(true).then(() => {
      setLoadMore(false);
    });
  }, [sort]);

  useEffect(() => {
    if (loadMore) {
      fetchTodos().then(() => {
        setLoadMore(false);
      });
    }
  }, [loadMore]);

  const add = todo => {
    sort === 'desc'
      ? setTodos(prev => [todo, ...prev])
      : !lastTimestamp && setTodos(prev => [...prev, todo]);
  };

  const update = updateTodo => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === updateTodo.id ? { ...todo, ...updateTodo } : todo
      )
    );
  };

  const remove = id => {
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
        hasNext,
        loadMore,
        setLoadMore,
        setSort,
        sort,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
