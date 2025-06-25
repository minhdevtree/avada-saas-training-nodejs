import { useEffect, useState } from 'react';

function useFetchApi({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const response = await fetch(url);
    if (!response.ok) {
      setError(`Error: ${response.statusText}`);
      setLoading(false);
      return;
    }
    const result = await response.json();
    setData(result);
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}

export default useFetchApi;
