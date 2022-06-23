import React, { useEffect, useState } from 'react';

import useIsWindowVisible from '../hooks/useIsWindowVisible';

const FAST_INTERVAL = 10000;
const SLOW_INTERVAL = 60000;

const RefreshContext = React.createContext({ slow: 0, fast: 0 });

interface RefreshContextProviderProps {
  children?: React.ReactNode;
}

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider = ({ children }: RefreshContextProviderProps) => {
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);

  // Check if the tab is active in the user browser
  const isBrowserTabActiveRef = useIsWindowVisible();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef) {
        setFast((prev) => prev + 1);
      }
    }, FAST_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef) {
        setSlow((prev) => prev + 1);
      }
    }, SLOW_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  return (
    <RefreshContext.Provider value={{ slow, fast }}>
      {children}
    </RefreshContext.Provider>
  );
};

export { RefreshContext, RefreshContextProvider };
