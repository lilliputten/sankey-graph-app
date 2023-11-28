import { TColor, TNodeId } from 'src/core/types';
import {
  SankeyAppDataStore,
  useSankeyAppDataStore,
} from 'src/components/SankeyApp/SankeyAppDataStore';
import {
  SankeyAppSessionStore,
  useSankeyAppSessionStore,
} from 'src/components/SankeyApp/SankeyAppSessionStore';

import { getColorForIndex } from 'src/helpers/colors';

export const defaultNodeColor = '#ffffff';

interface TGetNodeColorProps {
  nodeId?: TNodeId;
  nodeColors: SankeyAppDataStore['nodeColors'];
  nodesColorMode: SankeyAppSessionStore['nodesColorMode'];
  baseNodesColor: SankeyAppSessionStore['baseNodesColor'];
  secondNodesColor: SankeyAppSessionStore['secondNodesColor'];
}

export function getNodeColor(props: TGetNodeColorProps): TColor {
  const {
    // prettier-ignore
    nodeId,
    nodeColors,
    nodesColorMode,
    baseNodesColor,
    secondNodesColor,
  } = props;
  if (nodeId === undefined) {
    return defaultNodeColor;
  }
  if (nodeColors[nodeId]) {
    return nodeColors[nodeId];
  }
  switch (nodesColorMode) {
    case 'random': {
      return getColorForIndex(nodeId);
    }
    case 'progressive': {
      return secondNodesColor;
    }
    default:
    case 'single': {
      return baseNodesColor;
    }
  }
}

export function useNodeColor(nodeId?: TNodeId): TColor {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  if (nodeId === undefined) {
    return defaultNodeColor;
  }
  const {
    nodeColors, // Record<TNodeId, string>
  } = sankeyAppDataStore;
  const {
    // prettier-ignore
    nodesColorMode,
    baseNodesColor,
    secondNodesColor,
  } = sankeyAppSessionStore;
  return getNodeColor({
    nodeId,
    nodeColors,
    nodesColorMode,
    baseNodesColor,
    secondNodesColor,
  });
}
