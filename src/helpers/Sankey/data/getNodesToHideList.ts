import {
  TAutoHideNodesParams,
  TEdgesData,
  TGraphId,
  TGraphMap,
  TGraphsData,
  TGraphItem,
} from 'src/core/types';

export interface TShouldGraphNodeToBeAutoHiddenParams {
  autoHideNodesParams: TAutoHideNodesParams;
  graphsMap: TGraphMap;
  graphChildren: TGraphId[];
  graphId: TGraphId;
  graphsData: TGraphsData;
  edgesData: TEdgesData;
}

type TChildrenValuesHash = Record<TGraphId, number>;
// type TChildrenValuesList = number[];

function getGraphValue(graph: TGraphItem): number {
  return graph.score_through_supply_chain || 0;
}

function getChildrenValuesHash(
  params: Pick<TShouldGraphNodeToBeAutoHiddenParams, 'graphChildren' | 'graphsData' | 'graphsMap'>,
): TChildrenValuesHash {
  const {
    // prettier-ignore
    graphChildren,
    graphsData,
    graphsMap,
  } = params;
  const hash: TChildrenValuesHash = {};
  for (let graphId of graphChildren) {
    const graphIdx = graphId !== undefined ? graphsMap[graphId] : undefined;
    const graph = graphIdx !== undefined && graphsData[graphIdx];
    if (graph) {
      const value = getGraphValue(graph);
      hash[graphId] = value;
    }
  }
  return hash;
}

/** Check if graph node should be hidden to meet auto hide conditions */
export function getNodesToHideList(
  params: TShouldGraphNodeToBeAutoHiddenParams,
): TGraphId[] | undefined {
  const {
    // prettier-ignore
    autoHideNodesParams,
    graphsMap,
    graphChildren,
    graphId: parentGraphId,
    graphsData,
    // edgesData,
  } = params;
  // Nothing to check!
  if (!graphChildren) {
    return undefined;
  }
  const {
    // prettier-ignore
    autoHideNodes,
    autoHideNodesThreshold,
    autoHideNodesMaxOutputs,
  } = autoHideNodesParams;
  if (!autoHideNodes || !graphsData) {
    return undefined;
  }
  // Find graph data...
  const graphIdx = parentGraphId !== undefined ? graphsMap[parentGraphId] : undefined;
  const graph = graphIdx !== undefined && graphsData[graphIdx];
  // No data!
  if (!graph) {
    // TODO: Throw an error?
    return undefined;
  }

  /* // DEBUG
   * const value = getGraphValue(graph);
   * console.log('[SankeyAppDataStore:getNodesToHideList]: start', parentGraphId, {
   *   parentGraphId,
   *   graphChildren,
   *   value,
   *   graphIdx,
   *   graph,
   *   autoHideNodesThreshold,
   *   autoHideNodesMaxOutputs,
   *   autoHideNodesParams,
   * });
   */

  const childrenValuesHash = getChildrenValuesHash({
    graphsMap,
    graphChildren,
    graphsData,
  });
  // Sort children by values in descending mode (larger values are first)...
  const sortedChildren = [...graphChildren];
  sortedChildren.sort((aId: TGraphId, bId: TGraphId) => {
    const aVal = childrenValuesHash[aId];
    const bVal = childrenValuesHash[bId];
    return aVal - bVal;
  });
  const totalValue = Object.values(childrenValuesHash).reduce((summ, val) => summ + val, 0);

  const tresholdValue = (autoHideNodesThreshold * totalValue) / 100;

  /* console.log('[SankeyAppDataStore:getNodesToHideList]: data ready', parentGraphId, {
   *   sortedChildren,
   *   graphChildren,
   *   childrenValuesHash,
   *   childrenValues: Object.values(childrenValuesHash),
   *   tresholdValue,
   *   totalValue,
   *   autoHideNodesThreshold,
   *   autoHideNodesMaxOutputs,
   * });
   */

  const filteredChildren = sortedChildren.filter((graphId) => {
    if (tresholdValue) {
      const value = childrenValuesHash[graphId];
      const toInclude = value >= tresholdValue;
      /* console.log('[SankeyAppDataStore:getNodesToHideList]: filtering children', parentGraphId, {
       *   toInclude,
       *   value,
       *   tresholdValue,
       *   childrenValuesHash,
       * });
       */
      if (!toInclude) {
        return false;
      }
    }
    return true;
  });

  // Limit resulting children...
  if (autoHideNodesMaxOutputs && filteredChildren.length > autoHideNodesMaxOutputs) {
    filteredChildren.length = autoHideNodesMaxOutputs;
  }

  // No filtered out nodes (sizes are the same)! Return empty list
  if (filteredChildren.length === graphChildren.length) {
    return [];
  }

  /* // No filtered children! Hide all the nodes
   * if (!filteredChildren.length) {
   *   return graphChildren;
   * }
   */

  // Find unfiltered nodes (they should be hidden)...
  const nodesToHide: TGraphId[] = graphChildren.filter(
    (graphId) => !filteredChildren.includes(graphId),
  );

  /* console.log('[SankeyAppDataStore:getNodesToHideList]: done', parentGraphId, {
   *   graphChildren,
   *   sortedChildren,
   *   filteredChildren,
   *   nodesToHide,
   * });
   */

  return nodesToHide;
}
