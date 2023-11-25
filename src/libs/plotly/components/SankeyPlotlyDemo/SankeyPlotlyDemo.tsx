import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import ReactPlotty from 'react-plotly.js';
import Plotly from 'plotly.js';

// import { isDevBrowser } from 'src/config/build';
import * as toasts from 'src/ui/Basic/Toasts';
import { getErrorText } from 'src/helpers';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { getFullDataSet } from 'src/helpers/Sankey';
import { TChartComponentProps } from 'src/core/types';
import { useContainerSize } from 'src/ui/hooks';

import { TPlotlyData } from 'src/libs/plotly/types';
import { constructChartData } from 'src/libs/plotly/helpers';

// import { constructEdgesData } from 'src/libs/plotly/helpers';

import styles from './SankeyPlotlyDemo.module.scss';

/* [>* DEBUG: Don't wait for user action <]
 * const __debugUseDemoData = false && isDevBrowser;
 */

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
  const chartData = React.useMemo<TPlotlyData | undefined>(() => {
    const fullDataSet = getFullDataSet({
      // prettier-ignore
      edgesData,
      flowsData,
      graphsData,
      nodesData,
    });
    try {
      const chartData = constructChartData(fullDataSet);
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
  ]);

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
      {!!errorText && <Box className={styles.errorBox}>{errorText}</Box>}
      {!!chartData && (
        <ReactPlotty
          // prettier-ignore
          className={styles.chart}
          data={chartData}
          layout={layout}
        />
      )}
    </Box>
  );
});
