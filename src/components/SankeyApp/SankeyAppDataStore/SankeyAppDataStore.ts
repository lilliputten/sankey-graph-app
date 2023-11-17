import {
  makeObservable,
  observable,
  action,
  // computed,
  when,
} from 'mobx';
import bound from 'bind-decorator';

export class SankeyAppDataStore {
  // NOTE: remember to clean/reset properties in `clearData`

  @observable inited: boolean = false;
  @observable finished: boolean = false;
  @observable ready: boolean = false;
  @observable loading: boolean = false;
  @observable error?: Error = undefined;

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

  // Core setters...

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
    this.inited = false;
    this.finished = false;
    this.ready = false;
    this.loading = false;
    this.error = undefined;
  }
}
