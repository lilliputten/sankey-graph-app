import { TGraphId } from './TGraphsData';

export interface TEdgeItem {
  /** Source graph node id */
  consumer_graph_id: TGraphId; // 46
  /** Target graph node id */
  producer_graph_id: TGraphId; // 47
  amount: number; // 1.025339552857456e-5
}
export type TEdgesData = TEdgeItem[];
