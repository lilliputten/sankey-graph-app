import React from 'react';

import { TNodeId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

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
