import { TGraphHash, TGraphId } from 'src/core/types';

export function getGraphForId(graphsHash: TGraphHash, id: TGraphId) {
  const graph = graphsHash[id];
  if (!graph) {
    const error = new Error('Cannot find graph for id ' + id);
    // eslint-disable-next-line no-console
    console.error('[getGraphForId]', error);
    // eslint-disable-next-line no-debugger
    debugger;
    throw error;
  }
  return graph;
}
