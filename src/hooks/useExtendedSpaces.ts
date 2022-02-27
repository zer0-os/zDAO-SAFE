import { SPACES_QUERY } from '@/config/constants/queries';
import useApolloQuery from '@/hooks/useApolloQuery';
import { useCallback, useState } from 'react';

const useExtendedSpaces = () => {
  const { apolloQuery } = useApolloQuery();
  const [loading, setLoading] = useState(false);
  const [extentedSpaces, setExtentedSpaces] = useState<any>(undefined);

  const loadExtentedSpaces = useCallback(async (id_in = []) => {
    setLoading(true);
    try {
      const response = await apolloQuery(
        {
          query: SPACES_QUERY,
          variables: {
            id_in,
          },
        },
        'spaces'
      );
      setExtentedSpaces(response);
    } catch (e) {
      console.error(e);
      return e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loadExtentedSpaces,
    spaceLoading: loading,
    extentedSpaces,
  };
};

export default useExtendedSpaces;
