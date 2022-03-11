import { IPFS_GATEWAY, SNAPSHOT_HUB } from '@/config/constants/snapshot';
import verified from '@/config/verified.json';
import { useChainId } from '@/states/application/hooks';
import Client from '@snapshot-labs/snapshot.js';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';

const useExtendedExplore = () => {
  const [loading, setLoading] = useState(false);
  const [spaces, setSpaces] = useState<any>(undefined);
  const chainId = useChainId();

  useEffect(() => {
    const loadSpaces = async (chainId: string) => {
      setLoading(true);
      try {
        const exploreObj: any = await fetch(`${SNAPSHOT_HUB}/api/explore`).then(
          (res) => res.json()
        );

        const spaces2 = Object.entries(exploreObj.spaces).map(
          ([id, space]: any) => {
            // map manually selected categories for verified spaces that don't have set their categories yet
            // set to empty array if space.categories is missing
            space.categories = space.categories?.length ? space.categories : [];
            space.avatarUri = Client.utils.getUrl(space.avatar, IPFS_GATEWAY);

            return [id, { id, ...space }];
          }
        );

        console.log('total length', spaces2.length);

        const filters = spaces2
          .map(([id, space]) => {
            const followers = space.followers ?? 0;
            const followers1d = space.followers_1d ?? 0;
            const isVerified = verified[id] || 0;
            let score = followers1d + followers / 4;
            if (isVerified === 1) score = score * 2;
            return {
              ...space,
              followers,
              score,
            };
          })
          .filter((space) => !space.private && verified[space.id] !== -1)
          .filter((space) => space.network === chainId);

        const list = orderBy(filters, ['followers', 'score'], ['desc', 'desc']);

        console.log('filtered length', filters.length);

        setSpaces(list);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setLoading(false);
      }
    };

    loadSpaces(chainId.toString());
  }, [chainId]);

  return {
    exploreLoading: loading,
    spaces,
  };
};

export default useExtendedExplore;
