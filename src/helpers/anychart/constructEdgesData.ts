import { TFullChartDataSet } from 'src/core/types';
import { TAnyChartData, TAnyChartRecord } from 'src/core/types/anychart';
import { getGraphForId, getNodeForId } from 'src/helpers/Sankey/data';

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
  const chartData: TAnyChartData = edgesData.map((edgeNode) => {
    const {
      producer_graph_id: toId, // 2,
      consumer_graph_id: fromId, // 0,
      amount, // 0.0016624585259705782
    } = edgeNode;
    // TODO: Check data and throw errors?
    try {
      const fromGraph = getGraphForId(graphsHash, fromId);
      const toGraph = getGraphForId(graphsHash, toId);
      const fromNodeId = fromGraph.id_in_database;
      const toNodeId = toGraph.id_in_database;
      const fromNode = getNodeForId(nodesHash, fromNodeId);
      const toNode = getNodeForId(nodesHash, toNodeId);
      const fromName = fromNode.name;
      const toName = toNode.name;
      console.log('[constructEdgesData] item', {
        toName,
        fromName,
        toId,
        fromId,
        amount,
        fromGraph,
        toGraph,
        fromNodeId,
        toNodeId,
        fromNode,
        toNode,
        // 'fromNode.name': fromNode.name,
        // 'toNode.name': toNode.name,
        edgeNode,
      });
      // TODO: Use identifiers instead names! Got cyclic loops while using names as identifiers.
      const chartDataItem: TAnyChartRecord = {
        from: String(fromId),
        to: String(toId),
        // value: amount,
        weight: amount,
        toName,
        fromName,
      };
      return chartDataItem;
    } catch (error) {
      console.error('[constructEdgesData] item error', {
        edgeNode,
      });
      debugger;
      throw error;
    }
  });
  console.log('[constructEdgesData] finish', {
    chartData,
  });
  return chartData;
}