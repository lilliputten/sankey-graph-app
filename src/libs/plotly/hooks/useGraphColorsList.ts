import React from 'react';
import { SankeyNode } from 'plotly.js/lib/traces/sankey';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { getColorForIndex } from 'src/helpers/colors';

export function useGraphColorsList(): SankeyNode['color'] | undefined {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    graphsData, // TGraphsData;
    nodeColors, // Record<TNodeId, string>
  } = sankeyAppDataStore;
  const colors = React.useMemo<SankeyNode['color'] | undefined>(() => {
    if (!graphsData) {
      return undefined;
    }
    return graphsData.map((graph) => {
      const {
        // id_in_graph: id, // -1, self index
        id_in_database: nodeId, // -1, node id
        // product_id_in_database, // -1
        // product_scaling_amount, // 1.0
        // process_amount, // 1.0
        // score_through_supply_chain, // 9.981936043202016e-9
        // score_of_node, // 0.0
      } = graph;
      const color =
        nodeColors[nodeId] !== undefined ? nodeColors[nodeId] : getColorForIndex(nodeId);
      return color;
    });
  }, [
    graphsData, // TGraphsData;
    nodeColors, // Record<TNodeId, string>
  ]);
  return colors;
}
