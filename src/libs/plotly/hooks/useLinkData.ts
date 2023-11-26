import React from 'react';
import { SankeyLink } from 'plotly.js/lib/traces/sankey';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { useGraphsMap } from 'src/hooks/Sankey/useGraphsMap';

export function useLinkData(): Partial<SankeyLink> | undefined {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    edgesData, // TEdgesData;
  } = sankeyAppDataStore;
  const graphsMap = useGraphsMap();
  const linkData = React.useMemo<Partial<SankeyLink> | undefined>(() => {
    if (!edgesData) {
      return undefined;
    }
    // @see https://plotly.com/javascript/sankey-diagram/
    // @see https://raw.githubusercontent.com/plotly/plotly.js/master/test/image/mocks/sankey_energy_dark.json
    const linkData /* : Partial<SankeyLink> */ = {
      source: [] as SankeyLink['source'], // [0, 1, 0, 2, 3, 3],
      target: [] as SankeyLink['target'], // [2, 3, 3, 4, 4, 5],
      value: [] as SankeyLink['value'], // [8, 4, 2, 8, 4, 2],
      /* // Link names (TODO?)
       * label: [] as SankeyLink['label'], // [8, 4, 2, 8, 4, 2],
       */
    };
    edgesData.forEach((edge) => {
      const {
        producer_graph_id: toGraphId, // 2,
        consumer_graph_id: fromGraphId, // 0,
        amount, // 0.0016624585259705782
      } = edge;
      const fromGraphPos = graphsMap[fromGraphId];
      const toGraphPos = graphsMap[toGraphId];
      linkData.source.push(fromGraphPos);
      linkData.target.push(toGraphPos);
      linkData.value.push(amount);
      /* // Set link name (TODO?)
       * linkData.label.push('Link ' + n);
       */
    });
    return linkData;
  }, [edgesData, graphsMap]);
  return linkData;
}
