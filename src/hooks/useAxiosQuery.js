import { useRef, useEffect, useState } from 'react';
import { axiosClient } from '../axios-client';

export const useAxiosQuery = (url, options) => {
  const [data, setData] = useState(null);

  /**
   * Possible states:
   * - loading
   * - error
   * - success
   * - refetching
   */
  const [queryState, setQueryState] = useState('idle');

  const abortControllerRef = useRef();

  async function fetchData() {
    if (queryState === 'loading' && abortControllerRef?.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setQueryState(data ? 'refetching' : 'loading');
      const response = await axiosClient.get(url, {
        signal: abortControllerRef.current.signal,
      });

      if (response.status >= 200 && response.status < 300) {
        setData(
          options?.transformData ? options.transformData(response.data) : response.data
        );
        setQueryState('success');
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      if (error.name !== 'CanceledError') {
        setQueryState('error');
        console.log('An error occurred while fetching data:', error);
      }
    }
  }

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef?.current?.abort();
    };
  }, [url]);

  return {
    data,
    setData,
    loading: (queryState === 'loading' || queryState === 'idle') && data == null,
    refetching: queryState === 'refetching',
    refetch: fetchData,
  };
};
