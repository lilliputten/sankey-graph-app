import React from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames';

// import { isDevBrowser } from 'src/config/build';
import { SankeyAnychartDemo } from 'src/components/SankeyViewer/SankeyAnychartDemo';
import { SankeyGoJSDemo } from 'src/components/SankeyViewer/SankeyGoJSDemo';

import styles from './SankeyViewer.module.scss';

/* [>* DEBUG: Don't wait for user action <]
 * const __debugEmulateData = false && isDevBrowser;
 */

interface TSankeyViewerProps {
  className?: string;
}

export const SankeyViewer: React.FC<TSankeyViewerProps> = (props) => {
  const { className } = props;
  return (
    <Box className={classNames(className, styles.root)}>
      <SankeyGoJSDemo />
    </Box>
  );
};
