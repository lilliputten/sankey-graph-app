import { TColor, TGraphId } from 'src/core/types';
import {
  SankeyAppDataStore,
  useSankeyAppDataStore,
} from 'src/components/SankeyApp/SankeyAppDataStore';
import {
  SankeyAppSessionStore,
  useSankeyAppSessionStore,
} from 'src/components/SankeyApp/SankeyAppSessionStore';

import { getColorForIndex } from 'src/helpers/colors';

import { TProgressiveColorsData, useProgressiveColorsData } from './useProgressiveColorsData';

// TODO: Store default node color in config/storage */
const defaultNodeColor = '#ffffff';

interface TGetNodeColorProps {
  graphId?: TGraphId;
  nodeColors: SankeyAppDataStore['nodeColors'];
  nodesColorMode: SankeyAppSessionStore['nodesColorMode'];
  baseNodesColor: SankeyAppSessionStore['baseNodesColor'];
  secondNodesColor: SankeyAppSessionStore['secondNodesColor'];
  progressiveColorsData?: TProgressiveColorsData;
}

export function getNodeColor(props: TGetNodeColorProps): TColor {
  const {
    // prettier-ignore
    graphId,
    nodeColors,
    nodesColorMode,
    baseNodesColor,
    // secondNodesColor,
    progressiveColorsData,
  } = props;
  if (graphId === undefined) {
    // Is it error?
    return defaultNodeColor;
  } else if (nodeColors[graphId]) {
    // Return overrided color if defined
    return nodeColors[graphId];
  } else if (nodesColorMode === 'random') {
    // Get hashed color for node id
    return getColorForIndex(graphId);
  } else if (nodesColorMode === 'single') {
    // Single color
    return baseNodesColor;
  } else if (nodesColorMode === 'progressive' && progressiveColorsData) {
    const { progressiveColorSteps, progressiveNodeDepths } = progressiveColorsData;
    // Get progressive gradient color
    const depth = progressiveNodeDepths[graphId];
    const color = progressiveColorSteps[depth];
    /* console.log('[useGraphColor:getNodeColor]', {
     *   depth,
     *   color,
     *   graphId,
     *   progressiveNodeDepths,
     *   progressiveColorSteps,
     * });
     */
    return color || baseNodesColor;
  } else {
    // WTF? Is it an error?
    return defaultNodeColor;
  }
}

export function useGraphColor(graphId?: TGraphId): TColor {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const progressiveColorsData = useProgressiveColorsData();
  if (graphId === undefined) {
    return defaultNodeColor;
  }
  const {
    nodeColors, // Record<TGraphId, string>
  } = sankeyAppDataStore;
  const {
    // prettier-ignore
    nodesColorMode,
    baseNodesColor,
    secondNodesColor,
  } = sankeyAppSessionStore;
  return getNodeColor({
    graphId,
    nodeColors,
    nodesColorMode,
    baseNodesColor,
    secondNodesColor,
    progressiveColorsData,
  });
}
