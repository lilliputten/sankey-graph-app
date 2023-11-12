import React from 'react';
import classNames from 'classnames';

import Button from '@mui/material/Button';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import logo from './logo.svg';

import scssVariables from 'src/assets/scss/variables.module.scss';

import './App.css';

import styles from './App.module.scss';

// DEBUG
console.log('[App]', {
  styles,
  // REACT_APP_DEV: process.env.REACT_APP_DEV,
  NODE_ENV: process.env.NODE_ENV,
  scssVariables,
});

function App() {
  return (
    <div className={classNames('App', styles.root)}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button variant="contained">Hello world</Button>
      </header>
    </div>
  );
}

export default App;
