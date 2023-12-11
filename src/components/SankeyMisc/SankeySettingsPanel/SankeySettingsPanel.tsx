import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';

import { EditThemeMode } from './EditThemeMode';
import { EditVerticalLayout } from './EditVerticalLayout';
import { EditNodesColorMode } from './EditNodesColorMode';
import { EditNodeColors } from './EditNodeColors';
// import { EditGoJsLineWidthFactor } from './EditGoJsLineWidthFactor';
// import { EditChartLibrary } from './EditChartLibrary';

import styles from './SankeySettingsPanel.module.scss';

export const SankeySettingsPanel: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  return (
    <Box className={classNames(className, styles.root)}>
      {/* // UNUSED due to Issue #15: Removed unused libraries
      <EditGoJsLineWidthFactor />
      <EditChartLibrary />
       */}
      <EditThemeMode />
      <EditVerticalLayout />
      <EditNodesColorMode />
      <EditNodeColors />
    </Box>
  );
});
