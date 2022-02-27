import { getProposal } from '@/helpers/snapshot';
import { useCallback, useState } from 'react';

const useExtendedProposal = () => {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<any>(undefined);

  const loadProposal = useCallback(async (id_in = []) => {
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
  }, []);

  return {
    loadProposal,
    proposalLoading: loading,
    proposal,
  };
};

export default useExtendedProposal;
