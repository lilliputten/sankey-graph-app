import React from 'react';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { TGraphMap } from 'src/core/types';
import { getGraphsMap } from 'src/helpers/Sankey/data/getGraphsMap';

/* // UNUSED: useVisibleGraphsMap
 * export function useVisibleGraphsMap(): TGraphMap {
 *   const sankeyAppDataStore = useSankeyAppDataStore();
 *   const { graphsData, hiddenGraphNodes } = sankeyAppDataStore;
 *   // TODO: Detect duplicated ids?
 *   const gtaphsMap = React.useMemo<TGraphMap>(() => {
 *     if (!graphsData) {
 *       return {};
 *     }
 *     return getGraphsMap(graphsData.filter(({ id_in_graph: id }) => !hiddenGraphNodes.includes(id)));
 *   }, [graphsData, hiddenGraphNodes]);
 *   return gtaphsMap;
 * }
 */

export function useGraphsMap(): TGraphMap {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { graphsData } = sankeyAppDataStore;
  // TODO: Detect duplicated ids?
  const gtaphsMap = React.useMemo<TGraphMap>(() => {
    if (!graphsData) {
      return {};
    }
    return getGraphsMap(graphsData);
  }, [graphsData]);
  return gtaphsMap;
}
