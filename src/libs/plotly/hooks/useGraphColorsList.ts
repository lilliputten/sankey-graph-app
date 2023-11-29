import React from 'react';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { getNodeColor, useProgressiveColorsData } from 'src/hooks/Sankey';
import { TColor } from 'src/core/types';

export function useGraphColorsList(): TColor[] {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const {
    // prettier-ignore
    graphsData, // TGraphsData;
    nodeColors, // Record<TNodeId, string>
  } = sankeyAppDataStore;
  const {
    // prettier-ignore
    nodesColorMode,
    baseNodesColor,
    secondNodesColor,
  } = sankeyAppSessionStore;
  const progressiveColorsData = useProgressiveColorsData();
  const colors = React.useMemo<TColor[]>(() => {
    if (!graphsData) {
      return [];
    }
    return graphsData.map((graph) => {
      const {
        id_in_graph: graphId, // -1, self index
        // id_in_database: nodeId, // -1, node id
        // product_id_in_database, // -1
        // product_scaling_amount, // 1.0
        // process_amount, // 1.0
        // score_through_supply_chain, // 9.981936043202016e-9
        // score_of_node, // 0.0
      } = graph;
      return getNodeColor({
        // nodeId,
        graphId,
        nodeColors,
        nodesColorMode,
        baseNodesColor,
        secondNodesColor,
        progressiveColorsData,
      });
    });
  }, [
    baseNodesColor,
    graphsData,
    nodeColors,
    nodesColorMode,
    secondNodesColor,
    progressiveColorsData,
  ]);
  return colors;
}
