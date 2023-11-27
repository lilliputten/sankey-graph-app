import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { isDevBrowser } from 'src/config/build';
import { TPropsWithClassName } from 'src/core/types';
import { TNodeId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { useGraphNodeId } from './hooks';
import { EditNodeName } from './EditNodeName';
import { EditNodeColor } from './EditNodeColor';

import styles from './SankeyPropertiesPanel.module.scss';

const __debugUseDemoData = false && isDevBrowser;

const PropertiesContent: React.FC<TPropsWithClassName> = observer(() => {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { selectedGraphId } = sankeyAppDataStore;
  const nodeId: TNodeId | undefined = useGraphNodeId(selectedGraphId);
  if (selectedGraphId === undefined) {
    return <Box className={styles.infoBox}>No node selected</Box>;
  }
  return (
    <>
      {__debugUseDemoData && <Box className={styles.infoBox}>Edit graph id: {selectedGraphId}</Box>}
      <EditNodeName nodeId={nodeId} />
      <EditNodeColor nodeId={nodeId} />
    </>
  );
});

export const SankeyPropertiesPanel: React.FC<TPropsWithClassName> = (props) => {
  const { className } = props;
  return (
    <Box className={classNames(className, styles.root)}>
      <PropertiesContent />
    </Box>
  );
};
