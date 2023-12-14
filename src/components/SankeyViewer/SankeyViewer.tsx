import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
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
const useRightPanel = true;

export const SankeyViewer: React.FC<TSankeyViewerProps> = observer((props) => {
  const {
    // prettier-ignore
    className,
    useLeftPanel = true,
    defaultShowLeftPanel = true,
    defaultShowRightPanel = false,
  } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { showLeftPanel } = sankeyAppSessionStore;
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { selectedGraphId } = sankeyAppDataStore;
  // const [useRightPanel, setUseRightPanel] = React.useState(false);
  // const [showLeftPanel, setShowLeftPanel] = React.useState(defaultShowLeftPanel); // TODO: If we need controlled left panel
  const leftPanelContent = React.useMemo(
    () => useLeftPanel && <SankeySettingsPanel />,
    [useLeftPanel],
  );
  const rightPanelContent = React.useMemo(() => useRightPanel && <SankeyPropertiesPanel />, []);
  const [showRightPanel, setShowRightPanel] = React.useState(defaultShowRightPanel);
  React.useEffect(() => {
    const showRightPanel = selectedGraphId !== undefined;
    // setUseRightPanel(showRightPanel);
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
        show: showLeftPanel,
        setShow: sankeyAppSessionStore.setShowLeftPanel,
      };
    }
  }, [
    // prettier-ignore
    useLeftPanel,
    showLeftPanel,
    leftPanelContent,
    defaultShowLeftPanel,
    sankeyAppSessionStore,
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
  }, [rightPanelContent, defaultShowRightPanel, showRightPanel]);
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
