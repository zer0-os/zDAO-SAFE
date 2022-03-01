import { getProposalVotes } from '@/helpers/snapshot';
import { useEffect, useState } from 'react';

const useExtendedVotes = (proposalId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState<any>(undefined);

  useEffect(() => {
    const loadVotes = async (proposalId: string) => {
      setLoading(true);
      try {
        const response = await getProposalVotes(proposalId);
        setVotes(response);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setLoading(false);
      }
    };

    if (proposalId) {
      loadVotes(proposalId);
    }
  }, [proposalId]);

  return {
    votesLoading: loading,
    votes,
  };
};

export default useExtendedVotes;
