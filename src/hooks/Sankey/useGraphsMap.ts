import React from 'react';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { TGraphMap } from 'src/core/types';

export function useGraphsMap(): TGraphMap {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { graphsData } = sankeyAppDataStore;
  // TODO: Detect duplicated ids?
  const gtaphsMap = React.useMemo<TGraphMap>(() => {
    if (!graphsData) {
      return {};
    }
    return graphsData.reduce<TGraphMap>((indices, graph, idx) => {
      const { id_in_graph: id } = graph;
      indices[id] = idx;
      return indices;
    }, {});
  }, [graphsData]);
  return gtaphsMap;
}
