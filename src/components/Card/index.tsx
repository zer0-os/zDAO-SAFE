import { Box, BoxProps, Heading, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface CardProps extends BoxProps {
  title?: string;
  children: React.ReactNode;
}

const Card = ({ title, children, ...props }: CardProps) => {
  const headingColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      borderColor={borderColor}
      borderWidth="1px"
      rounded="md"
      px={4}
      py={6}
      width="full"
      {...props}
    >
      {title && (
        <Heading
          as="h2"
          fontSize={{ base: '2xl' }}
          fontFamily="body"
          color={headingColor}
          paddingBottom={6}
        >
          {title}
        </Heading>
      )}
      {children}
    </Box>
  );
};

export default Card;
