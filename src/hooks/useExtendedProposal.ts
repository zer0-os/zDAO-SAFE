import { getProposal } from '@/helpers/snapshot';
import { useRefresh } from '@/hooks/useRefresh';
import { useEffect, useState } from 'react';

const useExtendedProposal = (proposalId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<any>(undefined);
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const loadProposal = async (id_in: string) => {
      setLoading(true);
      try {
        const response = await getProposal(id_in);
        setProposal(response);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setLoading(false);
      }
    };

    if (proposalId) {
      loadProposal(proposalId);
    }
  }, [proposalId, slowRefresh]);

  return {
    proposalLoading: loading,
    proposal,
  };
};

export default useExtendedProposal;
