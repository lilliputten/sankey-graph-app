import React from 'react';

import { TGraphId, TNodeId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { getColorForIndex } from 'src/helpers/colors';

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

export function useNodeName(nodeId?: TNodeId) {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { nodesData, nodeNames } = sankeyAppDataStore;
  return React.useMemo(() => {
    if (nodesData && nodeId !== undefined) {
      const node = nodesData.find((node) => node.id === nodeId);
      const name = nodeNames[nodeId] !== undefined ? nodeNames[nodeId] : node?.name;
      return name;
    }
  }, [nodesData, nodeNames, nodeId]);
}

export function useNodeColor(nodeId?: TNodeId) {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { nodesData, nodeColors } = sankeyAppDataStore;
  return React.useMemo(() => {
    if (nodesData && nodeId !== undefined) {
      const color =
        nodeColors[nodeId] !== undefined ? nodeColors[nodeId] : getColorForIndex(nodeId);
      return color;
    }
  }, [nodesData, nodeColors, nodeId]);
}
