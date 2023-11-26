import React from 'react';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { TNodeHash } from 'src/core/types';

export function useNodesHash(): TNodeHash {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { nodesData } = sankeyAppDataStore;
  const nodesHash = React.useMemo<TNodeHash>(() => {
    if (!nodesData) {
      return {};
    }
    return nodesData.reduce<TNodeHash>((hash, node) => {
      const { id } = node;
      hash[id] = node;
      return hash;
    }, {});
  }, [nodesData]);
  return nodesHash;
}
