import React from 'react';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { TColor, TGraphId } from 'src/core/types';
import { createColorsGradientSteps } from 'src/helpers/colors';

import { useProgressiveNodeDepths } from './useProgressiveNodeDepths';

export interface TProgressiveColorsData {
  progressiveNodeDepths: Record<TGraphId, number>;
  progressiveColorSteps: TColor[];
}

export function useProgressiveColorsData() {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const {
    // prettier-ignore
    graphsData, // TGraphsData;
  } = sankeyAppDataStore;
  const {
    // prettier-ignore
    nodesColorMode,
    baseNodesColor,
    secondNodesColor,
  } = sankeyAppSessionStore;
  const progressiveNodeDepths = useProgressiveNodeDepths();
  const progressiveColorsData = React.useMemo<TProgressiveColorsData | undefined>(() => {
    if (!graphsData) {
      return;
    }
    const isProgressiveMode = nodesColorMode === 'progressive';
    /** Maximum depth level for progressive colors mode */
    const maxProgressiveDepth: number | undefined =
      (isProgressiveMode &&
        progressiveNodeDepths &&
        Math.max.apply(Math, Object.values(progressiveNodeDepths))) ||
      undefined;
    /** Progressive steps colors list */
    const progressiveColorSteps: TColor[] | undefined =
      (!!maxProgressiveDepth &&
        createColorsGradientSteps(maxProgressiveDepth, baseNodesColor, secondNodesColor)) ||
      undefined;
    if (progressiveNodeDepths && progressiveColorSteps) {
      return {
        progressiveNodeDepths,
        progressiveColorSteps,
      };
    }
  }, [
    // prettier-ignore
    baseNodesColor,
    graphsData,
    nodesColorMode,
    secondNodesColor,
    progressiveNodeDepths,
  ]);
  return progressiveColorsData;
}
