import BigNumber from 'bignumber.js';
import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from '@/components/Loader';
import SuspenseWithChunkError from '@/components/SuspenseWithChunkError';

const Landing = lazy(() => import('@/views/Landing'));
const Voting = lazy(() => import('@/views/Voting'));
const CreateProposal = lazy(() => import('@/views/CreateProposal'));

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

function App() {
  return (
    <BrowserRouter>
      <SuspenseWithChunkError fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/create" element={<CreateProposal />}></Route>
          <Route path="/voting" element={<Voting />}></Route>
        </Routes>
      </SuspenseWithChunkError>
    </BrowserRouter>
  );
}

export default App;
