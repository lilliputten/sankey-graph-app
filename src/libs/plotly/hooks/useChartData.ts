import React from 'react';
import Plotly from 'plotly.js';

import { isDevBrowser } from 'src/config/build';
import { TPlotlyData } from 'src/libs/plotly/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

import { demoPlotlySankeyData } from 'src/libs/plotly/data/demoPlotlySankeyData';

import { useGraphLabelsList } from './useGraphLabelsList';
import { useGraphColorsList } from './useGraphColorsList';
import { useLinkData } from './useLinkData';

/** DEBUG: Don't wait for user action */
const __debugUseDemoData = false && isDevBrowser;

export function useChartData(): TPlotlyData {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { verticalLayout } = sankeyAppSessionStore;
  /* React.useEffect(() => {
   *   console.log('[useChartData:DEBUG]', verticalLayout);
   * }, [verticalLayout]);
   */
  const label = useGraphLabelsList();
  const color = useGraphColorsList();
  const link = useLinkData();
  const chartData = React.useMemo<TPlotlyData>(() => {
    if (__debugUseDemoData) {
      return demoPlotlySankeyData;
    }
    const sankeyData: Partial<Plotly.SankeyData> = {
      type: 'sankey',
      orientation: verticalLayout ? 'v' : 'h',
      /** @type {Partial<SankeyNode>} */
      node: {
        /** Chart bar default (vertical?) padding */
        pad: 10,
        /** Chart bar width */
        thickness: 30,
        /** Chart bar outline */
        line: {
          color: 'black',
          width: 0,
        },
        label,
        color,
      },
      link,
      // uirevision: 1,
    };
    const chartData: TPlotlyData = [sankeyData];
    return chartData;
  }, [color, label, link, verticalLayout]);
  return chartData;
}
