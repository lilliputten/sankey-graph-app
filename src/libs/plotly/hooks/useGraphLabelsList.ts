import React from 'react';

import PlotlyLib from 'src/libs/plotly/core/PlotlyLib';

import { isDevBrowser } from 'src/config/build';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { getNodeForId } from 'src/helpers/Sankey/data';

import { useNodesHash } from 'src/hooks/Sankey/useNodesHash';

/** Show debug data in the node name */
const __showDebugInName = true && isDevBrowser;

export function useGraphLabelsList(): PlotlyLib.Datum[] | undefined {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    graphsData, // TGraphsData
    nodeNames, // Record<TNodeId, string>
    hiddenGraphNodes,
  } = sankeyAppDataStore;
  const nodesHash = useNodesHash();
  const labels = React.useMemo<PlotlyLib.Datum[] | undefined>(() => {
    if (!graphsData) {
      return undefined;
    }
    console.log('[useGraphLabelsList] memo start', {
      graphsData, // TGraphsData
      nodeNames, // Record<TNodeId, string>
      nodesHash,
      hiddenGraphNodes,
    });
    const labels = graphsData
      .map((graph, _idx) => {
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
        // Get updated name or original...
        const name = nodeNames[nodeId] !== undefined ? nodeNames[nodeId] : node.name;
        // Combine composite name...
        /* // Omit hidden nodes...
         * if (hiddenGraphNodes.includes(graphId)) {
         *   console.log('[useGraphLabelsList] memo omit hidden', {
         *     graphId,
         *     graph,
         *     name,
         *     node,
         *   });
         *   return undefined;
         * }
         */
        return [
          __showDebugInName &&
            '[' +
              [
                // prettier-ignore
                `graphId: ${graphId}`,
                `nodeId: ${nodeId}`,
                `idx: ${_idx}`,
              ].join(' ') +
              ']',
          name,
        ]
          .filter(Boolean)
          .join(' ');
      })
      .filter(Boolean) as PlotlyLib.Datum[];
    // console.log('[useGraphLabelsList] memo done', labels);
    return labels;
  }, [
    graphsData, // TGraphsData
    nodeNames, // Record<TNodeId, string>
    nodesHash,
    hiddenGraphNodes,
  ]);
  return labels;
}
