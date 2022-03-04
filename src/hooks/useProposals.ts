import { getProposals } from '@/helpers/snapshot';
import { useEffect, useState } from 'react';

export default function useProposals() {
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<any>([]);

  useEffect(() => {
    const loadProposals = async () => {
      setLoading(true);
      try {
        const response = await getProposals();
        setProposals(response);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, []);

  return {
    loading,
    proposals,
  };
}
