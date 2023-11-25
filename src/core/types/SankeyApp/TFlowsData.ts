import { TGraphId } from './TGraphsData';
import { TNodeId } from './TNodesData';

export interface TFlowItem {
  id_in_database: TNodeId; // 1992
  process_id_in_graph: TGraphId; // 0
  process_id_in_database: TNodeId; // 18039
  amount: number; // 0.0029800001066178083
  score: number; // 2.950200074388016e-9
}
export type TFlowsData = TFlowItem[];
