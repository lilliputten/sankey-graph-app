import { TGraphsData, TGraphHash } from 'src/core/types';

export function constructGraphsHashGraphsData(graphsData: TGraphsData): TGraphHash {
  // if (!graphsData) {
  //   return {};
  // }
  // TODO: Detect duplicated ids?
  const graphsHash = graphsData.reduce<TGraphHash>((hash, graph) => {
    const { id_in_graph: id } = graph;
    hash[id] = graph;
    return hash;
  }, {});
  console.log('[constructGraphsHashGraphsData] finish', {
    graphsHash,
    graphsData,
  });
  return graphsHash;
}
