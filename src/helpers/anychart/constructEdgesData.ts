import { TFullChartDataSet } from 'src/core/types';
import { getGraphForId } from './getGraphForId';
import { getNodeForId } from './getNodeForId';
import { TAnyChartRecord } from 'src/core/types/anychart';

/** Create chart data from the data set */
export function constructEdgesData(fullDataSet: TFullChartDataSet) {
  const {
    edgesData, // TEdgesData;
    flowsData, // TFlowsData;
    graphsData, // TGraphsData;
    // nodesData, // TNodesData;
    graphsHash, // TGraphHash;
    nodesHash, // TNodeHash;
  } = fullDataSet;
  console.log('[constructEdgesData] start', {
    edgesData,
    flowsData,
    graphsData,
    // nodesData,
  });
  /** @type {TAnyChartData} */
  const chartData = edgesData.map(
    ({
      producer_graph_id: toId, // 2,
      consumer_graph_id: fromId, // 0,
      amount, // 0.0016624585259705782
    }) => {
      const fromGraph = getGraphForId(graphsHash, fromId);
      const toGraph = getGraphForId(graphsHash, toId);
      const fromNode = getNodeForId(nodesHash, fromGraph.id_in_database);
      const toNode = getNodeForId(nodesHash, toGraph.id_in_database);
      const fromName = fromNode.name;
      const toName = toNode.name;
      /* console.log('[constructEdgesData] item', {
       *   toName,
       *   fromName,
       *   toId,
       *   fromId,
       *   amount,
       *   fromGraph,
       *   toGraph,
       *   fromNode,
       *   toNode,
       * });
       */
      const chartDataItem: TAnyChartRecord = {
        from: fromName,
        to: toName,
        value: amount,
      };
      return chartDataItem;
    },
  );
  console.log('[constructEdgesData] finish', {
    chartData,
  });
  return chartData;
}
