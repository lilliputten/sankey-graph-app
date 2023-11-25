import { TGraphId } from './TGraphsData';

export interface TEdgeItem {
  producer_graph_id: TGraphId; // 47
  consumer_graph_id: TGraphId; // 46
  amount: number; // 1.025339552857456e-5
}
export type TEdgesData = TEdgeItem[];
