import {
  makeObservable,
  observable,
  action,
  when,
  runInAction,
  computed,
  IReactionDisposer,
  reaction,
} from 'mobx';
import bound from 'bind-decorator';

import {
  TAutoHideNodesParams,
  // defaultNodesColorMode,
  TColor,
  TEdgesData,
  TFlowsData,
  TGraphId,
  // TGraphItem,
  // TGraphMap,
  TGraphsData,
  TNodeId,
  TNodesColorMode,
  TNodesData,
} from 'src/core/types';
import {
  getGraphChildren,
  getGraphRootIdsByChildren,
  getGraphsMap,
  getNodesToHideList,
  // TGraphChidren,
  // TGraphIdsList,
} from 'src/helpers/Sankey';
import { areTwoSortedArraysEqual } from 'src/helpers';

const defaultNodeNames: Record<TNodeId, string> = {
  // [-1]: 'Root', // Default name for root node (TODO: Move default name to constants?)
};

const sortByNumberAsc = (a: number, b: number) => a - b;

export class SankeyAppDataStore {
  // NOTE: remember to clean/reset properties in `clearData`

  // Session reaction disposers...
  staticDisposers?: IReactionDisposer[];

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

  /** TODO: (!) List of changed node ids (TNodeId[]) */
  @observable changedNodes: TNodeId[] = [];

  /** Automatically hidden nodes, by filters (TGraphId[]) */
  @observable autoHiddenGraphNodes: TGraphId[] = [];

  /** Nodes hidden by user in manual mode (TGraphId[]) */
  @observable userHiddenGraphNodes: TGraphId[] = [];

  /** Hidden nodes (TGraphId[]) */
  @observable hiddenGraphNodes: TGraphId[] = [];

  // Colors data...

  /** Color mode (mirrored `SankeyAppSessionStore` value) */
  @observable nodesColorMode?: TNodesColorMode; // = defaultNodesColorMode;

  // Lifecycle...

  constructor() {
    makeObservable(this);
    // Automatically clear the error for final& successfull statuses (started, stopped)
    when(() => this.finished, this.clearError);
    this.setStaticReactions();
  }

  async destroy() {
    this.clearData();
    // TODO: Cleanup before exit?
    this.resetStaticReactions();
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

  // Updaters...

  @action updateAutoHiddenGraphNodes(autoHideNodesParams: TAutoHideNodesParams) {
    const {
      // prettier-ignore
      autoHideNodes,
      autoHideNodesThreshold,
      autoHideNodesMaxOutputs,
    } = autoHideNodesParams;
    const {
      // prettier-ignore
      edgesData,
      flowsData,
      graphsData,
      nodesData,
    } = this;
    // Check if we have data to construct tree...
    const hasData = !!(
      edgesData &&
      edgesData.length &&
      graphsData &&
      graphsData.length &&
      flowsData &&
      nodesData
    );
    const notEmptyConditions =
      /* autoHideNodesThreshold < 100 && */ autoHideNodesThreshold > 0 ||
      autoHideNodesMaxOutputs > 0;
    // NOTE: Clear auto hidden nodes if this feature is disabled or no data has set or got empty conditions...
    if (!autoHideNodes || !hasData || !notEmptyConditions) {
      this.autoHiddenGraphNodes = [];
      return;
    }
    // DEBUG: Check the corectness of hidden nodes
    const __doDebug = false;
    if (__doDebug) {
      // const demoHideNodes: TGraphId[] = []; // No auto hidden nodes
      const demoHideNodes: TGraphId[] = [4]; // Hide graphId node 4 (from chain 0 -> 4 -> 10)
      // const demoHideNodes: TGraphId[] = [1, 2, 3, 4]; // Hide all nodes on the 2nd level (except one graphId 5)
      const autoHiddenGraphNodes: typeof SankeyAppDataStore.prototype.autoHiddenGraphNodes =
        autoHideNodes ? demoHideNodes : [];
      console.log('[SankeyAppDataStore:updateAutoHiddenGraphNodes]: debug', {
        autoHiddenGraphNodes,
        'this.autoHiddenGraphNodes': [...this.autoHiddenGraphNodes],
        demoHideNodes,
        edgesData,
        flowsData,
        graphsData,
        nodesData,
        autoHideNodes,
        autoHideNodesThreshold,
        autoHideNodesMaxOutputs,
      });
      // TODO: Combine auto and manually hidden graph node lists
      this.autoHiddenGraphNodes = autoHiddenGraphNodes;
    }
    // Prepare tree data...
    // Get graphs map...
    const graphsMap = getGraphsMap(graphsData);
    // Chidren nodes data ([parentNodeId]: [chidrenNodeIds...])...
    const children = getGraphChildren(edgesData);
    // Root ids to start process...
    const rootIds = children && getGraphRootIdsByChildren(children, graphsData);
    // The future list of hidden nodes...
    const autoHiddenGraphNodes: TGraphId[] = [];
    const checkedNodes: TGraphId[] = [];
    console.log('[SankeyAppDataStore:updateAutoHiddenGraphNodes]: start', {
      children,
      rootIds,
      // autoHiddenGraphNodes,
      // 'this.autoHiddenGraphNodes': [...this.autoHiddenGraphNodes],
      // demoHideNodes,
      edgesData,
      flowsData,
      graphsData,
      nodesData,
      autoHideNodes,
      autoHideNodesThreshold,
      autoHideNodesMaxOutputs,
    });
    // Go through nodes and construct visiblility states...
    const checkNode = (graphId: TGraphId) => {
      // Avoid cyclic loops...
      if (checkedNodes.includes(graphId)) {
        return;
      }
      checkedNodes.push(graphId);
      const graphChildren = children[graphId];
      const nodesToHide = getNodesToHideList({
        autoHideNodesParams,
        graphsMap,
        graphChildren,
        graphId,
        graphsData,
        edgesData,
      });
      if (nodesToHide && nodesToHide.length) {
        nodesToHide.forEach((graphId) => {
          if (!autoHiddenGraphNodes.includes(graphId)) {
            autoHiddenGraphNodes.push(graphId);
          }
        });
      }
      // Process children...
      if (Array.isArray(graphChildren) && graphChildren.length) {
        graphChildren.forEach(checkNode);
      }
    };
    // Start the process from root nodes...
    rootIds.forEach(checkNode);
    autoHiddenGraphNodes.sort(sortByNumberAsc);
    const hasDiffers = !areTwoSortedArraysEqual(this.autoHiddenGraphNodes, autoHiddenGraphNodes);
    console.log('[SankeyAppDataStore:updateAutoHiddenGraphNodes]: done', {
      hasDiffers,
      autoHiddenGraphNodes,
    });
    // Compare new and current arrays and update if they're differ
    if (hasDiffers) {
      this.autoHiddenGraphNodes = autoHiddenGraphNodes;
    }
  }

  @action.bound updateHiddenGraphNodes() {
    const { autoHiddenGraphNodes, userHiddenGraphNodes } = this;
    const hiddenGraphNodes: TGraphId[] = [];
    const combinedList = [...autoHiddenGraphNodes, ...userHiddenGraphNodes];
    combinedList.sort(sortByNumberAsc);
    combinedList.forEach((graphId) => {
      if (!hiddenGraphNodes.includes(graphId)) {
        hiddenGraphNodes.push(graphId);
      }
    });
    // Compare new and current arrays and update if they're differ
    const hasDiffers = !areTwoSortedArraysEqual(this.hiddenGraphNodes, combinedList);
    console.log('[SankeyAppDataStore:updateHiddenGraphNodes]', {
      hasDiffers,
      combinedList,
      'this.hiddenGraphNodes': { ...this.hiddenGraphNodes },
      autoHiddenGraphNodes,
      userHiddenGraphNodes,
    });
    if (hasDiffers) {
      this.hiddenGraphNodes = combinedList;
    }
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

  @computed get hasHiddenGraphNodes() {
    return !!(Array.isArray(this.hiddenGraphNodes) && this.hiddenGraphNodes.length);
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
    this.hiddenGraphNodes = [];
  }

  // Reactions...

  setStaticReactions() {
    this.staticDisposers = [
      // prettier-ignore
      reaction(() => this.autoHiddenGraphNodes, this.updateHiddenGraphNodes),
      reaction(() => this.userHiddenGraphNodes, this.updateHiddenGraphNodes),
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
