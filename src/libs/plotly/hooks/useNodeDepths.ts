import React from 'react';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { TGraphId } from 'src/core/types';

type TGraphChidren = Record<TGraphId, TGraphId[]>;
type TDepth = number;
type TGraphDepths = Record<TGraphId, TDepth>;

export function useNodeDepths() {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    edgesData,
    graphsData, // TGraphsData;
    // nodesData, // Record<TNodeId, string>
  } = sankeyAppDataStore;
  const children = React.useMemo<TGraphChidren>(() => {
    if (!edgesData) {
      return {};
    }
    const children: TGraphChidren = {};
    edgesData.forEach((edge) => {
      const {
        // prettier-ignore
        consumer_graph_id: fromId, // 0,
        producer_graph_id: toId, // 2,
      } = edge;
      if (!children[fromId]) {
        children[fromId] = [];
      }
      children[fromId].push(toId);
    });
    return children;
  }, [edgesData]);
  const graphDepths = React.useMemo<TGraphDepths>(() => {
    // TODO: Working here!
  }, [children]);
}
