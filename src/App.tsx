import { useColorModeValue } from '@chakra-ui/color-mode';
import Loader from '@/components/Loader';
import SuspenseWithChunkError from '@/components/SuspenseWithChunkError';
import { Header } from '@/components/Header';
import BigNumber from 'bignumber.js';
import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import useEagerConnect from './hooks/useEagerConnect';

const GnosisSafe = lazy(() => import('@/views/GnosisSafe'));
const Landing = lazy(() => import('@/views/Landing'));
const Voting = lazy(() => import('@/views/Voting'));
const CreateProposal = lazy(() => import('@/views/CreateProposal'));

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
  const color = useColorModeValue('#F7FAFC', '#060514');
  useEagerConnect();

  return (
    <AppWrapper>
      <Header />
      <BodyWrapper background={color}>
        <BrowserRouter>
          <SuspenseWithChunkError fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Landing />}></Route>
              <Route path="/gnosis-safe" element={<GnosisSafe />}></Route>
              <Route path="/create" element={<CreateProposal />}></Route>
              <Route path="/voting/:id" element={<Voting />}></Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </SuspenseWithChunkError>
        </BrowserRouter>
      </BodyWrapper>
    </AppWrapper>
  );
}

export default App;
