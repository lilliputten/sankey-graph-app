import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Stack, Button, Container } from '@mui/material';
import classNames from 'classnames';

import {
  TPropsWithClassName,
  TEdgesData,
  TFlowsData,
  TGraphsData,
  TNodesData,
} from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import {
  getSankeyDataInfo,
  useSankeyAppDataStore,
} from 'src/components/SankeyApp/SankeyAppDataStore';
import { UploadSankeyDataField } from 'src/components/SankeyMisc/UploadSankeyDataField';

import { InfoContent } from './InfoContent';

import styles from './SankeyAppCoreStart.module.scss';

export const SankeyAppCoreStart: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const {
    // prettier-ignore
    doAutoLoad: defaultAutoLoad,
    doAutoStart, // : defaultAutoStart,
    autoLoadUrlEdges,
    autoLoadUrlFlows,
    autoLoadUrlGraphs,
    autoLoadUrlNodes,
  } = sankeyAppSessionStore;
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData,
    nodesData,
  } = sankeyAppDataStore;
  const [doAutoLoad, setAutoLoad] = React.useState(defaultAutoLoad);
  // const [doAutoStart, setAutoStart] = React.useState(defaultAutoStart);
  /** If data has already loaded then it's possible to go to core visualizer/editor */
  const [isAllDataLoaded, setAllDataLoaded] = React.useState(false);
  const [isSomeDataLoaded, setSomeDataLoaded] = React.useState(false);
  /** Start core application if all the data is ready... */
  const doVisualize = React.useCallback(() => {
    sankeyAppSessionStore.updateHiddenGraphNodes();
    // All data is ready
    sankeyAppDataStore.setReady(true);
  }, [sankeyAppDataStore, sankeyAppSessionStore]);
  const doResetData = React.useCallback(() => {
    // Clear all the data...
    setAutoLoad(false);
    sankeyAppDataStore.setEdgesData(undefined);
    sankeyAppDataStore.setFlowsData(undefined);
    sankeyAppDataStore.setGraphsData(undefined);
    sankeyAppDataStore.setNodesData(undefined);
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
    const isSomeDataLoaded = !!(edgesData || flowsData || graphsData || nodesData);
    setAllDataLoaded(isAllDataLoaded);
    setSomeDataLoaded(isSomeDataLoaded);
  }, [edgesData, flowsData, graphsData, nodesData]);
  // Auto start visualization...
  React.useEffect(() => {
    if (isAllDataLoaded && doAutoStart) {
      doVisualize();
    }
  }, [isAllDataLoaded, doAutoStart, doVisualize]);
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
          autoLoadUrl={doAutoLoad ? autoLoadUrlEdges : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="flowsData"
          dataName="flows data"
          setData={handleFlowsData}
          defaultLoaded={!!flowsData}
          dataInfo={getSankeyDataInfo(flowsData)}
          autoLoadUrl={doAutoLoad ? autoLoadUrlFlows : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="graphsData"
          dataName="graphs data"
          setData={handleGraphsData}
          defaultLoaded={!!graphsData}
          dataInfo={getSankeyDataInfo(graphsData)}
          autoLoadUrl={doAutoLoad ? autoLoadUrlGraphs : undefined}
          className={styles.uploadButton}
        />
        <UploadSankeyDataField
          id="nodesData"
          dataName="nodes data"
          setData={handleNodesData}
          defaultLoaded={!!nodesData}
          dataInfo={getSankeyDataInfo(nodesData)}
          autoLoadUrl={doAutoLoad ? autoLoadUrlNodes : undefined}
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
          color="secondary"
          disabled={isAllDataLoaded}
        >
          Load default datasets
        </Button>
        <Button
          // prettier-ignore
          variant="contained"
          onClick={doResetData}
          color="error"
          disabled={!isSomeDataLoaded}
        >
          Reset loaded data
        </Button>
      </Box>
    </Container>
  );
});
