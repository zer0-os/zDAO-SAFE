import React from 'react';
import { theme } from './theme';
import { ChakraProvider } from '@chakra-ui/react';

const Providers: React.FC = ({ children }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {children}
    </ChakraProvider>
  );
};

export default Providers;
