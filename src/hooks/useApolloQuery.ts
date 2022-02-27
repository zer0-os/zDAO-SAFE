import cloneDeep from 'lodash/cloneDeep';
import { apolloClient } from '@/helpers/apollo';
import { useMemo, useRef } from 'react';

const useApolloQuery = () => {
  const loading = useRef(false);

  const apolloQuery = async (options, path = '') => {
    try {
      loading.current = true;
      const response = await apolloClient.query(options);
      loading.current = false;

      return cloneDeep(!path ? response.data : response.data[path]);
    } catch (error) {
      loading.current = false;
      console.log(error);
    }
  };

  return useMemo(
    () => ({
      apolloQuery,
      queryLoading: loading.current,
    }),
    [apolloQuery, loading.current]
  );
};

export default useApolloQuery;
