import { useState, useEffect, useCallback } from 'react';

const useFetch = (serviceFunction, deps = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enabled = true } = options;

  const executeFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceFunction();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [serviceFunction]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    executeFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, loading, error, refetch: executeFetch };
};

export default useFetch;
