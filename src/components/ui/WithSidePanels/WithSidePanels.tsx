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
  scrollableContent?: TSidePanelProps['scrollableContent'];
  withHeader?: TSidePanelProps['withHeader'];
  // usePanel?: boolean;
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
}

const ToggleButton: React.FC<TToggleButtonProps> = ({
  iconClassName,
  handleToggle,
  panelHidden,
  showButton,
}) => {
  if (!showButton) {
    return null;
  }
  return (
    <Button
      // prettier-ignore
      className={classNames(styles.panelIcon, iconClassName, panelHidden && styles.activated)}
      variant="contained"
      title="Toggle side panel"
      size="small"
      onClick={handleToggle}
    >
      <ChevronLeft fontSize="small" />
    </Button>
  );
};

interface TShowPanelProps {
  // children?: React.ReactNode;
  hidden?: boolean;
  panelClassName?: string;
  params?: TPanelParams;
  // usePanel?: boolean;
}

const ShowPanel: React.FC<TShowPanelProps> = ({
  // prettier-ignore
  // children,
  panelClassName,
  hidden,
  params,
  // withHeader,
  // headerTitle,
  // usePanel,
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
  const [showLeftPanel, setShowLeftPanel] = React.useState(!!leftPanel?.defaultShow);
  const [showRightPanel, setShowRightPanel] = React.useState(!!rightPanel?.defaultShow);
  const toggleLeftPanel = () => {
    setShowLeftPanel((show) => !show);
  };
  const toggleRightPanel = () => {
    setShowRightPanel((show) => !show);
  };
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
        />
        <ToggleButton
          iconClassName={styles.panelIconRight}
          handleToggle={toggleRightPanel}
          panelHidden={!showRightPanel}
          showButton={useRightPanel}
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