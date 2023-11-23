import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { TPanelParams, WithSidePanels } from 'src/components/ui/WithSidePanels';
import { SankeySettingsPanel } from 'src/components/SankeyMisc/SankeySettingsPanel';
import { useChartComponent } from 'src/components/SankeyHooks';

import styles from './SankeyViewer.module.scss';

interface TSankeyViewerProps extends TPropsWithClassName {
  useLeftPanel?: boolean;
  defaultShowLeftPanel?: boolean;
}

export const SankeyViewer: React.FC<TSankeyViewerProps> = observer((props) => {
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
  const ChartComponent = useChartComponent();
  return (
    <WithSidePanels
      className={classNames(className, styles.root)}
      mainPanelClassName={styles.chartArea}
      leftPanel={leftPanelParams}
      // rightPanel={rightPanelParams} // TODO?
    >
      <ChartComponent className={styles.chartArea} />
    </WithSidePanels>
  );
});
