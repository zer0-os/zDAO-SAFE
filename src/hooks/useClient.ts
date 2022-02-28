import client from '@/helpers/client';
import clientEIP712 from '@/helpers/clientEIP712';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { useState } from 'react';

const useClient = () => {
  const { account, library } = useActiveWeb3React();
  const [loading, setLoading] = useState(false);

  const send = async (space, type, payload) => {
    setLoading(true);

    try {
      if (!library || !account) return null;

      return client.broadcast(library, account, space.id, type, payload);
    } finally {
      setLoading(false);
    }
  };

  const sendEIP712 = async (space, type, payload): Promise<any | null> => {
    setLoading(true);

    try {
      if (!library || !account) {
        return null;
      }

      if (type === 'proposal') {
        console.log('proposal', {
          from: payload.from,
          space: space.id,
          timestamp: payload.timestamp,
          type: payload.type,
          name: payload.title,
          body: payload.body,
          choices: payload.choices,
          start: payload.start,
          end: payload.end,
          snapshot: payload.snapshot,
          network: space.network,
          strategies: JSON.stringify(space.strategies),
          plugins: JSON.stringify(payload.plugins),
          metadata: JSON.stringify({}),
        });
        console.log('library', library, account, clientEIP712);
        return await clientEIP712.proposal(library, account, {
          from: payload.from,
          space: space.id,
          timestamp: payload.timestamp,
          type: payload.type,
          title: payload.title,
          body: payload.body,
          choices: payload.choices,
          start: payload.start,
          end: payload.end,
          snapshot: payload.snapshot,
          network: space.network,
          strategies: JSON.stringify(space.strategies),
          plugins: JSON.stringify(payload.plugins),
          metadata: JSON.stringify({}),
        });
      } else if (type === 'vote') {
        console.log('vote', {
          space: space.id,
          proposal: payload.proposal.id,
          type: payload.proposal.type,
          choice: payload.choice,
          metadata: JSON.stringify({}),
        });
        return await clientEIP712.vote(library, account, {
          space: space.id,
          proposal: payload.proposal.id,
          type: payload.proposal.type,
          choice: payload.choice,
          metadata: JSON.stringify({}),
        });
      }
      return null;
    } catch (error) {
      console.error('error', error);
    } finally {
      setLoading(false);
    }
  };

  return { send, sendEIP712, clientLoading: loading };
};

export default useClient;
