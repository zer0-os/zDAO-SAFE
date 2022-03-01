import { getSpaces } from '@/helpers/snapshot';
import { useEffect, useState } from 'react';

const useExtendedSpace = (spaceId: string) => {
  const [loading, setLoading] = useState(false);
  const [space, setSpace] = useState<any>(undefined);

  useEffect(() => {
    const loadSpaces = async (id_in: string[] = []) => {
      setLoading(true);
      try {
        const response = await getSpaces(id_in);
        if (response) {
          const found = response.find((space) => space.id === spaceId);
          setSpace(found);
        } else {
          setSpace(undefined);
        }
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      loadSpaces([spaceId]);
    }
  }, [spaceId]);

  return {
    spaceLoading: loading,
    space,
  };
};

export default useExtendedSpace;
