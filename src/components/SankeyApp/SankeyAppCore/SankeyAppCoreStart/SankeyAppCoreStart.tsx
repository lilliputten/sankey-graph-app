import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Stack, Button, Container, Typography } from '@mui/material';
import classNames from 'classnames';

import { isDevBrowser } from 'src/config/build';
import { sampleDataUrlPrefix } from 'src/config/app';
import { periodizeNumber } from 'src/helpers';
import {
  PropsWithClassName,
  TEdgesData,
  TFlowsData,
  TGraphsData,
  TNodesData,
} from 'src/core/types';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { UploadSankeyDataField } from 'src/components/SankeyMisc/UploadSankeyDataField';

import styles from './SankeyAppCoreStart.module.scss';

type TSankeyAppCoreStartProps = PropsWithClassName;

const __debugDoAutoLoadData = true && isDevBrowser;

/** Default file names for specific data types */
const defaultDataFiles = {
  edges: 'edges.json',
  flows: 'flows.json',
  graphs: 'nodes-supply-chain.json', // 'graphs.json',
  nodes: 'nodes.json',
};
/** Create demo urls list */
const autoLoadUrls = Object.keys(defaultDataFiles).reduce<Partial<typeof defaultDataFiles>>(
  (urls, id) => {
    urls[id as keyof typeof defaultDataFiles] =
      sampleDataUrlPrefix + defaultDataFiles[id as keyof typeof defaultDataFiles];
    return urls;
  },
  {},
);

// TODO: Move the following helpers to an external modules?

function getDataInfo(list?: unknown[]) {
  if (!Array.isArray(list)) {
    return 'no data';
  }
  const size = list.length;
  if (!size) {
    return 'empty';
  } else {
    const records = periodizeNumber(size, ',');
    return records + ' record' + (size > 1 ? 's' : '');
  }
}

const InfoContent: React.FC = () => (
  <>
    <Typography variant="h3" gutterBottom>
      Load data
    </Typography>
    <Typography variant="subtitle1" gutterBottom>
      An intro text providing some explanations about the data loading procedure.
    </Typography>
    <Typography variant="h5" gutterBottom>
      Sample data file names:
    </Typography>
    <ul className={styles.list}>
      <li>
        Edges: <u>{defaultDataFiles.edges}</u>
      </li>
      <li>
        Flows: <u>{defaultDataFiles.flows}</u>
      </li>
      <li>
        Graphs: <u>{defaultDataFiles.graphs}</u>
      </li>
      <li>
        Nodes: <u>{defaultDataFiles.nodes}</u>
      </li>
    </ul>
  </>
);

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
  const doStart = React.useCallback(() => {
    // All data is ready
    console.log('[SankeyAppCoreStart:doStart]', {});
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
          dataInfo={getDataInfo(edgesData)}
          autoLoadUrl={__debugDoAutoLoadData ? autoLoadUrls.edges : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="flowsData"
          dataName="flows data"
          setData={handleFlowsData}
          defaultLoaded={!!flowsData}
          dataInfo={getDataInfo(flowsData)}
          autoLoadUrl={__debugDoAutoLoadData ? autoLoadUrls.flows : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="graphsData"
          dataName="graphs data"
          setData={handleGraphsData}
          defaultLoaded={!!graphsData}
          dataInfo={getDataInfo(graphsData)}
          autoLoadUrl={__debugDoAutoLoadData ? autoLoadUrls.graphs : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="nodesData"
          dataName="nodes data"
          setData={handleNodesData}
          defaultLoaded={!!nodesData}
          dataInfo={getDataInfo(nodesData)}
          autoLoadUrl={__debugDoAutoLoadData ? autoLoadUrls.nodes : undefined}
          className={styles.uploadButton}
        />
      </Stack>
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
});
