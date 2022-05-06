import React from 'react';
import { ThemeProvider } from 'styled-components';

import Home from './pages/Home';
import GlobalStyles from './styles/GlobalStyles';
import defaultTheme from './styles/theme/defaultTheme';

const App = () => {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Home />
        <GlobalStyles />
      </ThemeProvider>
    </>
  );
};

export default App;
