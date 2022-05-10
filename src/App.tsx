import BigNumber from 'bignumber.js';
import React, { lazy } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Header } from './components/Header';
import { FullScreenLoader } from './components/Loader';
import SuspenseWithChunkError from './components/SuspenseWithChunkError';
import useEagerConnect from './hooks/useEagerConnect';
import { ApplicationStatus } from './states/application';
import { useApplicationStatus } from './states/application/hooks';
import ListProposal from './views/ListProposal';

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const Home = lazy(() => import('./views/Home'));
const GnosisSafe = lazy(() => import('./views/GnosisSafe'));

function App() {
  useEagerConnect();

  const applicationStatus = useApplicationStatus();
  console.log('applicationStatus', applicationStatus);

  if (applicationStatus === ApplicationStatus.INITIAL) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Header />
      <Container className="p-3">
        <BrowserRouter>
          <SuspenseWithChunkError fallback={<FullScreenLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:zNA/gnosis-safe" element={<GnosisSafe />} />
              <Route path="/:zNA" element={<ListProposal />} />
              {/* <Route path="/create" element={<CreateProposal />} />
              <Route path="/voting/:id" element={<Voting />} />
              <Route path="*" element={<Navigate to="/" />} /> */}
            </Routes>
          </SuspenseWithChunkError>
        </BrowserRouter>
      </Container>
    </>
  );
}

export default App;
