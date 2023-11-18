import { makeObservable, observable, action, computed, when } from 'mobx';
import bound from 'bind-decorator';

export type TSankeyAppSessionStoreStatus = undefined | 'dataLoaded' | 'finished';

export class SankeyAppSessionStore {
  // NOTE: remember to clean/reset properties in `clearData`

  @observable inited: boolean = false;
  @observable finished: boolean = false;
  @observable ready: boolean = false;
  @observable loading: boolean = false;
  @observable status: TSankeyAppSessionStoreStatus;
  @observable error?: Error = undefined;
  // @observable settingsDone: boolean = false; // ???

  // Lifecycle...

  constructor() {
    makeObservable(this);
    // Automatically clear the error for final& successfull statuses (started, stopped)
    when(() => this.isFinished, this.clearError);
  }

  async destroy() {
    this.clearData();
    // TODO: Cleanup before exit?
  }

  // Core getters...

  /** Is current status final and successful (started, stopped)? */
  @computed get isFinished() {
    return this.finished;
  }

  // Core setters...

  // @action setSettingDone(settingsDone: typeof SankeyAppSessionStore.prototype.settingsDone) {
  //   this.settingsDone = settingsDone;
  // }

  @action setInited(inited: typeof SankeyAppSessionStore.prototype.inited) {
    this.inited = inited;
  }

  @action setFinished(finished: typeof SankeyAppSessionStore.prototype.finished) {
    this.finished = finished;
  }

  @action setReady(ready: typeof SankeyAppSessionStore.prototype.ready) {
    this.ready = ready;
  }

  @action setLoading(loading: typeof SankeyAppSessionStore.prototype.loading) {
    this.loading = loading;
  }

  @action setError(error: typeof SankeyAppSessionStore.prototype.error) {
    this.error = error;
  }

  @bound clearError() {
    this.setError(undefined);
  }

  @action setStatus(status: typeof SankeyAppSessionStore.prototype.status) {
    this.status = status;
  }

  @action clearData() {
    // this.inited = false;
    // this.ready = false;
    // this.loading = false;
    this.status = undefined;
    this.error = undefined;
    // this.settingsDone = false;
  }
}