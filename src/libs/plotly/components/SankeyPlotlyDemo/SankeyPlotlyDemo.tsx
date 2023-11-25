import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import ReactPlotty from 'react-plotly.js';
import Plotly, { PlotDatum } from 'plotly.js';

// import { isDevBrowser } from 'src/config/build';
import * as toasts from 'src/ui/Basic/Toasts';
import { getErrorText } from 'src/helpers';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { getFullDataSet, getNodeForId } from 'src/helpers/Sankey';
import { TChartComponentProps, TFullChartDataSet } from 'src/core/types';
import { useContainerSize } from 'src/ui/hooks';

import { TPlotlyData } from 'src/libs/plotly/types';
import { constructChartData } from 'src/libs/plotly/helpers';

// import { constructEdgesData } from 'src/libs/plotly/helpers';

import styles from './SankeyPlotlyDemo.module.scss';

interface TMemo {
  currentNodePoint?: Plotly.PlotDatum;
}

/* [>* DEBUG: Don't wait for user action <]
 * const __debugUseDemoData = false && isDevBrowser;
 */

export const SankeyPlotlyDemo: React.FC<TChartComponentProps> = observer((props) => {
  const { className } = props;
  const memo = React.useMemo<TMemo>(() => ({}), []);
  // const [currentNodePoint, setCurrentNodePoint] = React.useState<PlotDatum | undefined>();
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
  /** Full sankey data set */
  const fullDataSet = React.useMemo<TFullChartDataSet>(
    () =>
      getFullDataSet({
        // prettier-ignore
        edgesData,
        flowsData,
        graphsData,
        nodesData,
      }),
    [
      // prettier-ignore
      edgesData,
      flowsData,
      graphsData,
      nodesData,
    ],
  );
  /** Composite plotly chart data */
  const chartData = React.useMemo<TPlotlyData | undefined>(() => {
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
      console.error('[SankeyPlotlyDemo:chartData] error', {
        // error,
        resultError,
        fullDataSet,
      });
      debugger; // eslint-disable-line no-debugger
      setErrorText(getErrorText(resultError));
    }
  }, [
    // prettier-ignore
    fullDataSet,
  ]);

  const layout = React.useMemo<Partial<Plotly.Layout>>(
    () => ({
      // title: 'Test',
      width,
      height,
    }),
    [width, height],
  );

  const config = React.useMemo<Partial<Plotly.Config>>(
    () => ({
      // displayModeBar: false,
      // editable: true,
      // edits: {
      //   annotationPosition: false,
      //   annotationTail: false,
      //   annotationText: false,
      //   axisTitleText: false,
      //   colorbarPosition: false,
      //   colorbarTitleText: false,
      //   legendPosition: false,
      //   legendText: false,
      //   shapePosition: false,
      //   titleText: false,
      // },
    }),
    [],
  );

  const handleHover = React.useCallback(
    (ev: Readonly<Plotly.PlotMouseEvent>) => {
      const {
        points, // PlotDatum[]
      } = ev;
      const currentNodePoint = { ...points[0] };
      // NOTE: Store single node for the next sankey node click event ('onRestyle')
      memo.currentNodePoint = currentNodePoint;
      // console.log('[SankeyPlotlyDemo:handleHover]', currentNodePoint);
    },
    [memo],
  );

  const handleSankeyNodeClick = React.useCallback(
    ([update, indices]: readonly [Plotly.PlotRestyleEventUpdate, number[]]) => {
      const { currentNodePoint } = memo;
      /* console.log('[SankeyPlotlyDemo:handleSankeyNodeClick] start', currentNodePoint, {
       *   // 'memo.currentNodePoint': memo.currentNodePoint,
       * });
       */
      if (currentNodePoint) {
        const {
          // Destructure node point data...
          pointNumber,
        } = currentNodePoint;
        const {
          // edgesData, // TEdgesData;
          // flowsData, // TFlowsData;
          graphsData, // TGraphsData;
          // nodesData, // TNodesData;
          // graphsHash,
          nodesHash,
          // graphsMap,
          // nodesMap,
        } = fullDataSet;
        const graphIdx = pointNumber; // Use `pointNumber` instead of forbidden `index`
        const graph = graphsData[graphIdx]; // graphsHash[graphId];
        if (!graph) {
          const errMsg = 'Not found graph node for index ' + graphIdx;
          const error = new Error(errMsg);
          // eslint-disable-next-line no-console
          console.error('[SankeyPlotlyDemo:handleSankeyNodeClick] error', {
            error,
            graphIdx,
            pointNumber,
            update,
            indices,
            currentNodePoint,
            fullDataSet,
          });
          debugger; // eslint-disable-line no-debugger
          throw error;
        }
        const graphId = graph.id_in_graph;
        const {
          // id_in_graph: id, // -1, self index
          id_in_database: nodeId, // -1, node id
          // product_id_in_database, // -1
          // product_scaling_amount, // 1.0
          // process_amount, // 1.0
          // score_through_supply_chain, // 9.981936043202016e-9
          // score_of_node, // 0.0
        } = graph;
        const node = getNodeForId(nodesHash, nodeId);
        const { name: nodeName } = node;
        // NOTE: Unhover events invokes before sankey node click, so we mustn't to use it
        console.log('[SankeyPlotlyDemo:handleSankeyNodeClick]', {
          nodeName,
          graph: { ...graph },
          graphIdx,
          graphId,
          pointNumber,
          update,
          indices,
          currentNodePoint,
          fullDataSet,
        });
        // TODO: Start node editor
      }
    },
    [
      // prettier-ignore
      memo,
      fullDataSet,
    ],
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
          config={config}
          layout={layout}
          // NOTE: 'onClick' event works only for flow elements in sankey data mode
          // onClick={handleClick}
          // NOTE: For sankey nodes click events changes into a restyle ones
          // @see https://community.plotly.com/t/no-click-event-detected-for-sankey-nodes-when-arrangement-is-snap/71649/4
          onRestyle={handleSankeyNodeClick}
          // NOTE: `onHover` event used only for store hovered nodes for future
          // use in sankey node click handler (which unfortunately doesn't
          // provide current nodes)
          onHover={handleHover}
          // NOTE: Unhover events invokes before sankey node click, so we mustn't to use it
          // onUnhover={handleUnhover}
        />
      )}
    </Box>
  );
});
