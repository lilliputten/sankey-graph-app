export type TNodeId = number;

export interface TNodeItem {
  id: number; // 2856
  location?: string; // 'RoW'
  name: string; // 'tau-Fluvalinate'
  product?: string; // '1,1-difluoroethane, HFC-152a'
  type?: string; // 'ordinary transforming activity'
  unit?: string; // 'kilogram'
  context?: string[]; // ['soil', 'agricultural'];
}

export type TNodesData = TNodeItem[];

export type TNodeHash = Record<TNodeId, TNodeItem>;
