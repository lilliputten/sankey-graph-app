import { TNodesData, TNodeMap } from 'src/core/types';

export function constructNodeMapFromNodesData(nodesData: TNodesData): TNodeMap {
  // TODO: Detect duplicated ids?
  const nodesIndices = nodesData.reduce<TNodeMap>((indices, node, idx) => {
    const { id } = node;
    indices[id] = idx;
    return indices;
  }, {});
  /* console.log('[constructNodeMapFromNodesData] finish', {
   *   nodesIndices,
   *   nodesData,
   * });
   */
  return nodesIndices;
}
