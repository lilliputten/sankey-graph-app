import React from 'react';
import { SankeyLink } from 'plotly.js/lib/traces/sankey';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { useGraphsMap } from 'src/hooks/Sankey/useGraphsMap';
import { TGraphId } from 'src/core/types';
import { useGraphLabelsList } from './useGraphLabelsList';

export function useLinkData(): Partial<SankeyLink> | undefined {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    edgesData, // TEdgesData;
  } = sankeyAppDataStore;

  const graphsMap = useGraphsMap();

  const valuesList = React.useMemo(
    // TODO 2023.11.29, 03:47 -- Here is a problem -- probaly some negative values causes the lack of some nodes.
    () => edgesData && edgesData.map(({ amount }) => amount),
    [edgesData],
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

  const labelsList = useGraphLabelsList();

  // Effect: Debug graph ids and pos list
  React.useEffect(() => {
    if (
      edgesData &&
      labelsList &&
      valuesList &&
      sourceGraphPosList &&
      targetGraphPosList &&
      sourceGraphIdsList &&
      targetGraphIdsList
    ) {
      // Nodes tracing: @see useLinkData-trace
      const combo = [];
      for (let i = 0; i < edgesData.length; i++) {
        const fromId = sourceGraphIdsList[i];
        const toId = targetGraphIdsList[i];
        const fromPos = sourceGraphPosList[i];
        const toPos = targetGraphPosList[i];
        const toLabel = labelsList[toPos];
        const fromLabel = labelsList[fromPos];
        const toValue = valuesList[toPos];
        const fromValue = valuesList[fromPos];
        const comboItem = {
          fromId,
          toId,
          fromPos,
          toPos,
          fromLabel,
          toLabel,
          fromValue,
          toValue,
        };
        if (toId === 18 || fromId === 18) {
          // @ts-ignore
          comboItem._DEBUG = 18;
        }
        combo.push(comboItem);
      }
      console.log('[useLinkData:Effect: Debug graph ids and pos list]', {
        combo,
        sourceGraphPosList,
        targetGraphPosList,
        sourceGraphIdsList,
        targetGraphIdsList,
      });
    }
  }, [
    // prettier-ignore
    edgesData,
    labelsList,
    valuesList,
    sourceGraphPosList,
    targetGraphPosList,
    sourceGraphIdsList,
    targetGraphIdsList,
  ]);

  // Construct link data
  const linkData = React.useMemo<Partial<SankeyLink> | undefined>(() => {
    if (!edgesData) {
      return undefined;
    }
    /* console.log('[useLinkData:linkData] start', {
     *   edgesData: edgesData.map((it) => ({ ...it })),
     *   sourceGraphPosList,
     *   targetGraphPosList,
     *   valuesList,
     *   // graphsMap,
     * });
     */
    // @see https://plotly.com/javascript/sankey-diagram/
    // @see https://raw.githubusercontent.com/plotly/plotly.js/master/test/image/mocks/sankey_energy_dark.json
    const linkData: Partial<SankeyLink> = {
      source: sourceGraphPosList as SankeyLink['source'], // [0, 1, 0, 2, 3, 3],
      target: targetGraphPosList as SankeyLink['target'], // [2, 3, 3, 4, 4, 5],
      value: valuesList as SankeyLink['value'], // [8, 4, 2, 8, 4, 2],
      /* // Link names (TODO?)
       * label: [] as SankeyLink['label'], // [8, 4, 2, 8, 4, 2],
       */
    };
    // console.log('[useLinkData:linkData] done', linkData);
    return linkData;
  }, [
    // prettier-ignore
    edgesData,
    sourceGraphPosList,
    targetGraphPosList,
    valuesList,
  ]);

  // Effect: Debug graph ids and pos list
  React.useEffect(() => {
    console.log('[useLinkData:Effect: Debug link data]', linkData);
    debugger;
  }, [linkData]);

  /* // OLD_DATA
   * const linkData = React.useMemo<Partial<SankeyLink> | undefined>(() => {
   *   if (!edgesData) {
   *     return undefined;
   *   }
   *   console.log('[useLinkData] start', {
   *     edgesData: edgesData.map((it) => ({ ...it })),
   *     graphsMap,
   *   });
   *   // @see https://plotly.com/javascript/sankey-diagram/
   *   // @see https://raw.githubusercontent.com/plotly/plotly.js/master/test/image/mocks/sankey_energy_dark.json
   *   const linkData [> : Partial<SankeyLink> <] = {
   *     source: [] as SankeyLink['source'], // [0, 1, 0, 2, 3, 3],
   *     target: [] as SankeyLink['target'], // [2, 3, 3, 4, 4, 5],
   *     value: [] as SankeyLink['value'], // [8, 4, 2, 8, 4, 2],
   *     [> // Link names (TODO?)
   *      * label: [] as SankeyLink['label'], // [8, 4, 2, 8, 4, 2],
   *      <]
   *   };
   *   edgesData.forEach((edge) => {
   *     const {
   *       producer_graph_id: toGraphId, // 2,
   *       consumer_graph_id: fromGraphId, // 0,
   *       amount, // 0.0016624585259705782
   *     } = edge;
   *     const fromGraphPos = graphsMap[fromGraphId];
   *     const toGraphPos = graphsMap[toGraphId];
   *     linkData.source.push(fromGraphPos);
   *     linkData.target.push(toGraphPos);
   *     linkData.value.push(amount);
   *     [> // Set link name (TODO?)
   *      * linkData.label.push('Link ' + n);
   *      <]
   *   });
   *   console.log('[useLinkData] memo done', linkData);
   *   return linkData;
   * }, [edgesData, graphsMap]);
   */
  return linkData;
}
