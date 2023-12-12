import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

// NOTE: Import and use stock pre-built react component or create it (below)
// with `createPlotlyComponent` from your own patched instance. Don't use the
// same name for stock and custom components to avoid caching issues.
// import ReactPlotty from 'react-plotly.js';
import createPlotlyComponent from 'src/libs/react-plotly.js/factory';
import { Figure } from 'src/libs/react-plotly.js';

import PlotlyLib from 'src/libs/plotly/core/PlotlyLib';

import * as toasts from 'src/ui/Basic/Toasts';
import { TPlottlyNodeElement } from 'src/libs/plotly/types';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { TChartComponentProps } from 'src/core/types';
import { useContainerSize } from 'src/ui/hooks';
import {
  TChartData,
  TTargetChartData,
  useChartConfig,
  useChartData,
  useChartLayout,
} from 'src/libs/plotly/hooks';

import styles from './SankeyPlotlyMain.module.scss';

/* DEBUG: Debug plotly library
 * @see node_modules/plotly.js/src/plot_api/plot_api.js
 * @see node_modules/plotly.js/src/traces/sankey/render.js
 * @see `plotObj.emit` in `node_modules/plotly.js/src/lib/events.js:70`
 * @see patches/plotly.js+2.27.1.patch
 */
window.__DEBUG_PLOTLY = undefined; // 'plot_api render'; // 'render';

// @see https://github.com/plotly/react-plotly.js#customizing-the-plotlyjs-bundle
const CustomReactPlotty = createPlotlyComponent(PlotlyLib);

// TODO: Split solid memo to different ones: for handlers, api handler, etc
interface TMemo {
  chartData?: TChartData;
  /** Last active (clicked or dragged) node */
  currentNodePoint?: PlotlyLib.PlotDatum;
  /* [>* Current plotly data (is it used?) <]
   * figure?: Figure;
   */
  /** Current poltly node -- host for plotly api */
  graphDiv?: HTMLElement;
  unhoverTimeout?: NodeJS.Timeout;
}

export const SankeyPlotlyMain: React.FC<TChartComponentProps> = observer((props) => {
  const { className } = props;

  /** Memo is used to store active (last clicked/dragged) node */
  const memo = React.useMemo<TMemo>(() => ({}), []);

  // const [currentNodePoint, setCurrentNodePoint] = React.useState<PlotDatum | undefined>();
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { hiddenGraphNodes } = sankeyAppDataStore;
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
  const currentSankeyData = currentChartData[0];
  const currentSankeyNode = currentSankeyData.node;

  // XXX: Temporarily use frozen data (updating only with internal relayouts)
  const [initialChartData, setChartData] = React.useState<TChartData | undefined>(currentChartData);

  // Effect: Update chart data
  React.useEffect(() => {
    console.log('[SankeyPlotlyMain:Effect: Update chart data]', {
      currentChartData,
    });
    /* // NOTE: Unused temporarily: Updating full chart data causes completely
     * // re-render of the chart and layout reset. See below other partial
     * // updaters.
     * setChartData(currentChartData);
     */
    memo.chartData = currentChartData;
  }, [memo, currentChartData]);

  // Effect: Update chart data if hidden nodes list changed
  React.useEffect(() => {
    const { chartData } = memo;
    console.log('[SankeyPlotlyMain:Effect: Update chart data if hidden nodes list changed]', {
      hiddenGraphNodes,
    });
    setChartData(chartData);
  }, [memo, hiddenGraphNodes]);

  const {
    // prettier-ignore
    orientation,
    // link: chartLinks, // TODO: To update links data if they'll be updated (now consider them as a constant).
  } = currentSankeyData;
  const {
    // prettier-ignore
    color: chartColors,
    label: chartLabels,
  } = currentSankeyNode;

  // Effect: Update orientation with plotly api
  React.useEffect(() => {
    if (memo.graphDiv) {
      // @ts-ignore
      PlotlyLib.restyle(memo.graphDiv, 'orientation', orientation);
    }
  }, [memo, orientation]);

  // Effect: Update colors with plotly api
  React.useEffect(() => {
    if (memo.graphDiv) {
      // NOTE: Attention to patches for `node_modules/plotly.js/src/plot_api/plot_api.js:_restyle`)
      // @ts-ignore
      PlotlyLib.restyle(memo.graphDiv, 'node.color', chartColors);
      /* // NOTE: This approach (with full data) doesn't work (it resets other node properties)
       * PlotlyLib.restyle(memo.graphDiv, { node: { color: chartColors } });
       */
    }
  }, [memo, chartColors]);

  // Effect: Update labels with plotly api
  React.useEffect(() => {
    if (memo.graphDiv) {
      //NOTE: Attention to patches for `node_modules/plotly.js/src/plot_api/plot_api.js:_restyle`)
      // @ts-ignore
      PlotlyLib.restyle(memo.graphDiv, 'node.label', chartLabels);
    }
  }, [memo, chartLabels]);

  const chartLayout = useChartLayout({ width, height });

  const chartConfig = useChartConfig();

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
    (ev: Readonly<PlotlyLib.PlotMouseEvent>) => {
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
      // console.log('[SankeyPlotlyMain:handleHover]', currentNodePoint);
    },
    [memo],
  );
  const handleUnhover = React.useCallback(
    (_ev: Readonly<PlotlyLib.PlotMouseEvent>) => {
      if (memo.unhoverTimeout) {
        clearTimeout(memo.unhoverTimeout);
      }
      memo.unhoverTimeout = setTimeout(() => {
        memo.currentNodePoint = undefined;
      }, 300);
      // console.log('[SankeyPlotlyMain:handleUnhover]');
    },
    [memo],
  );
  // NOTE: Actually, for 'sankey' data mode this handler triggered for restyles event
  const handleSankeyNodeClick = React.useCallback(
    ([_update, _traces]: readonly [PlotlyLib.PlotRestyleEventUpdate, number[]]) => {
      const { currentNodePoint } = memo;
      /* console.log('[SankeyPlotlyMain:handleSankeyNodeClick] start', {
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
          console.error('[SankeyPlotlyMain:handleSankeyNodeClick] error', {
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
        /* console.log('[SankeyPlotlyMain:handleSankeyNodeClick]', {
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

  const savePlotlyGraphDiv = React.useCallback(
    (_figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => {
      // memo.figure = figure;
      memo.graphDiv = graphDiv;
      // setGraphDiv(graphDiv);
    },
    [memo],
  );

  /** Example of update of node label attributes: positions, for example */
  const alignAllNodes = React.useCallback(() => {
    const forcePos = true;
    const textPad = 3;
    type TPosition = 'left' | 'right' | 'center';
    type TTextAnchor = 'end' | 'start' | 'middle';
    const position: TPosition = 'center' as TPosition;
    const anchorForPosition: Record<TPosition, TTextAnchor> = {
      left: 'end',
      right: 'start',
      center: 'middle',
    };
    const textAnchor: TTextAnchor = anchorForPosition[position];
    const { graphDiv } = memo;
    if (graphDiv) {
      const nodes = Array.from(
        graphDiv.getElementsByClassName('sankey-node'),
      ) as TPlottlyNodeElement[];
      console.log('[SankeyPlotlyMain:alignAllNodes]', {
        nodes,
        graphDiv,
        memo,
      });

      for (const node of nodes) {
        const d = node.__data__;
        // @see `cn.nodeLabel` in `src/libs/plotly.js/src/traces/sankey/constants.js`
        const nodeLabels = node.getElementsByClassName('node-label');
        const label = nodeLabels.item(0) as SVGElement;

        const { horizontal, nodeLineWidth, visibleWidth, left, node: dataNode } = d;
        const { originalLayer } = dataNode;

        /* console.log('[SankeyPlotlyMain:alignAllNodes] node item: start', {
         *   horizontal,
         *   nodeLineWidth,
         *   visibleWidth,
         *   left,
         *   dataNode,
         *   originalLayer,
         *   d,
         *   label,
         *   // 'd.horizontal': d.horizontal,
         *   // nodeLabels,
         * });
         */

        if (!horizontal) {
          // TODO: Update positions for vertical layout?
          continue;
        }

        // This is how Plotly's default text positioning is computed (coordinates
        // are relative to that of the cooresponding node).
        const padX = nodeLineWidth / 2 + textPad;
        const posX = padX + visibleWidth;
        let x = 0;

        // Ensure to reset any previous modifications
        label?.setAttribute('x', String(x));

        switch (position) {
          case 'left':
            if (left || (originalLayer === 0 && !forcePos)) {
              continue;
            }
            x = -posX - padX;
            break;
          case 'right':
            if (!left || !forcePos) {
              continue;
            }
            x = posX + padX;
            break;
          case 'center':
            if (!forcePos && (left || originalLayer === 0)) {
              continue;
            }
            x = (nodeLineWidth + visibleWidth) / 2 + (left ? padX : -posX);
            break;
        }

        label?.setAttribute('x', String(x));
        label?.setAttribute('text-anchor', textAnchor);
      }
    }
  }, [memo]);

  // TODO 2023.11.29, 23:57 -- Create more production-like wrapper from plotly demo.
  // TODO 2023.11.29, 23:53 -- Split hooks and handlers to dedicated modules, use compose to combine them into single working piece.
  // TODO 2023.11.26, 22:39 -- Fix overcasting labels (`node-label`) by node bars (`node-rect`)
  // TODO 2023.11.26, 17:39 -- Don't auto open properties panel if it had hidden manually?
  // TODO 2023.11.26, 17:27 -- Reset selected graph id on click outside the node
  // TODO 2023.11.26, 17:25 -- Prevent react to node dragging (to keep last active node data)?

  return (
    <Box
      ref={resizeRef} // Handle node resize...
      className={classNames(className, styles.root)}
    >
      {!!errorText && <Box className={styles.errorBox}>{errorText}</Box>}
      {!!initialChartData && (
        <CustomReactPlotty
          // prettier-ignore
          className={styles.chart}
          data={initialChartData as TTargetChartData}
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
          onInitialized={savePlotlyGraphDiv}
          onUpdate={savePlotlyGraphDiv}
          // onAfterPlot={alignAllNodes} // Re-calculate node positions
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
