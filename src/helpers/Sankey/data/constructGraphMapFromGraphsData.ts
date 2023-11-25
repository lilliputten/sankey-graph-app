import { TGraphsData, TGraphMap } from 'src/core/types';

export function constructGraphMapFromGraphsData(graphsData: TGraphsData): TGraphMap {
  // TODO: Detect duplicated ids?
  const graphsIndices = graphsData.reduce<TGraphMap>((indices, graph, idx) => {
    const { id_in_graph: id } = graph;
    indices[id] = idx;
    return indices;
  }, {});
  /* console.log('[constructGraphMapFromGraphsData] finish', {
   *   graphsIndices,
   *   graphsData,
   * });
   */
  return graphsIndices;
}
