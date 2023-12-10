import React from 'react';

import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

import { useGraphLabelsList } from './useGraphLabelsList';
import { useGraphColorsList } from './useGraphColorsList';
import { useLinkData } from './useLinkData';

export function useChartData() {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { verticalLayout } = sankeyAppSessionStore;
  const label = useGraphLabelsList();
  const color = useGraphColorsList();
  const link = useLinkData();
  const chartData = React.useMemo(() => {
    const sankeyData = {
      type: 'sankey',
      orientation: verticalLayout ? 'v' : 'h',
      /** @type {Partial<SankeyNode>} */
      node: {
        /** Chart bar default (vertical?) padding */
        pad: 10,
        /** Chart bar width */
        thickness: 20,
        /** Chart bar outline */
        line: {
          color: 'black',
          width: 0,
        },
        label,
        color,
      },
      link,
      // uirevision: 1, // TODO: To use to control updates?
    };
    const chartData = [sankeyData];
    return chartData;
  }, [color, label, link, verticalLayout]);
  return chartData;
}
