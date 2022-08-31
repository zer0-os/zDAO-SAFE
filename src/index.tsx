import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import ApplicationUpdater from '@/states/application/updater';

import App from './App';
import Providers from './Providers';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <ApplicationUpdater />
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
