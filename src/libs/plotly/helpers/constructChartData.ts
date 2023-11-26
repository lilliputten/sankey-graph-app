import Plotly from 'plotly.js';
import { SankeyNode, SankeyLink } from 'plotly.js/lib/traces/sankey';

import { isDevBrowser } from 'src/config/build';

import { TFullChartDataSet } from 'src/core/types';
import { getColorForIndex } from 'src/helpers/colors';
import { getNodeForId } from 'src/helpers/Sankey/data';

import { TPlotlyData } from 'src/libs/plotly/types';

/** DEBUG: Don't wait for user action */
const __debugUseDemoData = false && isDevBrowser;

/** Show debug data in the node name */
const __showDebugInName = false && isDevBrowser;

/** Demo data
 * @see https://plotly.com/javascript/sankey-diagram/
 */
export const demoPlotlySankeyData: TPlotlyData = [
  /** @type {Partial<Plotly.SankeyData>} */
  {
    type: 'sankey',
    orientation: 'h',
    /** @type {Partial<SankeyNode>} */
    node: {
      /** Chart bar default (vertical?) padding */
      pad: 10,
      /** Chart bar width */
      thickness: 30,
      /** Chart bar outline */
      line: {
        color: 'black',
        width: 0,
      },
      label: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      // color: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
    },
    /** @type {Partial<SankeyLink>} */
    link: {
      source: [0, 1, 0, 2, 3, 3],
      target: [2, 3, 3, 4, 4, 5],
      value: [8, 4, 2, 8, 4, 2],
    },
  },
];

function getGraphLabelsList(fullDataSet: TFullChartDataSet): Plotly.Datum[] {
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
  const labels: Plotly.Datum[] = graphsData.map((graph, idx) => {
    const {
      id_in_graph: graphId, // -1, self index
      id_in_database: nodeId, // -1, node id
      // product_id_in_database, // -1
      // product_scaling_amount, // 1.0
      // process_amount, // 1.0
      // score_through_supply_chain, // 9.981936043202016e-9
      // score_of_node, // 0.0
    } = graph;
    const node = getNodeForId(nodesHash, nodeId);
    return [
      __showDebugInName && `[graphIdx: ${idx}, graphId: ${graphId}, nodeId: ${nodeId}]`,
      node.name,
    ]
      .filter(Boolean)
      .join(' ');
  });
  return labels;
}

function getGraphColorsList(fullDataSet: TFullChartDataSet): SankeyNode['color'] {
  const {
    // edgesData, // TEdgesData;
    // flowsData, // TFlowsData;
    graphsData, // TGraphsData;
    // nodesData, // TNodesData;
    // graphsHash,
    // nodesHash,
    // graphsMap,
    // nodesMap,
  } = fullDataSet;
  const colors = graphsData.map((graph) => {
    const {
      id_in_graph: id, // -1, self index
      // id_in_database: nodeId, // -1, node id
      // product_id_in_database, // -1
      // product_scaling_amount, // 1.0
      // process_amount, // 1.0
      // score_through_supply_chain, // 9.981936043202016e-9
      // score_of_node, // 0.0
    } = graph;
    const color = getColorForIndex(id);
    return color;
  });
  return colors;
}

function getLinkData(fullDataSet: TFullChartDataSet): Partial<SankeyLink> {
  const {
    edgesData, // TEdgesData;
    // flowsData, // TFlowsData;
    // graphsData, // TGraphsData;
    // nodesData, // TNodesData;
    // graphsHash, // TGraphHash;
    // nodesHash, // TNodeHash;
    graphsMap,
    // nodesMap,
  } = fullDataSet;
  // @see https://plotly.com/javascript/sankey-diagram/
  // @see https://raw.githubusercontent.com/plotly/plotly.js/master/test/image/mocks/sankey_energy_dark.json
  const linkData /* : Partial<SankeyLink> */ = {
    source: [] as SankeyLink['source'], // [0, 1, 0, 2, 3, 3],
    target: [] as SankeyLink['target'], // [2, 3, 3, 4, 4, 5],
    value: [] as SankeyLink['value'], // [8, 4, 2, 8, 4, 2],
    /* [>* Link names (TODO?) <]
     * label: [] as SankeyLink['label'], // [8, 4, 2, 8, 4, 2],
     */
  };
  edgesData.forEach((edge) => {
    const {
      producer_graph_id: toGraphId, // 2,
      consumer_graph_id: fromGraphId, // 0,
      amount, // 0.0016624585259705782
    } = edge;
    // const fromGraph = getGraphForId(graphsHash, fromGraphId);
    // const toGraph = getGraphForId(graphsHash, toGraphId);
    const fromGraphPos = graphsMap[fromGraphId];
    const toGraphPos = graphsMap[toGraphId];
    linkData.source.push(fromGraphPos);
    linkData.target.push(toGraphPos);
    linkData.value.push(amount);
    /* // Set link name (TODO?)
     * linkData.label.push('Link ' + n);
     */
  });
  return linkData;
}

export function constructChartData(fullDataSet: TFullChartDataSet): TPlotlyData {
  if (__debugUseDemoData) {
    return demoPlotlySankeyData;
  }
  const sankeyData: Partial<Plotly.SankeyData> = {
    type: 'sankey',
    orientation: 'h',
    // valueformat: '.0f',
    // valuesuffix: 'TWh',
    /** @type {Partial<SankeyNode>} */
    node: {
      /** Chart bar default (vertical?) padding */
      pad: 10,
      /** Chart bar width */
      thickness: 30,
      /** Chart bar outline */
      line: {
        color: 'black',
        width: 0,
      },
      label: getGraphLabelsList(fullDataSet),
      color: getGraphColorsList(fullDataSet),
    },
    /** @type {Partial<SankeyLink>} */
    link: getLinkData(fullDataSet),
  };
  const chartData: TPlotlyData = [sankeyData];
  return chartData;
}
