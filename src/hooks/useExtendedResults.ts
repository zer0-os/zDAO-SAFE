import { getResults } from '@/helpers/snapshot';
import { useEffect, useState } from 'react';

const useExtendedResults = (space, proposal, votes) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(undefined);
  const [votesEx, setVotesEx] = useState<any>(undefined);

  useEffect(() => {
    if (!space || !proposal || !votes) return;

    const loadResults = async (space, proposal, votes) => {
      setLoading(true);
      try {
        const response = await getResults(space, proposal, votes);
        setResults(response.results);
        setVotesEx(response.votes);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setLoading(false);
      }
    };

    loadResults(space, proposal, votes);
  }, [space, proposal, votes]);

  return {
    resultsLoading: loading,
    results,
    votes: votesEx,
  };
};

export default useExtendedResults;
