import React from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames';

// import { isDevBrowser } from 'src/config/build';
import { SankeyAnychartDemo } from 'src/components/SankeyViewer/SankeyAnychartDemo';
import { SankeyGoJSDemo } from 'src/components/SankeyViewer/SankeyGoJSDemo';
import { TPropsWithClassName } from 'src/core/types';

import styles from './SankeyViewer.module.scss';
import { TPanelParams, WithSidePanels } from 'src/components/ui/WithSidePanels';

/* [>* DEBUG: Don't wait for user action <]
 * const __debugEmulateData = false && isDevBrowser;
 */

interface TSankeyViewerProps extends TPropsWithClassName {
  useLeftPanel?: boolean;
  useRightPanel?: boolean;
  defaultShowLeftPanel?: boolean;
  defaultShowRightPanel?: boolean;
}

export const SankeyViewer: React.FC<TSankeyViewerProps> = (props) => {
  const {
    // prettier-ignore
    className,
    useLeftPanel = true,
    useRightPanel = false,
  } = props;
  const leftPanelContent = React.useMemo(
    () => useLeftPanel && <Box>Left Panel</Box>,
    [useLeftPanel],
  );
  const rightPanelContent = React.useMemo(
    () => useRightPanel && <Box>Right Panel</Box>,
    [useRightPanel],
  );
  const leftPanelParams = React.useMemo<TPanelParams | undefined>(() => {
    if (useLeftPanel) {
      return {
        content: leftPanelContent,
        defaultShow: false,
        withHeader: true,
        headerTitle: 'Settings',
        scrollableContent: true,
      };
    }
  }, [useLeftPanel, leftPanelContent]);
  const rightPanelParams = React.useMemo<TPanelParams | undefined>(() => {
    if (useRightPanel) {
      return {
        content: rightPanelContent,
        defaultShow: false,
      };
    }
  }, [useRightPanel, rightPanelContent]);
  return (
    <WithSidePanels
      className={classNames(className, styles.root)}
      mainPanelClassName={styles.chartArea}
      leftPanel={leftPanelParams}
      rightPanel={rightPanelParams}
    >
      <SankeyGoJSDemo />
    </WithSidePanels>
  );
};
