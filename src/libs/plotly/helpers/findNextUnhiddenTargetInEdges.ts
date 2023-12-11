import { TEdgesData, TGraphId } from 'src/core/types';

export function findNextUnhiddenTargetInEdges(
  graphId: TGraphId,
  edgesData: TEdgesData,
  hiddenGraphNodes: TGraphId[],
): TGraphId | undefined {
  console.log('[findNextUnhiddenTargetInEdges] start', {
    graphId,
    edgesData,
    hiddenGraphNodes,
  });
  // ...
  let currentGraphId: TGraphId | undefined = graphId;
  // DEBUG
  let iterationCount = 0;
  while (currentGraphId !== undefined) {
    const edge = edgesData.find(
      // eslint-disable-next-line no-loop-func
      ({
        consumer_graph_id: sourceGraphId,
        // producer_graph_id: targetGraphId,
      }) => sourceGraphId === currentGraphId,
    );
    if (!edge) {
      // TODO: To monitor/catch these cases?
      debugger;
      return undefined;
    }
    const {
      // prettier-ignore
      consumer_graph_id: sourceGraphId,
      producer_graph_id: targetGraphId,
    } = edge;
    const hasFoundUnhiddenTarget = !hiddenGraphNodes.includes(targetGraphId);
    console.log(
      '[findNextUnhiddenTargetInEdges] iteration (id, count, result)',
      graphId,
      iterationCount,
      hasFoundUnhiddenTarget,
      {
        iterationCount,
        hasFoundUnhiddenTarget,
        sourceGraphId,
        targetGraphId,
        edge: { ...edge },
        currentGraphId,
        graphId,
      },
    );
    // debugger;
    if (hasFoundUnhiddenTarget) {
      // OK: The next unhidden target has alreadfy found!
      return targetGraphId;
    }
    // Go to the next iteration...
    currentGraphId = targetGraphId;
    iterationCount++;
  }
  console.log('[findNextUnhiddenTargetInEdges] done', {
    graphId,
    edgesData,
    hiddenGraphNodes,
  });
  // debugger;
  // return currentGraphId;
}
