import { SankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { TEdgeItem, TFullChartDataSet } from 'src/core/types';
import { TGojsLinkDataArray } from 'src/libs/gojs/types';

const minLineWidth = 1;

export function constructLinkDataArrayFromEdges(
  fullDataSet: TFullChartDataSet,
  { goJsLineWidthFactor }: Pick<SankeyAppSessionStore, 'goJsLineWidthFactor'>,
): TGojsLinkDataArray {
  const {
    edgesData,
    // flowsData,
    // graphsData,
    // nodesData,
    // nodesHash,
    // graphsHash,
  } = fullDataSet;
  const linkDataArray: TGojsLinkDataArray = edgesData.map((edge: TEdgeItem) => {
    const {
      // prettier-ignore
      producer_graph_id: toId, // 2,
      consumer_graph_id: fromId, // 0,
      amount, // 0.0016624585259705782
    } = edge;
    return {
      // prettier-ignore
      from: fromId,
      to: toId,
      width: Math.max(minLineWidth, goJsLineWidthFactor * amount),
    };
  });
  /* // Data sample:
  const linkDataArray: TGojsLinkDataArray = [
    { from: 'Coal reserves', to: 'Coal', width: 31 },
  ];
  */
  return linkDataArray;
}
