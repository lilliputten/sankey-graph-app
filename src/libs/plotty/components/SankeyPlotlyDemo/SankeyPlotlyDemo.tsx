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

// import { TPlotlyData } from 'src/libs/plotly/types';
// import { constructEdgesData } from 'src/libs/plotly/helpers';

import styles from './SankeyPlotlyDemo.module.scss';

/** DEBUG: Don't wait for user action */
const __debugUseDemoData = false && isDevBrowser;

type TPlotlyData = Plotly.Data[];

const demoChartData: TPlotlyData = [
  {
    x: [1, 2, 3],
    y: [2, 6, 3],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'red' },
  },
  { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
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
      return demoChartData;
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

  const layout: Partial<Plotly.Layout> = {
    // title: 'Test',
    // width: '100%',
    // height: '100%',
  };

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
