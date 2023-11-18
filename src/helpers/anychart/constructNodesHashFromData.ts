import { TNodesData, TNodeHash } from 'src/core/types';

export function constructNodesHashFromData(nodesData: TNodesData): TNodeHash {
  // if (!nodesData) {
  //   return {};
  // }
  // TODO: Detect duplicated ids?
  const nodesHash = nodesData.reduce<TNodeHash>((hash, node) => {
    const { id } = node;
    hash[id] = node;
    return hash;
  }, {});
  console.log('[constructNodesHashFromData] finish', {
    nodesHash,
    nodesData,
  });
  return nodesHash;
}
