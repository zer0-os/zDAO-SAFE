import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Stack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import {
  getExternalLink,
  shortenAddress,
  shortenProposal,
  shortenTx,
} from '@/utils/address';

export enum ExternalLinkType {
  address = 'address',
  tx = 'tx',
  block = 'block',
  proposal = 'proposal',
}

const LinkExternal = ({
  chainId,
  type,
  value,
  shortenize = true,
}: {
  chainId: number;
  type: ExternalLinkType;
  value: string | number;
  shortenize?: boolean;
}) => {
  const link = useMemo(() => {
    if (
      type === ExternalLinkType.address ||
      type === ExternalLinkType.tx ||
      type === ExternalLinkType.block
    ) {
      return getExternalLink(chainId, type, value);
    }
    return '';
  }, [chainId, type, value]);

  const display = useMemo(() => {
    if (type === ExternalLinkType.address) {
      return shortenize ? shortenAddress(value as string) : (value as string);
    }
    if (type === ExternalLinkType.tx) {
      return shortenize ? shortenTx(value as string) : (value as string);
    }
    if (type === ExternalLinkType.proposal) {
      return shortenize ? shortenProposal(value as string) : (value as string);
    }
    return value;
  }, [type, shortenize, value]);

  return (
    <a href={link} target={'_blank'} rel="noreferrer">
      <Stack direction="row" spacing={2} alignItems="center">
        <Text>{display}</Text>
        <ExternalLinkIcon mx="2px" />
      </Stack>
    </a>
  );
};

export default LinkExternal;
