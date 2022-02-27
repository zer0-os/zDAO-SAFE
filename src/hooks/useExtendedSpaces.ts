import { getSpaces } from '@/helpers/snapshot';
import { useCallback, useState } from 'react';

const useExtendedSpaces = () => {
  const [loading, setLoading] = useState(false);
  const [extentedSpaces, setExtentedSpaces] = useState<any>(undefined);

  const loadExtentedSpaces = useCallback(async (id_in = []) => {
    setLoading(true);
    try {
      const response = await getSpaces(id_in);
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
