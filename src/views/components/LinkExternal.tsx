import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Stack, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import LinkButton from '../../components/Button/LinkButton';
import { getExternalLink, shortenAddress } from '../../utils/address';

export enum ExternalLinkType {
  address = 'address',
  block = 'block',
  proposal = 'proposal',
}

const LinkExternal = ({
  chainId,
  type,
  value,
}: {
  chainId: number;
  type: ExternalLinkType;
  value: string | number;
}) => {
  const link = useMemo(() => {
    if (type === ExternalLinkType.address || type === ExternalLinkType.block) {
      return getExternalLink(chainId, type, value);
    }
    return '';
  }, [chainId, type, value]);

  const display = useMemo(() => {
    if (type === ExternalLinkType.address) {
      return shortenAddress(value as string);
    }
    if (type === ExternalLinkType.proposal) {
      return value as string;
    }
    return value;
  }, [type, value]);

  return (
    <LinkButton href={link} isExternal>
      <Stack direction="row" spacing={2} alignItems="center">
        <Text>{display}</Text>
        <ExternalLinkIcon mx="2px" />
      </Stack>
    </LinkButton>
  );
};

export default LinkExternal;
