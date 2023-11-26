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
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { getFullDataSet, getNodeForId } from 'src/helpers/Sankey';
import { TChartComponentProps, TFullChartDataSet, TGraphId } from 'src/core/types';
import { useContainerSize } from 'src/ui/hooks';

import { TPlotlyData } from 'src/libs/plotly/types';
import { constructChartData } from 'src/libs/plotly/helpers';

import { EditSankeyNodeDialog } from 'src/components/SankeyEditor/EditSankeyNodeDialog';

import styles from './SankeyPlotlyDemo.module.scss';

interface TMemo {
  currentNodePoint?: Plotly.PlotDatum;
}

/* [>* DEBUG: Don't wait for user action <]
 * const __debugUseDemoData = false && isDevBrowser;
 */

export const SankeyPlotlyDemo: React.FC<TChartComponentProps> = observer((props) => {
  const { className } = props;
  // const [currentNodePoint, setCurrentNodePoint] = React.useState<PlotDatum | undefined>();
  const sankeyAppDataStore = useSankeyAppDataStore();
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { themeMode } = sankeyAppSessionStore;
  const isDarkTheme = themeMode === 'dark';
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

  const chartLayout = React.useMemo<Partial<Plotly.Layout>>(
    () => ({
      // title: 'Test',
      width,
      height,
      font: {
        color: isDarkTheme ? '#ddd' : '#333',
      },
      paper_bgcolor: isDarkTheme ? 'black' : 'white',
    }),
    [width, height, isDarkTheme],
  );

  const chartConfig = React.useMemo<Partial<Plotly.Config>>(
    () => ({
      // NOTE: Sankey diagrams can't be zoomed?
      scrollZoom: true,
      displaylogo: false,
      responsive: true,
      displayModeBar: true,
      // displayModeBar: false,
      modeBarButtonsToRemove: [
        // prettier-ignore
        'lasso2d',
        'select2d',
      ],
      /* modeBarButtonsToAdd: [
       *   'lasso2d',
       *   'select2d',
       *   'sendDataToCloud',
       *   'zoom2d',
       *   'pan2d',
       *   'zoomIn2d',
       *   'zoomOut2d',
       *   'autoScale2d',
       *   'resetScale2d',
       *   // 'hoverClosestCartesian',
       *   // 'hoverCompareCartesian',
       *   'zoom3d',
       *   'pan3d',
       *   // 'orbitRotation',
       *   // 'tableRotation',
       *   // 'handleDrag3d',
       *   // 'resetCameraDefault3d',
       *   // 'resetCameraLastSave3d',
       *   // 'hoverClosest3d',
       *   // 'zoomInGeo',
       *   // 'zoomOutGeo',
       *   // 'resetGeo',
       *   // 'hoverClosestGeo',
       *   // 'hoverClosestGl2d',
       *   // 'hoverClosestPie',
       *   // 'toggleHover',
       *   'toImage',
       *   'resetViews',
       *   'toggleSpikelines',
       *   'zoomInMapbox',
       *   'zoomOutMapbox',
       *   'resetViewMapbox',
       *   'togglespikelines',
       *   'togglehover',
       *   'hovercompare',
       *   'hoverclosest',
       *   'v1hovermode',
       * ],
       */
      /* editable: true,
       * edits: {
       *   annotationPosition: true,
       *   annotationTail: true,
       *   annotationText: true,
       *   axisTitleText: true,
       *   colorbarPosition: true,
       *   colorbarTitleText: true,
       *   legendPosition: true,
       *   legendText: true,
       *   shapePosition: true,
       *   titleText: true,
       * },
       */
    }),
    [],
  );

  /* // UNUSED: Interactive: edit node dialog...
   * // const [currentGraphId, setCurrentGraphId] = React.useState<TGraphId | undefined>();
   * const [openEditSankeyNodeDialog, setOpenEditSankeyNodeDialog] = React.useState(false);
   * const handleOpenEditSankeyNodeDialog = () => {
   *   setOpenEditSankeyNodeDialog(true);
   * };
   * const handleCloseEditSankeyNodeDialog = () => {
   *   setOpenEditSankeyNodeDialog(false);
   * };
   */

  // Interactive: user handlers...

  const memo = React.useMemo<TMemo>(() => ({}), []);

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
        const {
          id_in_graph: graphId, // -1, self index
          id_in_database: nodeId, // -1, node id
          // product_id_in_database, // -1
          // product_scaling_amount, // 1.0
          // process_amount, // 1.0
          // score_through_supply_chain, // 9.981936043202016e-9
          // score_of_node, // 0.0
        } = graph;
        // TODO: Check if not graphId is defined?
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
        // Start node editor dialog: save graph id, open dialog...
        // setCurrentGraphId(graphId);
        // handleOpenEditSankeyNodeDialog();
        sankeyAppSessionStore.setSelectedGraphId(graphId);
      }
    },
    [
      // prettier-ignore
      memo,
      fullDataSet,
      sankeyAppSessionStore,
    ],
  );

  // TODO 2023.11.26, 22:39 -- Fix overcasting labels (`node-label`) by node bars (`node-rect`)
  // TODO 2023.11.26, 17:39 -- Don't auto open properties panel if it had hidden manually?
  // TODO 2023.11.26, 17:34 -- Adjust plotly toolbar to not overcased by toggle button
  // TODO 2023.11.26, 17:27 -- Reset selected graph id on click outside the node
  // TODO 2023.11.26, 17:25 -- Don't react to node dragging?

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
          config={chartConfig}
          layout={chartLayout}
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
      {/* // Use modal dialog to edit current graph node (TODO?)
      <EditSankeyNodeDialog
        open={openEditSankeyNodeDialog}
        handleClose={handleCloseEditSankeyNodeDialog}
        graphId={currentGraphId}
      />
      */}
    </Box>
  );
});
