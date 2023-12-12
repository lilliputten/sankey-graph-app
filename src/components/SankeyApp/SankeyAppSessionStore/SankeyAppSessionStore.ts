import { makeObservable, observable, action, computed, IReactionDisposer, reaction } from 'mobx';
import bound from 'bind-decorator';

import { TMuiThemeMode, defaultMuiThemeMode, TColor } from 'src/core/types';
import {
  defaultNodesColorMode,
  TNodesColorMode,
  /* // Issue #15: Removed unused libraries
   * defaultChartLibrary,
   * TChartLibrary,
   */
} from 'src/core/types/SankeyApp';
import { SankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

export type TSankeyAppSessionStoreStatus = undefined | 'dataLoaded' | 'finished';

// TODO: Move default parameters to constants?
/* // Issue #15: UNUSED
 * const defaultGoJsLineWidthFactor = 200;
 */
const defaultBaseColor: TColor = '#0f0';
const defaultSecondColor: TColor = '#f00';

const defaultAutoHideNodes: boolean = true;
const defaultAutoHideNodesThreshold: number = 10;
const defaultAutoHideNodesMaxOutputs: number = 0;

// TODO 2023.11.26, 22:55 -- Save some data (themeMode, eg) to localStorage?

export class SankeyAppSessionStore {
  // NOTE: remember to clean/reset properties in `clearData` or in `clearSettings`

  // Session reaction disposers...
  staticDisposers?: IReactionDisposer[];

  @observable inited: boolean = false;
  @observable finished: boolean = false;
  @observable ready: boolean = false;
  @observable loading: boolean = false;
  @observable status: TSankeyAppSessionStoreStatus;
  @observable error?: Error = undefined;
  // @observable settingsDone: boolean = false; // ???

  /** Callback to go to load new data page */
  @observable loadNewDataCb?: () => void | undefined;

  @observable sankeyAppDataStore?: SankeyAppDataStore;

  // Settings...

  /** Application theme */
  @observable themeMode: TMuiThemeMode = defaultMuiThemeMode;

  /** Vertical layout */
  @observable verticalLayout: boolean = false;

  /* (Issue #15: UNUSED) [>* Coefficient for multiplying the width of connecting lines between nodes (GoJS only) <]
   * @observable goJsLineWidthFactor: number = defaultGoJsLineWidthFactor;
   */

  /** (Issue #15: UNUSED) Library used to display data
   * @observable chartLibrary: TChartLibrary = defaultChartLibrary;
   */

  /** Chart nodes color mode (could be overriden individually later) */
  @observable nodesColorMode: TNodesColorMode = defaultNodesColorMode;

  /** Base nodes color */
  @observable baseNodesColor: TColor = defaultBaseColor;
  /** Second nodes color */
  @observable secondNodesColor: TColor = defaultSecondColor;

  /** Auto hide nodes (see `THideNodesParams` and `updateHiddenGraphNodes` in `SankeyAppDataStore`) */
  autoHideNodes: boolean = defaultAutoHideNodes;

  /** Auto hide nodes threshold value (percents, include children with values more than this treshold) */
  autoHideNodesThreshold: number = defaultAutoHideNodesThreshold;

  /** Auto hide nodes maxmum outputs to show */
  autoHideNodesMaxOutputs: number = defaultAutoHideNodesMaxOutputs;

  // Lifecycle...

  constructor() {
    makeObservable(this);
    this.setStaticReactions();
  }

  async destroy() {
    this.clearData();
    this.resetStaticReactions();
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

  // Session/Data relations...

  // TODO: Call this on hide settings change.
  updateHiddenGraphNodes() {
    const {
      // prettier-ignore
      autoHideNodes,
      autoHideNodesThreshold,
      autoHideNodesMaxOutputs,
      sankeyAppDataStore,
    } = this;
    if (sankeyAppDataStore) {
      sankeyAppDataStore.updateAutoHiddenGraphNodes({
        autoHideNodes,
        autoHideNodesThreshold,
        autoHideNodesMaxOutputs,
      });
    }
  }

  // Reactions...

  @bound onNodesColorModeChanged(nodesColorMode: TNodesColorMode) {
    const { sankeyAppDataStore } = this;
    if (sankeyAppDataStore) {
      sankeyAppDataStore.onNodesColorModeChanged(nodesColorMode);
    }
  }

  @bound onSankeyAppDataStore(sankeyAppDataStore?: SankeyAppDataStore) {
    const { nodesColorMode } = this;
    if (sankeyAppDataStore) {
      sankeyAppDataStore.onNodesColorModeChanged(nodesColorMode);
    }
  }

  // Misc setters...

  @action setThemeMode(themeMode: typeof SankeyAppSessionStore.prototype.themeMode) {
    this.themeMode = themeMode;
  }

  // Other setters...

  @action setSankeyAppDataStore(sankeyAppDataStore?: SankeyAppDataStore) {
    this.sankeyAppDataStore = sankeyAppDataStore;
  }

  @action setLoadNewDataCb(loadNewDataCb: typeof SankeyAppSessionStore.prototype.loadNewDataCb) {
    this.loadNewDataCb = loadNewDataCb;
  }

  // Generic utilities...

  @action clearData() {
    // this.inited = false;
    // this.ready = false;
    // this.loading = false;
    this.status = undefined;
    this.error = undefined;
    // this.settingsDone = false;

    // Reset settings?
    this.clearSettings();
  }

  // Settings...

  @action clearSettings() {
    this.themeMode = defaultMuiThemeMode;
    this.verticalLayout = false;
    /* // Issue #15: UNUSED
     * this.goJsLineWidthFactor = defaultGoJsLineWidthFactor;
     */
    /* // Issue #15: Unused
     * this.chartLibrary = defaultChartLibrary;
     */
    this.nodesColorMode = defaultNodesColorMode;
    this.baseNodesColor = defaultBaseColor;
    this.secondNodesColor = defaultSecondColor;
    this.autoHideNodes = defaultAutoHideNodes;
    this.autoHideNodesThreshold = defaultAutoHideNodesThreshold;
    this.autoHideNodesMaxOutputs = defaultAutoHideNodesMaxOutputs;
  }

  // Reactions...

  setStaticReactions() {
    this.staticDisposers = [
      // prettier-ignore
      reaction(() => this.nodesColorMode, this.onNodesColorModeChanged),
      reaction(() => this.sankeyAppDataStore, this.onSankeyAppDataStore),
    ];
  }
  resetStaticReactions() {
    const { staticDisposers } = this;
    // Reset all disposers...
    if (Array.isArray(staticDisposers) && staticDisposers.length) {
      staticDisposers.forEach((disposer) => disposer());
    }
    this.staticDisposers = undefined;
  }
}
