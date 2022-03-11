import { getProposals } from '@/helpers/snapshot';
import { useEffect, useState } from 'react';

export default function useProposals(spaceId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [proposals, setProposals] = useState<any>([]);

  useEffect(() => {
    const loadProposals = async (spaceId: string) => {
      setLoading(true);
      try {
        const response = await getProposals(spaceId);
        setProposals(response);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      loadProposals(spaceId);
    }
  }, [spaceId]);

  const loadMoreProposals = async () => {
    if (fullyLoaded) {
      return;
    }

    setLoadingMore(true);
    try {
      const response = await getProposals(proposals.length || 0);
      if (response.length === 0) {
        setFullyLoaded(true);
      }
      setProposals([...proposals, ...response]);
    } catch (e) {
      console.error(e);
      return e;
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    loading,
    loadingMore,
    loadMoreProposals,
    proposals,
    fullyLoaded,
  };
}
