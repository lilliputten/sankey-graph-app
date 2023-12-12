import React from 'react';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { TGraphId } from 'src/core/types';
import {
  getGraphChildren,
  getGraphRootIdsByChildren,
  TGraphChidren,
  TGraphIdsList,
} from 'src/helpers/Sankey';

type TDepth = number;
type TGraphDepths = Record<TGraphId, TDepth>;

/** Get node depths for (only) progressive color mode */
export function useProgressiveNodeDepths() {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    nodesColorMode,
  } = sankeyAppSessionStore;
  const {
    // prettier-ignore
    edgesData,
    graphsData,
  } = sankeyAppDataStore;
  const isProgressiveMode = nodesColorMode === 'progressive';
  /** All children lists per graph nodes */
  const children = React.useMemo<TGraphChidren | undefined>(() => {
    if (!isProgressiveMode || !edgesData) {
      return undefined;
    }
    return getGraphChildren(edgesData);
  }, [isProgressiveMode, edgesData]);
  /** Root node ids */
  const rootIds = React.useMemo<TGraphIdsList | undefined>(() => {
    if (!children || !graphsData) {
      return undefined;
    }
    return getGraphRootIdsByChildren(children, graphsData);
  }, [children, graphsData]);
  /** Graph node depths */
  const graphDepths = React.useMemo(() => {
    // TODO: Working here!
    if (!children || !rootIds) {
      return;
    }
    /* console.group('[useProgressiveNodeDepths:graphDepths] start', {
     *   children,
     *   rootIds,
     * });
     */
    /** Collect graph node depth levels */
    const graphDepths: TGraphDepths = {};
    const scanChildren = (levelId: TGraphId, levelDepth: number = 0) => {
      graphDepths[levelId] = levelDepth;
      const levelChidren = children[levelId];
      if (!levelChidren) {
        // No children for this node: final node (leaf)
        return;
      }
      levelChidren.forEach((id) => {
        if (graphDepths[id] != null) {
          // TODO: To pick the node with the largest impact amount?
          const error = new Error('Duplicated node ' + id);
          // eslint-disable-next-line no-console
          console.warn('[useProgressiveNodeDepths:graphDepths:scanChildren] error', error.message, {
            error,
          });
          // eslint-disable-next-line no-debugger
          debugger;
          return;
        }
        scanChildren(id, levelDepth + 1);
      });
    };
    // Create node depths list (starting from root nodes)...
    rootIds.forEach((rootId) => {
      scanChildren(rootId, 0);
    });
    /* console.log('[useProgressiveNodeDepths:graphDepths] finish', {
     *   graphDepths,
     *   children,
     *   rootIds,
     * });
     * console.groupEnd();
     */
    return graphDepths;
  }, [children, rootIds]);
  return graphDepths;
}
