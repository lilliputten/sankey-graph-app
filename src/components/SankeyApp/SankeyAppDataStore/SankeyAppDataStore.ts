import { makeObservable, observable, action, when, runInAction } from 'mobx';
import bound from 'bind-decorator';

import {
  // defaultNodesColorMode,
  TColor,
  TEdgesData,
  TFlowsData,
  TGraphId,
  TGraphsData,
  TNodeId,
  TNodesColorMode,
  TNodesData,
} from 'src/core/types';

const defaultNodeNames: Record<TNodeId, string> = {
  [-1]: 'Root', // Default name for root node (TODO: Move default name to constants?)
};

export class SankeyAppDataStore {
  // NOTE: remember to clean/reset properties in `clearData`

  // State...
  @observable inited: boolean = false;
  @observable finished: boolean = false;
  @observable ready: boolean = false;
  @observable loading: boolean = false;
  @observable error?: Error;

  // Data...
  @observable edgesData?: TEdgesData;
  @observable flowsData?: TFlowsData;
  @observable graphsData?: TGraphsData;
  @observable nodesData?: TNodesData;

  // Selected (active) data...

  /** Currently selected graph id */
  @observable selectedGraphId?: TGraphId;

  // Overridable data...

  /** Changed or overriding (changeable) node names */
  @observable nodeNames: Record<TNodeId, string> = { ...defaultNodeNames };
  /** Changed node colors */
  @observable nodeColors: Record<TNodeId, TColor> = {};

  /** List of changed node ids (TNodeId[]) */
  @observable changedNodes: TNodeId[] = [];

  // Colors data...

  /** Color mode (mirrored `SankeyAppSessionStore` value) */
  @observable nodesColorMode?: TNodesColorMode; // = defaultNodesColorMode;

  // Lifecycle...

  constructor() {
    makeObservable(this);
    // Automatically clear the error for final& successfull statuses (started, stopped)
    when(() => this.finished, this.clearError);
  }

  async destroy() {
    this.clearData();
    // TODO: Cleanup before exit?
  }

  // External changes handlers...

  @bound onNodesColorModeChanged(_nodesColorMode: TNodesColorMode) {
    /* // DEBUG
     * const isChanged = nodesColorMode !== this.nodesColorMode;
     * console.log('[SankeyAppSessionStore:onNodesColorModeChanged]', {
     *   isChanged,
     *   nodesColorMode,
     * });
     */
    // Reset current custom colors...
    runInAction(() => {
      this.nodeColors = {};
      // TODO: Reset changedNodes data?
    });
    // TODO: Prepare aux data...
    // const nodeDepthsMap = createNodeDepthsMap();
  }

  // Status setters...

  @action setInited(inited: typeof SankeyAppDataStore.prototype.inited) {
    this.inited = inited;
  }

  @action setFinished(finished: typeof SankeyAppDataStore.prototype.finished) {
    this.finished = finished;
  }

  @action setReady(ready: typeof SankeyAppDataStore.prototype.ready) {
    this.ready = ready;
  }

  @action setLoading(loading: typeof SankeyAppDataStore.prototype.loading) {
    this.loading = loading;
  }

  @action setError(error: typeof SankeyAppDataStore.prototype.error) {
    this.error = error;
  }

  @bound clearError() {
    this.setError(undefined);
  }

  // Data setters...

  @action setEdgesData(edgesData: typeof SankeyAppDataStore.prototype.edgesData) {
    this.edgesData = edgesData;
  }
  @action setFlowsData(flowsData: typeof SankeyAppDataStore.prototype.flowsData) {
    this.flowsData = flowsData;
  }
  @action setGraphsData(graphsData: typeof SankeyAppDataStore.prototype.graphsData) {
    this.graphsData = graphsData;
  }
  @action setNodesData(nodesData: typeof SankeyAppDataStore.prototype.nodesData) {
    this.nodesData = nodesData;
  }

  // Current setters...

  @action setSelectedGraphId(selectedGraphId: typeof SankeyAppDataStore.prototype.selectedGraphId) {
    this.selectedGraphId = selectedGraphId;
  }

  // Generic utilities...

  @action clearData() {
    // NOTE: Don't just clear the data. It's a place to set them to default values.
    // Status...
    this.inited = false;
    this.finished = false;
    this.ready = false;
    this.loading = false;
    this.error = undefined;
    // Data...
    this.edgesData = undefined;
    this.flowsData = undefined;
    this.graphsData = undefined;
    this.nodesData = undefined;
    // Current...
    this.selectedGraphId = undefined;
    // Overrided data...
    this.changedNodes = [];
    this.nodeNames = { ...defaultNodeNames };
    this.nodeColors = {};
    this.changedNodes = [];
    this.nodesColorMode = undefined;
  }
}
