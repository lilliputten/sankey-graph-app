import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

// @ts-ignore
import AnyChart from 'anychart-react';

import { isDevBrowser } from 'src/config/build';
import * as toasts from 'src/ui/Basic/Toasts';
import { getErrorText } from 'src/helpers';
import { TAnyChartData } from 'src/core/types/anychart';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { constructEdgesData } from 'src/helpers/anychart';
import { constructGraphsHashGraphsData, constructNodesHashFromData } from 'src/helpers/Sankey';
import { TChartComponentProps, TChartDataSet, TFullChartDataSet } from 'src/core/types';

import styles from './SankeyAnychartDemo.module.scss';

/** DEBUG: Don't wait for user action */
const __debugUseDemoData = false && isDevBrowser;

const demoChartData: TAnyChartData = [
  { from: 'First Class', to: 'Child', value: 6 },
  { from: 'Second Class', to: 'Child', value: 24 },
  { from: 'Third Class', to: 'Child', value: 79 },
  { from: 'Crew', to: 'Child', value: 0 },
  { from: 'First Class', to: 'Adult', value: 319 },
  { from: 'Second Class', to: 'Adult', value: 261 },
  { from: 'Third Class', to: 'Adult', value: 627 },
  { from: 'Crew', to: 'Adult', value: 885 },
  { from: 'Child', to: 'Female', value: 45 },
  { from: 'Child', to: 'Male', value: 64 },
  { from: 'Adult', to: 'Female', value: 425 },
  { from: 'Adult', to: 'Male', value: 1667 },
  { from: 'Female', to: 'Survived', value: 344 },
  { from: 'Female', to: 'Perished', value: 126 },
  { from: 'Male', to: 'Survived', value: 367 },
  { from: 'Male', to: 'Perished', value: 1364 },
];

export const SankeyAnychartDemo: React.FC<TChartComponentProps> = observer((props) => {
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
      console.error('[SankeyAnychartDemo:getFullDataSet] error', {
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
  const chartData = React.useMemo<TAnyChartData | undefined>(() => {
    if (__debugUseDemoData) {
      return demoChartData;
    }
    const fullDataSet = getFullDataSet({
      // prettier-ignore
      edgesData,
      flowsData,
      graphsData,
      nodesData,
    });
    if (!fullDataSet) {
      // Error should already be processed in `getFullDataSet`
      return undefined;
    }
    try {
      const chartData = constructEdgesData(fullDataSet);
      setErrorText(undefined);
      return chartData;
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
      console.error('[SankeyAnychartDemo:chartData] error', {
        // error,
        resultError,
        fullDataSet,
        edgesData,
        flowsData,
        graphsData,
        nodesData,
      });
      debugger; // eslint-disable-line no-debugger
      setErrorText(getErrorText(resultError));
    }
  }, [
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData,
    nodesData,
    getFullDataSet,
  ]);

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
        <AnyChart
          className={styles.chart}
          type="sankey"
          data={chartData}
          // title="Simple chart"
        />
      )}
    </Box>
  );
});
