import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Stack, Button, Container } from '@mui/material';
import classNames from 'classnames';

// import { isDevBrowser } from 'src/config/build';
import { autoLoadUrls } from 'src/core/constants/Sankey';
import {
  TPropsWithClassName,
  TEdgesData,
  TFlowsData,
  TGraphsData,
  TNodesData,
} from 'src/core/types';
import {
  getSankeyDataInfo,
  useSankeyAppDataStore,
} from 'src/components/SankeyApp/SankeyAppDataStore';
import { UploadSankeyDataField } from 'src/components/SankeyMisc/UploadSankeyDataField';
import { InfoContent } from './InfoContent';

import styles from './SankeyAppCoreStart.module.scss';

type TSankeyAppCoreStartProps = TPropsWithClassName;

// const __debugDoAutoLoadData = true && isDevBrowser;

// TODO: Move the following helpers to an external modules?

export const SankeyAppCoreStart: React.FC<TSankeyAppCoreStartProps> = observer((props) => {
  const { className } = props;
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData,
    nodesData,
  } = sankeyAppDataStore;
  /** If data has already loaded then it's possible to go to core visualizer/editor */
  const [isAllDataLoaded, setAllDataLoaded] = React.useState(false);
  /** Start core application if all the data is ready... */
  const doVisualize = React.useCallback(() => {
    // All data is ready
    console.log('[SankeyAppCoreStart:doVisualize]', {});
    sankeyAppDataStore.setReady(true);
  }, [sankeyAppDataStore]);
  /** Handle loaded edges data... */
  const handleEdgesData = React.useCallback(
    (edgesData?: TEdgesData) => {
      sankeyAppDataStore.setEdgesData(edgesData);
    },
    [sankeyAppDataStore],
  );
  /** Handle loaded flows data... */
  const handleFlowsData = React.useCallback(
    (flowsData?: TFlowsData) => {
      sankeyAppDataStore.setFlowsData(flowsData);
    },
    [sankeyAppDataStore],
  );
  /** Handle loaded graphs data... */
  const handleGraphsData = React.useCallback(
    (graphsData?: TGraphsData) => {
      sankeyAppDataStore.setGraphsData(graphsData);
    },
    [sankeyAppDataStore],
  );
  /** Handle loaded nodes data... */
  const handleNodesData = React.useCallback(
    (nodesData?: TNodesData) => {
      sankeyAppDataStore.setNodesData(nodesData);
    },
    [sankeyAppDataStore],
  );
  // Calculate overall loading status depending on all data loading status
  React.useEffect(() => {
    const isAllDataLoaded = !!(edgesData && flowsData && graphsData && nodesData);
    setAllDataLoaded(isAllDataLoaded);
  }, [edgesData, flowsData, graphsData, nodesData]);
  const [doAutoLoad, setAutoLoad] = React.useState(false); // __debugDoAutoLoadData
  return (
    <Container className={classNames(className, styles.root)} maxWidth="md">
      <Box className={classNames(styles.section, styles.content)}>
        <InfoContent />
      </Box>
      <Stack className={classNames(styles.section, styles.inputFields)} gap={1}>
        <UploadSankeyDataField
          id="edgesData"
          dataName="edges data"
          setData={handleEdgesData}
          defaultLoaded={!!edgesData}
          dataInfo={getSankeyDataInfo(edgesData)}
          autoLoadUrl={doAutoLoad ? autoLoadUrls.edges : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="flowsData"
          dataName="flows data"
          setData={handleFlowsData}
          defaultLoaded={!!flowsData}
          dataInfo={getSankeyDataInfo(flowsData)}
          autoLoadUrl={doAutoLoad ? autoLoadUrls.flows : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="graphsData"
          dataName="graphs data"
          setData={handleGraphsData}
          defaultLoaded={!!graphsData}
          dataInfo={getSankeyDataInfo(graphsData)}
          autoLoadUrl={doAutoLoad ? autoLoadUrls.graphs : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="nodesData"
          dataName="nodes data"
          setData={handleNodesData}
          defaultLoaded={!!nodesData}
          dataInfo={getSankeyDataInfo(nodesData)}
          autoLoadUrl={doAutoLoad ? autoLoadUrls.nodes : undefined}
          className={styles.uploadButton}
        />
      </Stack>
      <Box className={classNames(styles.section, styles.actions)}>
        <Button
          // prettier-ignore
          variant="contained"
          onClick={doVisualize}
          disabled={!isAllDataLoaded}
        >
          Visualize
        </Button>
        <Button
          // prettier-ignore
          variant="contained"
          onClick={() => setAutoLoad(true)}
          color="warning"
          disabled={isAllDataLoaded}
        >
          Load demo data
        </Button>
      </Box>
    </Container>
  );
});
