import {
  makeObservable,
  observable,
  action,
  // computed,
  when,
} from 'mobx';
import bound from 'bind-decorator';

import { TEdgesData, TFlowsData, TGraphsData, TNodesData } from 'src/core/types';

const defaultEdgesData: TEdgesData = [{ x: 1 }];

export class SankeyAppDataStore {
  // NOTE: remember to clean/reset properties in `clearData`

  // State...
  @observable inited: boolean = false;
  @observable finished: boolean = false;
  @observable ready: boolean = false;
  @observable loading: boolean = false;
  @observable error?: Error;

  // Data...
  @observable edgesData?: TEdgesData = defaultEdgesData;
  @observable flowsData?: TFlowsData;
  @observable graphsData?: TGraphsData;
  @observable nodesData?: TNodesData;

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

  @action clearData() {
    // NOTE: Don't just clear the data. It's a place to set them to default values.
    // Status...
    this.inited = false;
    this.finished = false;
    this.ready = false;
    this.loading = false;
    this.error = undefined;
    // Data...
    this.edgesData = defaultEdgesData;
    this.flowsData = undefined;
    this.graphsData = undefined;
    this.nodesData = undefined;
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
}
