import LinkButton from '@/components/Button/LinkButton';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { getExternalLink, shortenAddress } from '@/utils/address';
import { shortenProposalId } from '@/utils/proposal';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Stack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

export enum ExternalLinkType {
  address = 'address',
  block = 'block',
  proposal = 'proposal',
}

const LinkExternal = ({
  type,
  value,
}: {
  type: ExternalLinkType;
  value: string | number;
}) => {
  const { chainId } = useActiveWeb3React();

  const link = useMemo(() => {
    if (!chainId) return '';

    if (type === ExternalLinkType.address || type === ExternalLinkType.block) {
      return getExternalLink(chainId, type, value);
    }
    return '';
  }, [chainId, type, value]);

  const display = useMemo(() => {
    if (type === ExternalLinkType.address) {
      return shortenAddress(value as string);
    } else if (type === ExternalLinkType.proposal) {
      return shortenProposalId(value as string);
    }
    return value;
  }, [type, value]);

  return (
    <LinkButton href={link} isExternal>
      <Stack direction={'row'} spacing={2} alignItems={'center'}>
        <Text>{display}</Text>
        <ExternalLinkIcon mx={'2px'} />
      </Stack>
    </LinkButton>
  );
};

export default LinkExternal;
