import { TNodesData, TNodeHash } from 'src/core/types';

export function constructNodeHashFromNodesData(nodesData: TNodesData): TNodeHash {
  // TODO: Detect duplicated ids?
  const nodesHash = nodesData.reduce<TNodeHash>((hash, node) => {
    const { id } = node;
    hash[id] = node;
    return hash;
  }, {});
  /* console.log('[constructNodeHashFromNodesData] finish', {
   *   nodesHash,
   *   nodesData,
   * });
   */
  return nodesHash;
}
