import { TEdgesData, TGraphId, TGraphsData } from 'src/core/types';
import { onlyUnique } from 'src/helpers';

export type TGraphChidren = Record<TGraphId, TGraphId[]>;
export type TGraphIdsList = TGraphId[];

export function getGraphChildren(edgesData: TEdgesData): TGraphChidren {
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
}

/** Get root node ids */
export function getGraphRootIdsByChildren(
  children: TGraphChidren,
  graphsData: TGraphsData,
): TGraphIdsList {
  const allChildren: TGraphIdsList = Object.values(children).flat().filter(onlyUnique);
  allChildren.sort();
  const allIds: TGraphIdsList = graphsData.map(({ id_in_graph }) => id_in_graph);
  const rootIds = allIds.filter((id) => !allChildren.includes(id));
  return rootIds;
}
