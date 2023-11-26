import React from 'react';
import Plotly from 'plotly.js';

import { isDevBrowser } from 'src/config/build';

import { TPlotlyData } from 'src/libs/plotly/types';

import { demoPlotlySankeyData } from 'src/libs/plotly/data/demoPlotlySankeyData';

import { useGraphLabelsList } from './useGraphLabelsList';
import { useGraphColorsList } from './useGraphColorsList';
import { useLinkData } from './useLinkData';

/** DEBUG: Don't wait for user action */
const __debugUseDemoData = false && isDevBrowser;

export function useChartData(): TPlotlyData {
  const label = useGraphLabelsList();
  const color = useGraphColorsList();
  const link = useLinkData();
  const chartData = React.useMemo<TPlotlyData>(() => {
    if (__debugUseDemoData) {
      return demoPlotlySankeyData;
    }
    const sankeyData: Partial<Plotly.SankeyData> = {
      type: 'sankey',
      orientation: 'h',
      // valueformat: '.0f',
      // valuesuffix: 'TWh',
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
        label, // getGraphLabelsList(fullDataSet),
        color, // getGraphColorsList(fullDataSet),
      },
      link, // getLinkData(fullDataSet),
    };
    const chartData: TPlotlyData = [sankeyData];
    return chartData;
  }, [color, label, link]);
  return chartData;
}
