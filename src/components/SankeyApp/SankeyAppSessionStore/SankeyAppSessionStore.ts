import { makeObservable, observable, action, computed, when } from 'mobx';
import bound from 'bind-decorator';
import { defaultChartLibrary, TChartLibrary } from 'src/core/types/SankeyApp';

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

  /** Callback to go to load new data page */
  @observable loadNewDataCb?: () => void | undefined;

  // Settings...

  /** Coefficient for multiplying the width of connecting lines between nodes (GoJS only) */
  @observable lineWidthFactor: number = 200;

  /** Library used to display data */
  @observable chartLibrary: TChartLibrary = defaultChartLibrary;

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

  @computed get rootState() {
    const {
      // prettier-ignore
      inited,
      loading,
      ready,
      finished,
    } = this;
    if (!inited || loading) {
      return 'waiting';
    } else if (finished) {
      return 'finished';
    } else if (ready) {
      return 'ready';
    } else {
      return 'welcome';
    }
  }

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

    // TODO: Reset settings?
  }

  // Other setters...

  @action setLoadNewDataCb(loadNewDataCb: typeof SankeyAppSessionStore.prototype.loadNewDataCb) {
    this.loadNewDataCb = loadNewDataCb;
  }
}
