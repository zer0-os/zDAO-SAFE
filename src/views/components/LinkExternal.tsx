import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Link, Stack, Text } from '@chakra-ui/react';

const LinkExternal = ({
  type,
  value,
}: {
  type: string;
  value: string | number;
}) => {
  return (
    <Link href={'#'} isExternal>
      <Stack direction={'row'} spacing={2} alignItems={'center'}>
        <Text>{value}</Text>
        <ExternalLinkIcon mx={'2px'} />
      </Stack>
    </Link>
  );
};

export default LinkExternal;
