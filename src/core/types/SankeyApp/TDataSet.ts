import { TEdgesData } from './TEdgesData';
import { TFlowsData } from './TFlowsData';
import { TGraphsData, TGraphHash } from './TGraphsData';
import { TNodesData, TNodeHash } from './TNodesData';

export interface TDataSet {
  edgesData: TEdgesData;
  flowsData: TFlowsData;
  graphsData: TGraphsData;
  nodesData: TNodesData;
}

export interface TFullDataSet extends TDataSet {
  graphsHash: TGraphHash;
  nodesHash: TNodeHash;
}
