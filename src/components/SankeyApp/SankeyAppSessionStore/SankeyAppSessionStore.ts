import {
  makeObservable,
  observable,
  action,
  computed,
  IReactionDisposer,
  reaction,
  runInAction,
} from 'mobx';
import bound from 'bind-decorator';

import { autoLoadUrls } from 'src/core/constants/Sankey';
import {
  TMuiThemeMode,
  validMuiThemeModes,
  defaultMuiThemeMode,
  TColor,
  TUpdatableParameter,
} from 'src/core/types';
import {
  defaultNodesColorMode,
  TNodesColorMode,
  validNodesColorModes,
} from 'src/core/types/SankeyApp';
import { SankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { getSavedOrQueryParameter } from 'src/helpers/generic/getSavedOrQueryParameter';

export type TSankeyAppSessionStoreStatus = undefined | 'dataLoaded' | 'finished';

const storagePrefix = 'SankeyAppSessionStore:';

// TODO: Move default parameters to constants?
const defaultShowLeftPanel: boolean = false;
const defaultBaseColor: TColor = '#0f0';
const defaultSecondColor: TColor = '#f00';
const defaultAutoHideNodes: boolean = false;
const defaultAutoHideNodesThreshold: number = 50;
const defaultAutoHideNodesMaxOutputs: number = 1;

/** Parameters what could be saved (via `saveParameter`) and restored from the
 * local storage (or from url query, via `restoreParameters`)
 * TODO: To derive it from `updatableParameters`?
 */
const restorableParameters = [
  // prettier-ignore
  'showLeftPanel',
  'themeMode',
  'verticalLayout',
  'nodesColorMode',
  'baseNodesColor',
  'secondNodesColor',
  'autoHideNodes',
  'autoHideNodesThreshold',
  'autoHideNodesMaxOutputs',
  // These parameters will be excluded from `saveableParameters` (only to initialize from url query)...
  'doAutoLoad',
  'autoLoadUrlEdges',
  'autoLoadUrlFlows',
  'autoLoadUrlGraphs',
  'autoLoadUrlNodes',
] as const;
export type TRestorableParameter = (typeof restorableParameters)[number];

/** Parameters to save to the local storage */
const saveableParameters = restorableParameters.filter(
  (id) =>
    // Exclude auto load urls...
    !id.startsWith('autoLoadUrl') && id !== 'doAutoLoad',
);

/** Updatable parameters descriptions */
const updatableParameters: TUpdatableParameter<TRestorableParameter>[] = [
  { id: 'showLeftPanel', type: 'boolean' },
  { id: 'themeMode', type: 'string', validValues: validMuiThemeModes },
  { id: 'verticalLayout', type: 'boolean' },
  { id: 'nodesColorMode', type: 'string', validValues: validNodesColorModes },
  { id: 'baseNodesColor', type: 'string' },
  { id: 'secondNodesColor', type: 'string' },
  { id: 'autoHideNodes', type: 'boolean' },
  { id: 'autoHideNodesThreshold', type: 'number' },
  { id: 'autoHideNodesMaxOutputs', type: 'number' },
  // Auto load...
  { id: 'doAutoLoad', type: 'boolean' },
  { id: 'autoLoadUrlEdges', type: 'string' },
  { id: 'autoLoadUrlFlows', type: 'string' },
  { id: 'autoLoadUrlGraphs', type: 'string' },
  { id: 'autoLoadUrlNodes', type: 'string' },
];

export class SankeyAppSessionStore {
  // NOTE: remember to clean/reset properties in `clearData` or in `clearSettings`

  // Session reaction disposers...
  staticDisposers?: IReactionDisposer[];

  @observable inited: boolean = false;
  @observable finished: boolean = false;
  @observable showHelp: boolean = false;
  @observable ready: boolean = false;
  @observable loading: boolean = false;
  @observable status: TSankeyAppSessionStoreStatus;
  @observable error?: Error = undefined;

  /** Callback to go to load new data page */
  @observable loadNewDataCb?: () => void | undefined;

  @observable sankeyAppDataStore?: SankeyAppDataStore;

  // Settings...

  /** Show left panel */
  @observable showLeftPanel: boolean = defaultShowLeftPanel;

  /** Application theme */
  @observable themeMode: TMuiThemeMode = defaultMuiThemeMode;

  /** Vertical layout */
  @observable verticalLayout: boolean = false;

  /** Chart nodes color mode (could be overriden individually later) */
  @observable nodesColorMode: TNodesColorMode = defaultNodesColorMode;

  /** Base nodes color */
  @observable baseNodesColor: TColor = defaultBaseColor;
  /** Second nodes color */
  @observable secondNodesColor: TColor = defaultSecondColor;

  /** Auto hide nodes (see `THideNodesParams` and `updateHiddenGraphNodes` in `SankeyAppDataStore`) */
  @observable autoHideNodes: boolean = defaultAutoHideNodes;

  /** Auto hide nodes threshold value (percents, include children with values more than this treshold) */
  @observable autoHideNodesThreshold: number = defaultAutoHideNodesThreshold;

  /** Show the number of descendants no more than this value */
  @observable autoHideNodesMaxOutputs: number = defaultAutoHideNodesMaxOutputs;

  // Default auto load values...

  @observable doAutoLoad: boolean = false;
  @observable autoLoadUrlEdges: string = autoLoadUrls.edges;
  @observable autoLoadUrlFlows: string = autoLoadUrls.flows;
  @observable autoLoadUrlGraphs: string = autoLoadUrls.graphs;
  @observable autoLoadUrlNodes: string = autoLoadUrls.nodes;

  // Lifecycle...

  constructor() {
    makeObservable(this);
    this.setStaticReactions();
    this.restoreParameters();
  }

  async destroy() {
    this.clearData();
    this.resetStaticReactions();
  }

  // Core getters...

  /** The root state: what component show to the user */
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
      return 'waiting';
      // return 'welcome'; // UNUSED!
    }
  }

  /** Is current status final and successful (started, stopped)? */
  @computed get isFinished() {
    return this.finished;
  }

  // Init settings...

  /** Initialize default parameters */
  restoreParameters() {
    updatableParameters.forEach((paramItem) => {
      const { id } = paramItem;
      const val = getSavedOrQueryParameter(paramItem, { storagePrefix, showWarining: true });
      if (val != null) {
        runInAction(() => {
          // @ts-ignore
          this[id] = val;
        });
        // eslint-disable-next-line no-console
        console.log('[SankeyAppSessionStore:restoreParameters] Restored parameter', id, '=', val);
      }
    });
  }

  /** Save parameter into the storage */
  saveParameter(id: TRestorableParameter) {
    const hasLocalStorage = typeof localStorage !== 'undefined';
    if (hasLocalStorage) {
      const storageId = [storagePrefix, id].filter(Boolean).join('');
      const val = this[id];
      /* console.log('[SankeyAppSessionStore:saveParameter]', {
       *   id,
       *   val,
       *   storageId,
       * });
       */
      localStorage.setItem(storageId, String(val));
    }
  }

  /** Initialize settings (reserved for future use */
  initSettings(): Promise<void> {
    // TODO?
    return Promise.resolve();
  }

  // Core setters...

  @action.bound setShowLeftPanel(
    showLeftPanel: typeof SankeyAppSessionStore.prototype.showLeftPanel,
  ) {
    this.showLeftPanel = showLeftPanel;
  }

  @action setInited(inited: typeof SankeyAppSessionStore.prototype.inited) {
    this.inited = inited;
  }

  @action setFinished(finished: typeof SankeyAppSessionStore.prototype.finished) {
    this.finished = finished;
  }

  @action.bound setShowHelp(showHelp: typeof SankeyAppSessionStore.prototype.showHelp) {
    this.showHelp = showHelp;
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

  @bound onAutoHideNodesChanged() {
    this.updateHiddenGraphNodes();
  }

  @bound onAutoHideNodesParamsChanged() {
    const { autoHideNodes } = this;
    if (autoHideNodes) {
      this.updateHiddenGraphNodes();
    }
  }

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

    // Reset settings?
    this.clearSettings();
  }

  // Settings...

  @action clearSettings() {
    // TODO: Use saved on initialization default values and list of resetable parameters...
    this.showLeftPanel = defaultShowLeftPanel;
    this.themeMode = defaultMuiThemeMode;
    this.verticalLayout = false;
    this.nodesColorMode = defaultNodesColorMode;
    this.baseNodesColor = defaultBaseColor;
    this.secondNodesColor = defaultSecondColor;
    this.autoHideNodes = defaultAutoHideNodes;
    this.autoHideNodesThreshold = defaultAutoHideNodesThreshold;
    this.autoHideNodesMaxOutputs = defaultAutoHideNodesMaxOutputs;
    this.doAutoLoad = false;
    this.autoLoadUrlEdges = autoLoadUrls.edges;
    this.autoLoadUrlFlows = autoLoadUrls.flows;
    this.autoLoadUrlGraphs = autoLoadUrls.graphs;
    this.autoLoadUrlNodes = autoLoadUrls.nodes;
  }

  // Reactions...

  setStaticReactions() {
    this.staticDisposers = [
      // prettier-ignore
      reaction(() => this.autoHideNodes, this.onAutoHideNodesChanged),
      reaction(() => this.autoHideNodesThreshold, this.onAutoHideNodesParamsChanged),
      reaction(() => this.autoHideNodesMaxOutputs, this.onAutoHideNodesParamsChanged),
      reaction(() => this.nodesColorMode, this.onNodesColorModeChanged),
      reaction(() => this.sankeyAppDataStore, this.onSankeyAppDataStore),
      // Add reactions to save all the saveable parameters to the local storage...
      ...saveableParameters.map((id) =>
        reaction(() => this[id], this.saveParameter.bind(this, id)),
      ),
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
