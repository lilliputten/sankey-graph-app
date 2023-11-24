import { getNodeForId } from 'src/helpers/Sankey';
import { TFullChartDataSet, TGraphItem, TNodeItem } from 'src/core/types';
import { TGojsNodeDataArray } from 'src/core/types/gojs';
import { getColorForIndex } from 'src/helpers/colors';

const useNodeName = true;

export function constructNodeDataArrayFromGraphs(
  fullDataSet: TFullChartDataSet,
): TGojsNodeDataArray {
  const {
    // edgesData,
    // flowsData,
    graphsData,
    // nodesData,
    nodesHash,
    // graphsHash,
  } = fullDataSet;
  // Construct from edges data, as in anychart's `constructEdgesData`?
  const nodeDataArray: TGojsNodeDataArray = graphsData.map((graph: TGraphItem, idx) => {
    const {
      id_in_graph: id, // Self index
      id_in_database: nodeId,
    } = graph;
    const node: TNodeItem = getNodeForId(nodesHash, nodeId);
    const color = getColorForIndex(idx);
    // TODO: Get colors for object (id, name?) hash?
    let text = String(id);
    if (useNodeName) {
      text = `[${id}] ${node.name}`;
    }
    return {
      // prettier-ignore
      key: id,
      text,
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
