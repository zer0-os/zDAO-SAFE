import { useEffect, useState } from 'react';

const useInfiniteScroll = (loadMore: () => void) => {
  const [isFetching, setIsFectching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    loadMore();
  }, [isFetching]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;
    setIsFectching(true);
  };

  return { isFetching, setIsFectching };
};

export default useInfiniteScroll;
