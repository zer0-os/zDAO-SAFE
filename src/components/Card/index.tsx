import { Box, BoxProps, Heading, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface CardProps extends BoxProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children, ...props }: CardProps) => {
  return (
    <Box
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      borderWidth={'1px'}
      rounded={'md'}
      px={4}
      py={6}
      width={'full'}
      {...props}
    >
      <Heading
        as={'h2'}
        fontSize={{ base: '2xl' }}
        fontFamily={'body'}
        color={useColorModeValue('gray.700', 'white')}
        paddingBottom={6}
      >
        {title}
      </Heading>
      {children}
    </Box>
  );
};

export default Card;
