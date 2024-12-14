import { useRef, useEffect, useState } from 'react';
import { axiosClient } from '../axios-client';

export const useAxiosQuery = (url, options) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef();

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    abortControllerRef.current.signal.onabort = () => {
      console.log('Aborted!');
    };
    async function fetchData() {
      setLoading(true);
      const { data } = await axiosClient.get(url, {
        signal: abortControllerRef.current.signal,
      });

      if (options?.transformData) {
        setData(options.transformData(data));
      } else {
        setData(data);
      }

      setLoading(false);
    }

    fetchData();

    return () => {
      abortControllerRef.current.abort();
    };
  }, [url]);

  return { data, setData, loading };
};
