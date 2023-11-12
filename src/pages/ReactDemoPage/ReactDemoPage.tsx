import React from 'react';
import classNames from 'classnames';

import Button from '@mui/material/Button';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import logo from './logo.svg';

import scssVariables from 'src/core/assets/scss/variables.module.scss';

import './ReactDemoPage.css';

import styles from './ReactDemoPage.module.scss';

// DEBUG
console.log('[ReactDemoPage]', {
  styles,
  // REACT_APP_DEV: process.env.REACT_APP_DEV,
  NODE_ENV: process.env.NODE_ENV,
  scssVariables,
});

export function ReactDemoPage() {
  return (
    <div className={classNames('ReactDemoPage', styles.root)}>
      <header className="ReactDemoPage-header">
        <img src={logo} className="ReactDemoPage-logo" alt="logo" />
        <p>
          Edit <code>src/ReactDemoPage.tsx</code> and save to reload.
        </p>
        <a
          className="ReactDemoPage-link"
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
