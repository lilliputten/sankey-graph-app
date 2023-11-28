import React from 'react';

import { TGraphId, TNodeId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

export function useGraphNodeId(graphId?: TGraphId): TNodeId | undefined {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { graphsData, nodesData } = sankeyAppDataStore;
  return React.useMemo(() => {
    if (graphsData && nodesData && graphId !== undefined) {
      const graph = graphsData.find((graph) => graph.id_in_graph === graphId);
      if (graph) {
        const nodeId = graph.id_in_database;
        return nodeId;
      }
    }
  }, [graphsData, nodesData, graphId]);
}
