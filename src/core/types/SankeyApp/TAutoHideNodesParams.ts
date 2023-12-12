/** Parameters to hide nodes (from `SankeyAppSessionStore`) */
export interface TAutoHideNodesParams {
  /** Auto hide nodes */
  autoHideNodes: boolean;
  /** Auto hide nodes threshold value (percents) */
  autoHideNodesThreshold: number;
  /** Auto hide nodes maxmum outputs to show */
  autoHideNodesMaxOutputs: number;
}
