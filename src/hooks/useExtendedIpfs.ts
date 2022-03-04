import { IPFS_GATEWAY } from '@/config/constants/snapshot';
import Client from '@snapshot-labs/snapshot.js';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

export interface MetaDataFormat {
  abi: string;
  sender: string;
  recipient: string;
  token: string;
  amount: BigNumber;
}

const useExtendedIpfs = (ipfs: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState<MetaDataFormat | undefined>(
    undefined
  );

  useEffect(() => {
    const fetch = async (ipfs: string) => {
      setLoading(true);
      try {
        const ipfsData = await Client.utils.ipfsGet(IPFS_GATEWAY, ipfs);
        const metadata = JSON.parse(ipfsData.data.message.metadata);
        const abi = metadata.abi;
        const sender = metadata.sender;
        const recipient = metadata.recipient;
        const token = metadata.token;
        const amount = metadata.amount;

        setMetaData({
          abi,
          sender,
          recipient,
          token,
          amount: new BigNumber(amount),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (ipfs) {
      fetch(ipfs);
    }
  }, [ipfs]);

  return {
    ipfsLoading: loading,
    metaData,
  };
};

export default useExtendedIpfs;
