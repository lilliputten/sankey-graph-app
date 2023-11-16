import { makeObservable, observable, action, computed, when } from 'mobx';
import bound from 'bind-decorator';

export type TMediaProviderSessionStatus =
  | undefined
  | 'started'
  | 'starting'
  | 'stoping'
  | 'stopped';

export type TSankeyAppSessionStoreStatus = undefined | 'dataLoaded' | 'finished';

export class SankeyAppSessionStore {
  // NOTE: remember to clean/reset properties in `clearData`

  @observable inited: boolean = false;
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
    // TODO: Cleanup before exit?
  }

  // Core getters...

  @computed get isDataLoaded() {
    return this.status === 'dataLoaded';
  }

  /** Is current status final and successful (started, stopped)? */
  @computed get isFinished() {
    return this.status === 'finished';
  }

  // Core setters...

  // @action setSettingDone(settingsDone: typeof SankeyAppSessionStore.prototype.settingsDone) {
  //   this.settingsDone = settingsDone;
  // }

  @action setInited(inited: typeof SankeyAppSessionStore.prototype.inited) {
    this.inited = inited;
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
    this.status = undefined;
    this.error = undefined;
    // this.settingsDone = false;
  }
}
