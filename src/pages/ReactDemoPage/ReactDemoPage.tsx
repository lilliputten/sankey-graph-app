import React from 'react';
import classNames from 'classnames';

import Button from '@mui/material/Button';

import logo from './logo.svg';

import './ReactDemoPage.css';

import styles from './ReactDemoPage.module.scss';

/* // DEBUG
 * console.log('[ReactDemoPage]', {
 *   styles,
 *   // REACT_APP_DEV: process.env.REACT_APP_DEV,
 *   NODE_ENV: process.env.NODE_ENV,
 * });
 */

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
