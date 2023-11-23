import { SankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { TEdgeItem, TFullChartDataSet } from 'src/core/types';
import { TGojsLinkDataArray } from 'src/core/types/gojs';

const minLineWidth = 1;

export function constructLinkDataArray(
  fullDataSet: TFullChartDataSet,
  { lineWidthFactor }: Pick<SankeyAppSessionStore, 'lineWidthFactor'>,
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
      // consumer_graph_id: toId, // 2,
      // producer_graph_id: fromId, // 0,
      producer_graph_id: toId, // 2,
      consumer_graph_id: fromId, // 0,
      amount, // 0.0016624585259705782
    } = edge;
    return {
      // prettier-ignore
      from: fromId,
      to: toId,
      width: Math.max(minLineWidth, lineWidthFactor * amount),
    };
  });
  /* // Data sample:
  const linkDataArray: TGojsLinkDataArray = [
    { from: 'Coal reserves', to: 'Coal', width: 31 },
  ];
  */
  return linkDataArray;
}
