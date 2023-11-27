import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import ReactPlotty from 'react-plotly.js';
import Plotly from 'plotly.js';

// import { isDevBrowser } from 'src/config/build';
import * as toasts from 'src/ui/Basic/Toasts';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { TChartComponentProps } from 'src/core/types';
import { useContainerSize } from 'src/ui/hooks';

import { useChartData } from 'src/libs/plotly/hooks';

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
  const [errorText /* , setErrorText */] = React.useState<string | undefined>();
  // Effect: Show an error...
  React.useEffect(() => {
    if (errorText) {
      toasts.showError(errorText);
    }
  }, [errorText]);
  const { ref: resizeRef, width, height } = useContainerSize();
  const chartData = useChartData();

  const chartLayout = React.useMemo<Partial<Plotly.Layout>>(
    () => ({
      // title: 'Test',
      width,
      height,
      font: {
        // TODO: store colors in config/storage?
        color: isDarkTheme ? '#ccc' : '#333',
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

  /* // UNUSED (?): Interactive: edit node dialog...
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
      const { graphsData } = sankeyAppDataStore;
      if (currentNodePoint && graphsData) {
        const {
          // Destructure node point data...
          pointNumber,
        } = currentNodePoint;
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
          });
          debugger; // eslint-disable-line no-debugger
          throw error;
        }
        const {
          id_in_graph: graphId, // -1, self index
          // id_in_database: nodeId, // -1, node id
          // product_id_in_database, // -1
          // product_scaling_amount, // 1.0
          // process_amount, // 1.0
          // score_through_supply_chain, // 9.981936043202016e-9
          // score_of_node, // 0.0
        } = graph;
        // TODO: Check if not graphId is defined?
        // NOTE: Unhover events invokes before sankey node click, so we mustn't to use it
        /* console.log('[SankeyPlotlyDemo:handleSankeyNodeClick]', {
         *   graph: { ...graph },
         *   graphIdx,
         *   graphId,
         *   pointNumber,
         *   update,
         *   indices,
         *   currentNodePoint,
         * });
         */
        /* // UNUSED (?): Start node editor dialog: save graph id, open dialog...
         * setCurrentGraphId(graphId);
         * handleOpenEditSankeyNodeDialog();
         */
        sankeyAppDataStore.setSelectedGraphId(graphId);
      }
    },
    [
      // prettier-ignore
      memo,
      sankeyAppDataStore,
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
