import { extendTheme } from '@chakra-ui/react';
import foundations from './foundations';
import styles from './styles';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

export const theme = extendTheme({
  config,
  ...foundations,
  styles,
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
  },
});
