import React from 'react';
import { SankeyLink } from 'plotly.js/lib/traces/sankey';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { useGraphsMap } from 'src/hooks/Sankey/useGraphsMap';
import { TGraphId } from 'src/core/types';
// import { useGraphLabelsList } from './useGraphLabelsList'; // DEBUG: Using for verify data processing algorithms

export function useLinkData(): Partial<SankeyLink> | undefined {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    edgesData,
    graphsData,
  } = sankeyAppDataStore;

  const graphsMap = useGraphsMap();

  const valuesList = React.useMemo(
    () =>
      edgesData &&
      graphsData &&
      edgesData.map(({ producer_graph_id: toGraphId }) => {
        const graphIdx = graphsMap[toGraphId];
        const graph = graphsData[graphIdx];
        // FIXED 2023.11.29, 15:44 -- Here was a problem -- negative values caused the lack of some nodes. Now using the correct data.
        const { score_through_supply_chain: value } = graph;
        return value;
      }),
    [edgesData, graphsData, graphsMap],
  );

  const sourceGraphIdsList = React.useMemo<TGraphId[] | undefined>(
    () => edgesData && edgesData.map(({ consumer_graph_id }) => consumer_graph_id),
    [edgesData],
  );
  const sourceGraphPosList = React.useMemo(
    () => sourceGraphIdsList && sourceGraphIdsList.map((graphId: TGraphId) => graphsMap[graphId]),
    [sourceGraphIdsList, graphsMap],
  );

  const targetGraphIdsList = React.useMemo<TGraphId[] | undefined>(
    () => edgesData && edgesData.map(({ producer_graph_id }) => producer_graph_id),
    [edgesData],
  );
  const targetGraphPosList = React.useMemo(
    () => targetGraphIdsList && targetGraphIdsList.map((graphId: TGraphId) => graphsMap[graphId]),
    [targetGraphIdsList, graphsMap],
  );

  // Construct link data
  const linkData = React.useMemo<Partial<SankeyLink> | undefined>(() => {
    if (!edgesData) {
      return undefined;
    }
    // @see https://plotly.com/javascript/sankey-diagram/
    // @see https://raw.githubusercontent.com/plotly/plotly.js/master/test/image/mocks/sankey_energy_dark.json
    const linkData: Partial<SankeyLink> = {
      source: sourceGraphPosList as SankeyLink['source'],
      target: targetGraphPosList as SankeyLink['target'],
      value: valuesList as SankeyLink['value'],
      /* // Link names (TODO?)
       * label: [] as SankeyLink['label'],
       */
    };
    return linkData;
  }, [
    // prettier-ignore
    edgesData,
    sourceGraphPosList,
    targetGraphPosList,
    valuesList,
  ]);

  /* // DEBUG: Here is the point to verify data processing
   * const labelsList = useGraphLabelsList();
   * // DEBUG: Effect: Check intermediate data creation...
   * React.useEffect(() => {
   *   if (
   *     edgesData &&
   *     labelsList &&
   *     valuesList &&
   *     sourceGraphPosList &&
   *     targetGraphPosList &&
   *     sourceGraphIdsList &&
   *     targetGraphIdsList
   *   ) {
   *     // Nodes tracing: @see useLinkData-trace
   *     const combo = [];
   *     for (let i = 0; i < edgesData.length; i++) {
   *       const fromId = sourceGraphIdsList[i];
   *       const toId = targetGraphIdsList[i];
   *       const fromPos = sourceGraphPosList[i];
   *       const toPos = targetGraphPosList[i];
   *       const toLabel = labelsList[toPos];
   *       const fromLabel = labelsList[fromPos];
   *       const toValue = valuesList[toPos];
   *       const fromValue = valuesList[fromPos];
   *       const comboItem = {
   *         fromId,
   *         toId,
   *         fromPos,
   *         toPos,
   *         fromLabel,
   *         toLabel,
   *         fromValue,
   *         toValue,
   *       };
   *       if (toId === 18 || fromId === 18) {
   *         // @ts-ignore
   *         comboItem._DEBUG = 18;
   *       }
   *       combo.push(comboItem);
   *     }
   *     console.log('[useLinkData:Effect: Debug graph ids and pos list]', {
   *       combo,
   *       sourceGraphPosList,
   *       targetGraphPosList,
   *       sourceGraphIdsList,
   *       targetGraphIdsList,
   *     });
   *   }
   * }, [
   *   // prettier-ignore
   *   edgesData,
   *   labelsList,
   *   valuesList,
   *   sourceGraphPosList,
   *   targetGraphPosList,
   *   sourceGraphIdsList,
   *   targetGraphIdsList,
   * ]);
   * // DEBUG: Effect: Check created data...
   * React.useEffect(() => {
   *   console.log('[useLinkData:Effect: Debug link data]', linkData);
   *   // debugger; // NOTE: Debug here: It's the end of the data processing
   * }, [linkData]);
   */

  return linkData;
}
