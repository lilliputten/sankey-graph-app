export type TGraphId = number;

export interface TGraphItem {
  id_in_graph: number; // -1
  id_in_database: number; // -1, node id
  product_id_in_database: number; // -1
  product_scaling_amount: number; // 1.0
  process_amount: number; // 1.0
  score_through_supply_chain: number; // 9.981936043202016e-9
  score_of_node: number; // 0.0
}

export type TGraphsData = TGraphItem[];

export type TGraphHash = Record<TGraphId, TGraphItem>;
