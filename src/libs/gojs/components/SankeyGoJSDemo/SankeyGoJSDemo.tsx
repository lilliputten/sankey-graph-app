import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { TChartComponentProps } from 'src/core/types';
import { isDevBrowser } from 'src/config/build';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import * as toasts from 'src/ui/Basic/Toasts';
import { getFullDataSet } from 'src/helpers/Sankey';
import { getErrorText } from 'src/helpers';
import { DiagramWrapper } from 'src/libs/gojs/core';
import {
  constructNodeDataArrayFromGraphs,
  constructLinkDataArrayFromEdges,
  getGojsSampleMinimalData,
  // getGojsSampleData,
} from 'src/libs/gojs/helpers';

import styles from './SankeyGoJSDemo.module.scss';

/** DEBUG: Don't wait for user action */
const __debugUseDemoData = false && isDevBrowser;

export const SankeyGoJSDemo: React.FC<TChartComponentProps> = observer((props) => {
  const { className } = props;
  const sankeyAppDataStore = useSankeyAppDataStore();
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { lineWidthFactor } = sankeyAppSessionStore;
  const [errorText, setErrorText] = React.useState<string | undefined>();
  React.useEffect(() => {
    if (errorText) {
      toasts.showError(errorText);
    }
  }, [errorText]);
  const {
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData,
    nodesData,
  } = sankeyAppDataStore;

  const gojsData = React.useMemo(() => {
    if (__debugUseDemoData) {
      // return getGojsSampleData();
      return getGojsSampleMinimalData();
    }
    // const gojsDataSample = getGojsSampleMinimalData();
    try {
      const fullDataSet = getFullDataSet({
        // prettier-ignore
        edgesData,
        flowsData,
        graphsData,
        nodesData,
      });
      console.log('[SankeyGoJSDemo:gojsData] start', {
        edgesData: edgesData?.map((it) => ({ ...it })),
        flowsData: flowsData?.map((it) => ({ ...it })),
        graphsData: graphsData?.map((it) => ({ ...it })),
        nodesData: nodesData?.map((it) => ({ ...it })),
      });
      // prettier-ignore
      const nodeDataArray = constructNodeDataArrayFromGraphs(fullDataSet);
      const linkDataArray = constructLinkDataArrayFromEdges(fullDataSet, { lineWidthFactor });
      // const modelData = go.Model.fromJson(gojsData);
      console.log('[SankeyGoJSDemo:gojsData] data', {
        fullDataSet,
        nodeDataArray,
        linkDataArray,
      });
      const gojsData = {
        nodeDataArray,
        linkDataArray,
      };
      console.log('[SankeyGoJSDemo:gojsData] done', {
        gojsData,
        // gojsDataSample,
      });
      // debugger;
      return gojsData;
    } catch (error) {
      const errMsg = [
        // prettier-ignore
        'Cannot costruct chart data',
        getErrorText(error),
      ]
        .filter(Boolean)
        .join(': ');
      const resultError = new Error(errMsg);
      // eslint-disable-next-line no-console
      console.error('[SankeyGoJSDemo:gojsData] error', {
        // error,
        resultError,
        edgesData,
        flowsData,
        graphsData,
        nodesData,
      });
      debugger; // eslint-disable-line no-debugger
      setErrorText(errMsg);
    }
  }, [
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData,
    nodesData,
    lineWidthFactor,
  ]);

  const fullGojsData = React.useMemo(() => {
    if (gojsData) {
      return {
        ...gojsData,
        modelData: {
          canRelink: true,
        },
        selectedData: null,
        skipsDiagramUpdate: false,
      };
    }
  }, [gojsData]);

  return (
    <Box className={classNames(className, styles.root)}>
      {/* // Debug: show some small stats...
      <Box>
        <Typography>Edges: {getSankeyDataInfo(edgesData)}</Typography>
        <Typography>Flows: {getSankeyDataInfo(flowsData)}</Typography>
        <Typography>Graphs: {getSankeyDataInfo(graphsData)}</Typography>
        <Typography>Nodes: {getSankeyDataInfo(nodesData)}</Typography>
      </Box>
      */}
      {!!errorText && <Box className={styles.errorBox}>{errorText}</Box>}
      {!!fullGojsData && (
        <DiagramWrapper
          nodeDataArray={fullGojsData.nodeDataArray}
          linkDataArray={fullGojsData.linkDataArray}
          modelData={fullGojsData.modelData}
          skipsDiagramUpdate={fullGojsData.skipsDiagramUpdate}
          // onDiagramEvent={this.handleDiagramEvent}
          // onModelChange={this.handleModelChange}
        />
      )}
    </Box>
  );
});
