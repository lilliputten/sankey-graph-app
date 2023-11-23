import React from 'react';
import classNames from 'classnames';

// import { isDevBrowser } from 'src/config/build';
import { SankeyAnychartDemo } from 'src/components/SankeyViewer/SankeyAnychartDemo';
import { SankeyGoJSDemo } from 'src/components/SankeyViewer/SankeyGoJSDemo';
import { TPropsWithClassName } from 'src/core/types';
import { TPanelParams, WithSidePanels } from 'src/components/ui/WithSidePanels';
import { SankeySettingsPanel } from 'src/components/SankeyMisc/SankeySettingsPanel';

import styles from './SankeyViewer.module.scss';

/* [>* DEBUG: Don't wait for user action <]
 * const __debugEmulateData = false && isDevBrowser;
 */

interface TSankeyViewerProps extends TPropsWithClassName {
  useLeftPanel?: boolean;
  defaultShowLeftPanel?: boolean;
}

export const SankeyViewer: React.FC<TSankeyViewerProps> = (props) => {
  const {
    // prettier-ignore
    className,
    useLeftPanel = true,
    defaultShowLeftPanel = true,
  } = props;
  const leftPanelContent = React.useMemo(
    () => useLeftPanel && <SankeySettingsPanel />,
    [useLeftPanel],
  );
  const leftPanelParams = React.useMemo<TPanelParams | undefined>(() => {
    if (useLeftPanel) {
      return {
        content: leftPanelContent,
        defaultShow: defaultShowLeftPanel,
        withHeader: true,
        headerTitle: 'Settings',
        scrollableContent: true,
      };
    }
  }, [useLeftPanel, leftPanelContent, defaultShowLeftPanel]);
  return (
    <WithSidePanels
      className={classNames(className, styles.root)}
      mainPanelClassName={styles.chartArea}
      leftPanel={leftPanelParams}
      // rightPanel={rightPanelParams} // TODO?
    >
      <SankeyGoJSDemo />
    </WithSidePanels>
  );
};
