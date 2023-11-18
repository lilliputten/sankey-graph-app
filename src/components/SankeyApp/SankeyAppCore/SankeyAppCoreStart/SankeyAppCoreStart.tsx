import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import classNames from 'classnames';

import { PropsWithClassName, TEdgesData } from 'src/core/types';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import styles from './SankeyAppCoreStart.module.scss';
import { UploadSankeyDataField } from 'src/components/SankeyMisc/UploadSankeyDataField';

type TSankeyAppCoreStartProps = PropsWithClassName;

export const SankeyAppCoreStart: React.FC<TSankeyAppCoreStartProps> = (props) => {
  const { className } = props;
  const sankeyDataStore = useSankeyAppDataStore();
  /** If data has already loaded then it's possible to go to core visualizer/editor */
  const [isAllDataLoaded, setAllDataLoaded] = React.useState(false);
  const [edgesData, setEdgesData] = React.useState<TEdgesData | undefined>();
  const doStart = React.useCallback(() => {
    console.log('[SankeyAppCoreStart:doStart]', {});
    debugger;
    sankeyDataStore.setReady(true);
  }, [sankeyDataStore]);
  const handleEdgesData = React.useCallback((edgesData: TEdgesData) => {
    const isDataLoaded = !!edgesData;
    console.log('[SankeyAppCoreStart:handleEdgesData]', {
      isDataLoaded,
      edgesData,
    });
    setEdgesData(edgesData);
  }, []);
  // TODO: Calculate cummulative loading status depending on all data loading status
  React.useEffect(() => {
    const isAllDataLoaded = !!edgesData;
    setAllDataLoaded(isAllDataLoaded);
  }, [edgesData]);
  return (
    <Container className={classNames(className, styles.root)} maxWidth="md">
      <Box className={classNames(styles.section, styles.content)}>
        <Typography variant="h3" gutterBottom>
          Load data
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          An intro text providing some explanations about the data loading procedure.
        </Typography>
      </Box>
      <Box className={classNames(styles.section, styles.inputs)}>
        <UploadSankeyDataField
          // prettier-ignore
          id="edgesData"
          dataName="edges data"
          setData={handleEdgesData}
        />
        {/*
        <DataFileUploadField
          // prettier-ignore
          id="testData"
          text="Upload data file"
          buttonProps={{
            fullWidth: true,
          }}
        />
        */}
      </Box>
      <Box className={classNames(styles.section, styles.actions)}>
        <Button
          // prettier-ignore
          variant="contained"
          onClick={doStart}
          disabled={!isAllDataLoaded}
        >
          Start visualizing
        </Button>
      </Box>
    </Container>
  );
};
