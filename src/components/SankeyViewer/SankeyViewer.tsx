import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from '../SankeyApp/SankeyAppSessionStore';
import { TPanelParams, WithSidePanels } from 'src/components/ui/WithSidePanels';
import { SankeySettingsPanel } from 'src/components/SankeyMisc/SankeySettingsPanel';
import { SankeyPropertiesPanel } from 'src/components/SankeyMisc/SankeyPropertiesPanel';
import { useChartComponent } from 'src/components/SankeyHooks';

import styles from './SankeyViewer.module.scss';

interface TSankeyViewerProps extends TPropsWithClassName {
  /** Use left panel in layout */
  useLeftPanel?: boolean;
  /** Show left panel by default */
  defaultShowLeftPanel?: boolean;
  /** Show right panel by default */
  defaultShowRightPanel?: boolean;
}

const autoOpenPropertiesPanel = true;

export const SankeyViewer: React.FC<TSankeyViewerProps> = observer((props) => {
  const {
    // prettier-ignore
    className,
    useLeftPanel = true,
    defaultShowLeftPanel = false,
    defaultShowRightPanel = false,
  } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { selectedGraphId } = sankeyAppSessionStore;
  const [useRightPanel, setUseRightPanel] = React.useState(false);
  const leftPanelContent = React.useMemo(
    () => useLeftPanel && <SankeySettingsPanel />,
    [useLeftPanel],
  );
  const rightPanelContent = React.useMemo(
    () => useRightPanel && <SankeyPropertiesPanel />,
    [useRightPanel],
  );
  // const [showLeftPanel, setShowLeftPanel] = React.useState(defaultShowLeftPanel); // TDO: If we nned controlled left panel
  const [showRightPanel, setShowRightPanel] = React.useState(defaultShowRightPanel);
  React.useEffect(() => {
    const showRightPanel = selectedGraphId !== undefined;
    setUseRightPanel(showRightPanel);
    if (autoOpenPropertiesPanel) {
      setShowRightPanel(showRightPanel);
    }
  }, [selectedGraphId]);
  const leftPanelParams = React.useMemo<TPanelParams | undefined>(() => {
    if (useLeftPanel) {
      return {
        content: leftPanelContent,
        defaultShow: defaultShowLeftPanel,
        withHeader: true,
        headerTitle: 'Settings',
        toggleTitle: 'Toggle settings panel',
        scrollableContent: true,
        // show: showLeftPanel,
        // setShow: setShowLeftPanel,
      };
    }
  }, [
    useLeftPanel,
    leftPanelContent,
    defaultShowLeftPanel,
    // showLeftPanel,
  ]);
  const rightPanelParams = React.useMemo<TPanelParams | undefined>(() => {
    if (useRightPanel) {
      return {
        content: rightPanelContent,
        defaultShow: defaultShowRightPanel,
        withHeader: true,
        headerTitle: 'Properties',
        toggleTitle: 'Toggle properties panel',
        scrollableContent: true,
        show: showRightPanel,
        setShow: setShowRightPanel,
      };
    }
  }, [useRightPanel, rightPanelContent, defaultShowRightPanel, showRightPanel]);
  const ChartComponent = useChartComponent();
  return (
    <WithSidePanels
      className={classNames(className, styles.root)}
      mainPanelClassName={styles.chartArea}
      leftPanel={leftPanelParams}
      rightPanel={rightPanelParams}
    >
      <ChartComponent className={styles.chartArea} />
    </WithSidePanels>
  );
});
