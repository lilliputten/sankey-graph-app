import React from 'react';
import { Box, Button } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import classNames from 'classnames';

import { SidePanel, TSidePanelProps } from 'src/components/ui/SidePanel';
import { TPropsWithChildrenAndClassName } from 'src/core/types';

import styles from './WithSidePanels.module.scss';

export interface TPanelParams {
  // extends Pick<TShowPanelProps, 'headerTitle' | 'scrollableContent' | 'withHeader' | 'className'>
  defaultShow?: boolean;
  content?: React.ReactNode;
  headerTitle?: TSidePanelProps['headerTitle'];
  /** Toggle button text hint */
  toggleTitle?: string;
  scrollableContent?: TSidePanelProps['scrollableContent'];
  withHeader?: TSidePanelProps['withHeader'];
  /** Controlled panel: visible state */
  show?: boolean;
  /** Controlled panel: set visible state */
  setShow?: (show: boolean) => void;
}

export interface TWithSidePanelsProps extends TPropsWithChildrenAndClassName {
  mainPanelClassName?: string;
  leftPanel?: TPanelParams;
  rightPanel?: TPanelParams;
}

interface TToggleButtonProps {
  iconClassName?: string;
  handleToggle: () => void;
  panelHidden?: boolean;
  showButton?: boolean;
  title?: string;
}

const ToggleButton: React.FC<TToggleButtonProps> = ({
  iconClassName,
  handleToggle,
  panelHidden,
  showButton,
  title = 'Toggle side panel',
}) => {
  if (!showButton) {
    return null;
  }
  return (
    <Button
      // prettier-ignore
      className={classNames(styles.panelIcon, iconClassName, panelHidden && styles.activated)}
      variant="contained"
      title={title}
      size="small"
      onClick={handleToggle}
    >
      <ChevronLeft fontSize="small" />
    </Button>
  );
};

interface TShowPanelProps {
  hidden?: boolean;
  panelClassName?: string;
  params?: TPanelParams;
}

const ShowPanel: React.FC<TShowPanelProps> = ({
  // prettier-ignore
  panelClassName,
  hidden,
  params,
}) => {
  if (!params) {
    return null;
  }
  const {
    // prettier-ignore
    content,
    headerTitle,
    scrollableContent,
    withHeader,
    // open,
    // setOpen,
  } = params;
  return (
    <SidePanel
      className={classNames(styles.sidePanel, panelClassName)}
      // prettier-ignore
      withHeader={withHeader}
      headerTitle={headerTitle || 'Side panel'}
      scrollableContent={scrollableContent}
      hidden={hidden}
    >
      {!hidden && content}
    </SidePanel>
  );
};

export const WithSidePanels: React.FC<TWithSidePanelsProps> = (props) => {
  const {
    // prettier-ignore
    className,
    children,
    mainPanelClassName,
    leftPanel,
    rightPanel,
  } = props;
  const useLeftPanel = !!leftPanel;
  const useRightPanel = !!rightPanel;
  const [showLeftPanel, setShowLeftPanel] = React.useState(
    !!(leftPanel?.show != null ? leftPanel.show : leftPanel?.defaultShow),
  );
  const [showRightPanel, setShowRightPanel] = React.useState(
    !!(rightPanel?.show != null ? rightPanel.show : rightPanel?.defaultShow),
  );
  const toggleLeftPanel = () => {
    const show = !showLeftPanel;
    if (leftPanel?.setShow) {
      // Controlled?
      leftPanel.setShow(show);
    } else {
      // Use internal state
      setShowLeftPanel((show) => !show);
    }
  };
  React.useEffect(() => {
    if (leftPanel?.show != null) {
      setShowLeftPanel(leftPanel.show);
    }
  }, [leftPanel?.show]);
  const toggleRightPanel = () => {
    const show = !showRightPanel;
    if (rightPanel?.setShow) {
      // Controlled?
      rightPanel.setShow(show);
    } else {
      // Use internal state
      setShowRightPanel((show) => !show);
    }
  };
  React.useEffect(() => {
    if (rightPanel?.show != null) {
      setShowRightPanel(rightPanel.show);
    }
  }, [rightPanel?.show]);
  return (
    <Box className={classNames(className, styles.root)}>
      <ShowPanel
        // prettier-ignore
        panelClassName={styles.sidePanelLeft}
        hidden={!showLeftPanel}
        params={leftPanel}
      />
      <Box className={classNames(mainPanelClassName, styles.mainPanel)}>
        {children}
        <ToggleButton
          iconClassName={styles.panelIconLeft}
          handleToggle={toggleLeftPanel}
          panelHidden={!showLeftPanel}
          showButton={useLeftPanel}
          title={leftPanel?.toggleTitle}
        />
        <ToggleButton
          iconClassName={styles.panelIconRight}
          handleToggle={toggleRightPanel}
          panelHidden={!showRightPanel}
          showButton={useRightPanel}
          title={rightPanel?.toggleTitle}
        />
      </Box>
      <ShowPanel
        // prettier-ignore
        panelClassName={styles.sidePanelRight}
        hidden={!showRightPanel}
        params={rightPanel}
      />
    </Box>
  );
};
