import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

// @ts-ignore
import Plotly from 'plotly.js/lib'; // NOTE: Use dev (patched) version of plotly (required core nodejs polyfills for webpack 5+, see solution in `craco.config.js`)
// import Plotly from 'plotly.js'; // NOTE: Use production version of plotly

// NOTE: Import and use stock pre-built react component or create it (below)
// with `createPlotlyComponent` from your own patched instance. Don't use the
// same name for stock and custom components to avoid caching issues.
// import ReactPlotty from 'react-plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { Figure } from 'react-plotly.js';

import * as toasts from 'src/ui/Basic/Toasts';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { TChartComponentProps } from 'src/core/types';
import { useContainerSize } from 'src/ui/hooks';

import { useChartData, useGraphColorsList, useGraphLabelsList } from 'src/libs/plotly/hooks';
import { TPlotlyData } from 'src/libs/plotly/types';

import styles from './SankeyPlotlyDemo.module.scss';

/* DEBUG: Debug plotly library
 * @see node_modules/plotly.js/src/plot_api/plot_api.js
 * @see node_modules/plotly.js/src/traces/sankey/render.js
 * @see `plotObj.emit` in `node_modules/plotly.js/src/lib/events.js:70`
 * @see patches/plotly.js+2.27.1.patch
 */
window.__DEBUG_PLOTLY = false;

// @see https://github.com/plotly/react-plotly.js#customizing-the-plotlyjs-bundle
const CustomReactPlotty = createPlotlyComponent(Plotly);

interface TMemo {
  /** Last active (clicked or dragged) node */
  currentNodePoint?: Plotly.PlotDatum;
  /** Current plotly data (is it used?) */
  figure?: Figure;
  /** Current poltly node -- host for plotly api */
  graphDiv?: HTMLElement;
  unhoverTimeout?: NodeJS.Timeout;
}

export const SankeyPlotlyDemo: React.FC<TChartComponentProps> = observer((props) => {
  const { className } = props;

  /** Memo is used to store active (last clicked/dragged) node */
  const memo = React.useMemo<TMemo>(() => ({}), []);

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

  // Observer and update container size...
  const { ref: resizeRef, width, height } = useContainerSize();

  const currentChartData = useChartData();
  // XXX: Temporarily use frozen data (no updates)
  const [chartData, _setChartData] = React.useState<TPlotlyData>(currentChartData);
  // Effect: Update chart data...
  React.useEffect(() => {
    /* console.log('[SankeyPlotlyDemo:Effect: Update chart data]', {
     *   currentChartData,
     * });
     */
    // NOTE: Updating full chart data causes completely re-render of the chart and layout reset
    // setChartData(currentChartData);
  }, [currentChartData]);

  const chartColors = useGraphColorsList();
  const chartLabels = useGraphLabelsList();

  // Effect: Update colors with plotly api
  React.useEffect(() => {
    const { graphDiv } = memo;
    /* console.log('[SankeyPlotlyDemo:Effect: Update colors]', {
     *   chartColors,
     * });
     */
    if (graphDiv) {
      //NOTE: Attention to patches for `node_modules/plotly.js/src/plot_api/plot_api.js:_restyle`)
      Plotly.restyle(graphDiv, 'node.color', chartColors);
    }
  }, [memo, chartColors]);

  // Effect: Update labels with plotly api
  React.useEffect(() => {
    const { graphDiv } = memo;
    /* console.log('[SankeyPlotlyDemo:Effect: Update labels]', {
     *   chartLabels,
     * });
     */
    if (graphDiv) {
      //NOTE: Attention to patches for `node_modules/plotly.js/src/plot_api/plot_api.js:_restyle`)
      Plotly.restyle(graphDiv, 'node.label', chartLabels);
    }
  }, [memo, chartLabels]);

  const chartLayout = React.useMemo<Partial<Plotly.Layout>>(
    () => ({
      width,
      height,
      // TODO: Store theming colors in config/storage?
      paper_bgcolor: isDarkTheme ? 'black' : 'white',
      font: {
        color: isDarkTheme ? '#ccc' : '#333',
      },
      /*
       * // XXX: Trying to fix lost state error...
       * uirevision: 1,
       * datarevision: 1,
       * editrevision: 1,
       * selectionrevision: 1,
       */
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
      logging: 2,
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

  /* // UNUSED (?): Edit node dialog (now used side panel, see `SankeyPropertiesPanel`)...
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

  const handleHover = React.useCallback(
    (ev: Readonly<Plotly.PlotMouseEvent>) => {
      const {
        points, // PlotDatum[]
      } = ev;
      const currentNodePoint = { ...points[0] };
      // NOTE: Store single node for the next sankey node click event ('onRestyle')
      if (memo.unhoverTimeout) {
        clearTimeout(memo.unhoverTimeout);
        memo.unhoverTimeout = undefined;
      }
      memo.currentNodePoint = currentNodePoint;
      // console.log('[SankeyPlotlyDemo:handleHover]', currentNodePoint);
    },
    [memo],
  );
  const handleUnhover = React.useCallback(
    (_ev: Readonly<Plotly.PlotMouseEvent>) => {
      if (memo.unhoverTimeout) {
        clearTimeout(memo.unhoverTimeout);
      }
      memo.unhoverTimeout = setTimeout(() => {
        memo.currentNodePoint = undefined;
      }, 300);
      // console.log('[SankeyPlotlyDemo:handleUnhover]');
    },
    [memo],
  );
  // NOTE: Actually, for 'sankey' data mode this handler triggered for restyles event
  const handleSankeyNodeClick = React.useCallback(
    ([_update, _traces]: readonly [Plotly.PlotRestyleEventUpdate, number[]]) => {
      const { currentNodePoint } = memo;
      /* console.log('[SankeyPlotlyDemo:handleSankeyNodeClick] start', {
       *   // update,
       *   // traces,
       *   currentNodePoint,
       * });
       */
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
        // TODO: Check if not graphId has defined?
        /* console.log('[SankeyPlotlyDemo:handleSankeyNodeClick]', {
         *   graph: { ...graph },
         *   graphIdx,
         *   graphId,
         *   pointNumber,
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

  const setStateFigure = React.useCallback(
    (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => {
      /* console.log('[SankeyPlotlyDemo:setStateFigure]', {
       *   figure,
       *   graphDiv,
       * });
       */
      memo.figure = figure;
      memo.graphDiv = graphDiv;
    },
    [memo],
  );

  // TODO 2023.11.26, 22:39 -- Fix overcasting labels (`node-label`) by node bars (`node-rect`)
  // TODO 2023.11.26, 17:39 -- Don't auto open properties panel if it had hidden manually?
  // TODO 2023.11.26, 17:27 -- Reset selected graph id on click outside the node
  // TODO 2023.11.26, 17:25 -- Prevent react to node dragging?

  return (
    <Box
      ref={resizeRef} // Handle node resize...
      className={classNames(className, styles.root)}
    >
      {!!errorText && <Box className={styles.errorBox}>{errorText}</Box>}
      {!!chartData && (
        <CustomReactPlotty
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
          onUnhover={handleUnhover}
          // State...
          onInitialized={setStateFigure}
          onUpdate={setStateFigure}
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
