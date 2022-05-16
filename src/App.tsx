import { useColorModeValue } from '@chakra-ui/color-mode';
import BigNumber from 'bignumber.js';
import React, { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import { Header } from './components/Header';
import { FullScreenLoader } from './components/Loader';
import SuspenseWithChunkError from './components/SuspenseWithChunkError';
import useEagerConnect from './hooks/useEagerConnect';
import { ApplicationStatus } from './states/application';
import { useApplicationStatus } from './states/application/hooks';

const Home = lazy(() => import('./views/Home'));
const GnosisSafe = lazy(() => import('./views/GnosisSafe'));
const ListProposal = lazy(() => import('./views/ListProposal'));
const Voting = lazy(() => import('./views/Voting'));
const CreateProposal = lazy(() => import('./views/CreateProposal'));
const CreateZDAO = lazy(() => import('./views/CreateZDAO'));

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;

const BodyWrapper = styled.div<{ background: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 120px 16px 60px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;
  background: ${({ background }) => background};
`;

function App() {
  useEagerConnect();

  const color = useColorModeValue('#F7FAFC', '#060514');

  const applicationStatus = useApplicationStatus();
  console.log('applicationStatus', applicationStatus);

  if (applicationStatus === ApplicationStatus.INITIAL) {
    return <FullScreenLoader />;
  }

  return (
    <AppWrapper>
      <BrowserRouter>
        <SuspenseWithChunkError fallback={<FullScreenLoader />}>
          <BodyWrapper background={color}>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-zdao" element={<CreateZDAO />} />
              <Route path="/:zNA" element={<ListProposal />} />
              <Route path="/:zNA/:proposalId" element={<Voting />} />
              <Route path="/:zNA/gnosis-safe" element={<GnosisSafe />} />
              <Route
                path="/:zNA/create-proposal"
                element={<CreateProposal />}
              />
            </Routes>
          </BodyWrapper>
        </SuspenseWithChunkError>
      </BrowserRouter>
    </AppWrapper>
  );
}

export default App;
