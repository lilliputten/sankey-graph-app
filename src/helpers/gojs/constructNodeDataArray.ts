import { getNodeForId } from 'src/helpers/Sankey';
import { TFullChartDataSet, TGraphItem, TNodeItem } from 'src/core/types';
import { TGojsNodeDataArray } from 'src/core/types/gojs';
import { getColorForIndex } from 'src/helpers/colors';

const useNodeName = true;

export function constructNodeDataArray(fullDataSet: TFullChartDataSet): TGojsNodeDataArray {
  const {
    // edgesData,
    // flowsData,
    graphsData,
    // nodesData,
    nodesHash,
    // graphsHash,
  } = fullDataSet;
  const nodeDataArray: TGojsNodeDataArray = graphsData.map((graph: TGraphItem, idx) => {
    const {
      // prettier-ignore
      id_in_graph: nodeId,
      // id_in_database: nodeId,
    } = graph;
    const node: TNodeItem = getNodeForId(nodesHash, nodeId);
    const { id, name } = node;
    // const color = getRandomColor();
    const color = getColorForIndex(idx);
    // TODO: Get colors for object (id, name?) hash?
    return {
      // prettier-ignore
      key: id,
      text: useNodeName && name ? name : String(id),
      color,
    };
  });
  /* // Data sample:
  const nodeDataArray: TGojsNodeDataArray = [
    { key: 'Coal reserves', text: 'Coal reserves', color: '#9d75c2' },
  ];
  */
  return nodeDataArray;
}
