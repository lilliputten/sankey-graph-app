import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from 'src/reportWebVitals';
import { App } from 'src/app/App';

import 'src/core/global/global-includes';
import 'src/core/global/global-styles.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
