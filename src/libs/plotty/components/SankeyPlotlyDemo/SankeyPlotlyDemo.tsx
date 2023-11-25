import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';

import { isDevBrowser } from 'src/config/build';
import * as toasts from 'src/ui/Basic/Toasts';
import { getErrorText } from 'src/helpers';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { constructGraphsHashGraphsData, constructNodesHashFromData } from 'src/helpers/Sankey';
import { TChartComponentProps, TChartDataSet, TFullChartDataSet } from 'src/core/types';
import { useContainerSize } from 'src/ui/hooks';

// import { TPlotlyData } from 'src/libs/plotly/types';
// import { constructEdgesData } from 'src/libs/plotly/helpers';

import styles from './SankeyPlotlyDemo.module.scss';

/** DEBUG: Don't wait for user action */
const __debugUseDemoData = false && isDevBrowser;

type TPlotlyData = Plotly.Data[];

const demoSimpleChartData: TPlotlyData = [
  {
    x: [1, 2, 3],
    y: [2, 6, 3],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'red' },
  },
  { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
];
const demoSankeyData: TPlotlyData = [
  {
    type: 'sankey',
    orientation: 'h',
    node: {
      pad: 15,
      thickness: 30,
      line: {
        color: 'black',
        width: 0.5,
      },
      label: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      color: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
    },
    link: {
      source: [0, 1, 0, 2, 3, 3],
      target: [2, 3, 3, 4, 4, 5],
      value: [8, 4, 2, 8, 4, 2],
    },
  },
];

export const SankeyPlotlyDemo: React.FC<TChartComponentProps> = observer((props) => {
  const { className } = props;
  const sankeyAppDataStore = useSankeyAppDataStore();
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
  // Handle wrapper container size...
  const { ref: resizeRef, width, height } = useContainerSize();
  const getFullDataSet = React.useCallback((dataSet: Partial<TChartDataSet>) => {
    const {
      // prettier-ignore
      edgesData,
      flowsData,
      graphsData,
      nodesData,
    } = dataSet;
    try {
      if (!edgesData || !flowsData || !graphsData || !nodesData) {
        const errMsg = 'Some of required data is undefined';
        const error = new Error(errMsg);
        throw error;
      }
      const graphsHash = constructGraphsHashGraphsData(graphsData);
      const nodesHash = constructNodesHashFromData(nodesData);
      const fullDataSet: TFullChartDataSet = {
        edgesData,
        flowsData,
        graphsData,
        nodesData,
        graphsHash,
        nodesHash,
      };
      return fullDataSet;
    } catch (error) {
      const errMsg = [
        // prettier-ignore
        'Cannot costruct full data set',
        getErrorText(error),
      ]
        .filter(Boolean)
        .join(': ');
      const resultError = new Error(errMsg);
      // eslint-disable-next-line no-console
      console.error('[SankeyPlotlyDemo:getFullDataSet] error', {
        // error,
        resultError,
        edgesData,
        flowsData,
        graphsData,
        nodesData,
      });
      debugger; // eslint-disable-line no-debugger
      setErrorText(getErrorText(resultError));
    }
  }, []);
  const chartData = React.useMemo<TPlotlyData | undefined>(
    () => {
      return demoSankeyData;
      /*
       * if (__debugUseDemoData) {
       *   return demoChartData;
       * }
       */
    },
    [
    // prettier-ignore
    // edgesData,
    // flowsData,
    // graphsData,
    // nodesData,
    // getFullDataSet,
  ],
  );

  const layout = React.useMemo<Partial<Plotly.Layout>>(
    () => ({
      // title: 'Test',
      width,
      height,
    }),
    [width, height],
  );

  return (
    <Box
      ref={resizeRef} // Handle node resize...
      className={classNames(className, styles.root)}
    >
      {/* // Debug: show some small stats...
      <Box>
        <Typography>Edges: {getSankeyDataInfo(edgesData)}</Typography>
        <Typography>Flows: {getSankeyDataInfo(flowsData)}</Typography>
        <Typography>Graphs: {getSankeyDataInfo(graphsData)}</Typography>
        <Typography>Nodes: {getSankeyDataInfo(nodesData)}</Typography>
      </Box>
      */}
      {!!errorText && <Box className={styles.errorBox}>{errorText}</Box>}
      {!!chartData && (
        <Plot
          // prettier-ignore
          className={styles.chart}
          data={chartData}
          layout={layout}
        />
      )}
    </Box>
  );
});
