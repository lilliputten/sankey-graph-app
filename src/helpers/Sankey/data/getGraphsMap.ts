import { TGraphMap, TGraphsData } from 'src/core/types';

export function getGraphsMap(graphsData: TGraphsData): TGraphMap {
  return graphsData.reduce<TGraphMap>((indices, graph, idx) => {
    const { id_in_graph: id } = graph;
    indices[id] = idx;
    return indices;
  }, {});
}
