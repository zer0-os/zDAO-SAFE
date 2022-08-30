import { Box } from '@chakra-ui/react';
import React from 'react';

import Loader from './Loader';

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function FullScreenLoader({
  size = '32px',
  stroke = 'var(--chakra-colors-whiteAlpha-700)',
  ...rest
}: {
  size?: string;
  stroke?: string;
}) {
  return (
    <Box position="relative" width="full" height="100vh">
      <Box position="absolute" top="50%" left="50%" translateX="50%">
        <Loader size={size} stroke={stroke} {...rest} />
      </Box>
    </Box>
  );
}
