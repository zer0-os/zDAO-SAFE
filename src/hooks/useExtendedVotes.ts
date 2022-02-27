import { getProposalVotes } from '@/helpers/snapshot';
import { useCallback, useState } from 'react';

const useExtendedVotes = () => {
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState<any>(undefined);

  const loadVotes = useCallback(async (id_in = []) => {
    setLoading(true);
    try {
      const response = await getProposalVotes(id_in);
      setVotes(response);
    } catch (e) {
      console.error(e);
      return e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loadVotes,
    votesLoading: loading,
    votes,
  };
};

export default useExtendedVotes;
