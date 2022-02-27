import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children, ...props }: CardProps) => {
  return (
    <Box
      borderColor={'gray.300'}
      borderWidth={'1px'}
      rounded={'md'}
      p={6}
      width={'full'}
      {...props}
    >
      <Heading
        as={'h2'}
        fontSize={{ base: '3xl' }}
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
