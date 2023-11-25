import { TEdgesData } from './TEdgesData';
import { TFlowsData } from './TFlowsData';
import { TGraphsData, TGraphHash, TGraphMap } from './TGraphsData';
import { TNodesData, TNodeHash, TNodeMap } from './TNodesData';

export interface TChartDataSet {
  edgesData: TEdgesData;
  flowsData: TFlowsData;
  graphsData: TGraphsData;
  nodesData: TNodesData;
}

export interface TFullChartDataSet extends TChartDataSet {
  graphsHash: TGraphHash;
  nodesHash: TNodeHash;
  graphsMap: TGraphMap;
  nodesMap: TNodeMap;
}
