import { useEffect, useState } from 'react';

function useFetchApi({ url, defaultResponse = null }) {
  const [data, setData] = useState(defaultResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError(`Error: ${response.statusText}`);
        setLoading(false);
        return;
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setData(defaultResponse);
    }
  };

  useEffect(() => {
    fetchData().finally(() => {
      setLoading(false);
    });
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}

export default useFetchApi;
