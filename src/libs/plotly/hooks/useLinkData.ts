import React from 'react';
import { SankeyLink } from 'plotly.js/lib/traces/sankey';

import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { useGraphsMap } from 'src/hooks/Sankey/useGraphsMap';
import { TGraphId } from 'src/core/types';
import { findNextUnhiddenTargetInEdges } from 'src/libs/plotly/helpers';
// import { useGraphLabelsList } from './useGraphLabelsList'; // DEBUG: Using for verify data processing algorithms

interface TGraphEdgesItem {
  sourceGraphId: TGraphId;
  targetGraphId?: TGraphId;
  value: number;
  // TODO: To solve the problem with undefines target node and it's value?
  sourceGraphIdx: number;
  targetGraphIdx: number;
}

export function useLinkData(): Partial<SankeyLink> | undefined {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const {
    // prettier-ignore
    edgesData,
    graphsData,
    hiddenGraphNodes,
  } = sankeyAppDataStore;

  const graphsMap = useGraphsMap();
  /* // UNUSED: Hash to get final indices
   * const visibleGraphsMap = useVisibleGraphsMap();
   */

  /* // OLD_CODE: valuesList
   * const valuesList = React.useMemo(
   *   () =>
   *     edgesData &&
   *     graphsData &&
   *     (edgesData
   *       .map(
   *         ({
   *           // prettier-ignore
   *           // consumer_graph_id: sourceGraphId,
   *           producer_graph_id: targetGraphId,
   *         }) => {
   *           const targetGraphIdx = graphsMap[targetGraphId];
   *           // const visibleGraphIdx = visibleGraphsMap[targetGraphId];
   *           const targetGraph = graphsData[targetGraphIdx];
   *           // FIXED 2023.11.29, 15:44 -- Here was a problem -- negative values caused the lack of some nodes. Now using the correct data.
   *           const { score_through_supply_chain: value } = targetGraph;
   *           [> // NEW_CODE: Trying to exclude values for hidden nodes in place
   *            * if (hiddenGraphNodes.includes(targetGraphId)) {
   *            *   console.log('[useLinkData:valuesList] omit hidden', {
   *            *     sourceGraphId,
   *            *     targetGraphId,
   *            *     value,
   *            *     targetGraph,
   *            *     targetGraphIdx,
   *            *   });
   *            *   return null;
   *            * }
   *            <]
   *           return value;
   *         },
   *       )
   *       .filter((value) => value != null) as number[]),
   *   [
   *     edgesData,
   *     graphsData,
   *     graphsMap,
   *     // visibleGraphsMap,
   *     // hiddenGraphNodes,
   *   ],
   * );
   */

  // NEW_CODE: Filtering and replacing/excluding hidden elements in place
  const graphEdgesList = React.useMemo<TGraphEdgesItem[] | undefined>(
    () =>
      edgesData &&
      graphsData &&
      (edgesData
        .map(
          (
            {
              // prettier-ignore
              consumer_graph_id: sourceGraphId,
              producer_graph_id: origTargetGraphId,
            },
            _idx, // DEBUG: Check indices
          ) => {
            if (hiddenGraphNodes.includes(sourceGraphId)) {
              console.log('[useLinkData:graphEdgesList] hidden source (omit)', {
                sourceGraphId,
                origTargetGraphId,
              });
              // Just remove edges with hidden sources.
              return null;
            }
            /** Resulting target node id. It could be replaced by the first unhidden next target graph node id if this node is hidden. */
            let targetGraphId: TGraphId | undefined = origTargetGraphId;
            if (hiddenGraphNodes.includes(origTargetGraphId)) {
              // TODO: Find next unhidden target in edges data using `findNextUnhiddenTargetInEdges`...
              targetGraphId = findNextUnhiddenTargetInEdges(
                origTargetGraphId,
                edgesData,
                hiddenGraphNodes,
              );
              // NOTE: What shall we to do if no unhidden target found (targetGraphId is undefined)?
              console.log('[useLinkData:graphEdgesList] hidden target (replace)', {
                _idx,
                sourceGraphId,
                origTargetGraphId,
                targetGraphId,
              });
            }
            const targetDataGraphIdx = targetGraphId !== undefined ? graphsMap[targetGraphId] : -1;
            const targetGraphIdx = targetDataGraphIdx;
            // const targetGraphIdx =
            //   targetGraphId !== undefined ? visibleGraphsMap[targetGraphId] : -1;
            const targetGraph =
              targetDataGraphIdx !== undefined ? graphsData[targetDataGraphIdx] : undefined;
            // FIXED 2023.11.29, 15:44 -- Here was a problem -- negative values caused the lack of some nodes. Now using the correct data.
            const value = targetGraph?.score_through_supply_chain || 0;
            const sourceGraphIdx = graphsMap[sourceGraphId];
            const edgeItem: TGraphEdgesItem = {
              sourceGraphId, // sourceGraphIdsList
              targetGraphId, // targetGraphIdsList
              value,
              sourceGraphIdx, // sourceGraphPosList
              targetGraphIdx, // targetGraphPosList
            };
            /* console.log('[useLinkData:graphEdgesList] done', {
             *   _idx,
             *   origTargetGraphId,
             *   edgeItem,
             *   sourceGraphId,
             *   targetGraphId,
             *   value,
             *   sourceGraphIdx,
             *   targetGraphIdx,
             * });
             */
            return edgeItem;
          },
        )
        .filter((id) => id != null) as TGraphEdgesItem[]),
    [edgesData, graphsData, graphsMap, hiddenGraphNodes],
  );
  /* To construct from graphEdgesList:

  /*
   * // OLD_CODE: Don't take into account hidden elements
   * const sourceGraphIdsList = React.useMemo<TGraphId[] | undefined>(
   *   () => edgesData && edgesData.map(({ consumer_graph_id: sourceGraphId }) => sourceGraphId),
   *   [edgesData],
   * );
   */
  /* // NEW_CODE: Trying to exclude hidden elements in place
   * const sourceGraphIdsList = React.useMemo<TGraphId[] | undefined>(
   *   () =>
   *     edgesData &&
   *     graphsData &&
   *     (edgesData
   *       .map(
   *         ({
   *           // prettier-ignore
   *           consumer_graph_id: sourceGraphId,
   *           producer_graph_id: targetGraphId,
   *         }) => {
   *           if (hiddenGraphNodes.includes(sourceGraphId)) {
   *             console.log('[useLinkData:sourceGraphIdsList] omit hidden', {
   *               sourceGraphId,
   *               targetGraphId,
   *             });
   *             // Just remove for sources
   *             return null;
   *           }
   *           [> // ???
   *            * if (hiddenGraphNodes.includes(targetGraphId)) {
   *            *   console.log('[useLinkData:sourceGraphIdsList] target linked to ommited hidden', {
   *            *     sourceGraphId,
   *            *     targetGraphId,
   *            *   });
   *            *   // TODO: Find next linked id...
   *            *   // const nextGraphIdx = graphsMap[targetGraphId];
   *            *   // const nextGraph = graphsData[nextGraphIdx];
   *            * } else if (sourceGraphId === 0 || sourceGraphId === 10) {
   *            *   console.log('[useLinkData:sourceGraphIdsList] involved source', {
   *            *     sourceGraphId,
   *            *     targetGraphId,
   *            *   });
   *            * }
   *            <]
   *           return sourceGraphId;
   *         },
   *       )
   *       .filter((id) => id != null) as TGraphId[]),
   *   [edgesData, graphsData, hiddenGraphNodes],
   * );
   */
  /* // OLD_CODE: sourceGraphPosList
   * const sourceGraphPosList = React.useMemo(
   *   () => sourceGraphIdsList && sourceGraphIdsList.map((graphId: TGraphId) => graphsMap[graphId]),
   *   [sourceGraphIdsList, graphsMap],
   * );
   */

  /* // OLD_CODE: Don't take into account hidden elements
   * const targetGraphIdsList = React.useMemo<TGraphId[] | undefined>(
   *   () => edgesData && edgesData.map(({ producer_graph_id: targetGraphId }) => targetGraphId),
   *   [edgesData],
   * );
   */
  /* // NEW_CODE: Trying to exclude hidden elements in place
   * const targetGraphIdsList = React.useMemo<TGraphId[] | undefined>(
   *   () =>
   *     edgesData &&
   *     graphsData &&
   *     (edgesData
   *       .map(
   *         ({
   *           // prettier-ignore
   *           consumer_graph_id: sourceGraphId,
   *           producer_graph_id: targetGraphId,
   *         }) => {
   *           if (hiddenGraphNodes.includes(targetGraphId)) {
   *             console.log('[useLinkData:targetGraphIdsList] omit hidden', {
   *               sourceGraphId,
   *               targetGraphId,
   *             });
   *             return null;
   *           }
   *           [> // ???
   *            * if (hiddenGraphNodes.includes(sourceGraphId)) {
   *            *   console.log('[useLinkData:targetGraphIdsList] target linked from ommited hidden', {
   *            *     sourceGraphId,
   *            *     targetGraphId,
   *            *   });
   *            * } else if (targetGraphId === 0 || targetGraphId === 10) {
   *            *   console.log('[useLinkData:targetGraphIdsList] involved target', {
   *            *     sourceGraphId,
   *            *     targetGraphId,
   *            *   });
   *            * }
   *            <]
   *           return targetGraphId;
   *         },
   *       )
   *       .filter((id) => id != null) as TGraphId[]),
   *   [edgesData, graphsData, hiddenGraphNodes],
   * );
   */
  /* // OLD_CODE: targetGraphPosList
   * const targetGraphPosList = React.useMemo(
   *   () => targetGraphIdsList && targetGraphIdsList.map((graphId: TGraphId) => graphsMap[graphId]),
   *   [targetGraphIdsList, graphsMap],
   * );
   */

  // Construct link data
  const linkData = React.useMemo<Partial<SankeyLink> | undefined>(() => {
    if (!graphEdgesList) {
      return undefined;
    }
    /*
     * value?: number;
     * // TODO: To solve the problem with undefines target node and it's value?
     * sourceGraphIdx: number;
     * targetGraphIdx?: number;
     */

    const sourceGraphPosList = graphEdgesList.map(({ sourceGraphIdx }) => sourceGraphIdx);
    const targetGraphPosList = graphEdgesList.map(({ targetGraphIdx }) => targetGraphIdx);
    const valuesList = graphEdgesList.map(({ value }) => value);

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
    console.log('[useLinkData:linkData] (Final data for plotly lib)', {
      sourceGraphPosList,
      targetGraphPosList,
      valuesList,
    });
    return linkData;
  }, [
    // prettier-ignore
    graphEdgesList,
  ]);

  /* // OLD_CODE: Construct link data
   * const linkData = React.useMemo<Partial<SankeyLink> | undefined>(() => {
   *   if (!edgesData) {
   *     return undefined;
   *   }
   *   // @see https://plotly.com/javascript/sankey-diagram/
   *   // @see https://raw.githubusercontent.com/plotly/plotly.js/master/test/image/mocks/sankey_energy_dark.json
   *   const linkData: Partial<SankeyLink> = {
   *     source: sourceGraphPosList as SankeyLink['source'],
   *     target: targetGraphPosList as SankeyLink['target'],
   *     value: valuesList as SankeyLink['value'],
   *     [> // Link names (TODO?)
   *      * label: [] as SankeyLink['label'],
   *      <]
   *   };
   *   console.log('[useLinkData:linkData]', {
   *     sourceGraphPosList,
   *     targetGraphPosList,
   *     valuesList,
   *   });
   *   return linkData;
   * }, [
   *   // prettier-ignore
   *   edgesData,
   *   sourceGraphPosList,
   *   targetGraphPosList,
   *   valuesList,
   * ]);
   */

  /* // DEBUG: Here is the point to verify data processing
   * const labelsList = useGraphLabelsList();
   * // DEBUG: Effect: Check intermediate data creation...
   * React.useEffect(() => {
   *   if (
   *     // edgesData &&
   *     labelsList &&
   *     graphEdgesList
   *     // valuesList &&
   *     // sourceGraphPosList &&
   *     // targetGraphPosList &&
   *     // sourceGraphIdsList &&
   *     // targetGraphIdsList
   *   ) {
   *     const sourceGraphIdsList = graphEdgesList.map(({ sourceGraphId }) => sourceGraphId);
   *     const targetGraphIdsList = graphEdgesList.map(({ targetGraphId }) => targetGraphId);
   *     const sourceGraphPosList = graphEdgesList.map(({ sourceGraphIdx }) => sourceGraphIdx);
   *     const targetGraphPosList = graphEdgesList.map(({ targetGraphIdx }) => targetGraphIdx);
   *     const valuesList = graphEdgesList.map(({ value }) => value);
   *     // Nodes tracing: @see useLinkData-trace
   *     const combo = [];
   *     for (let idx = 0; idx < graphEdgesList.length; idx++) {
   *       const fromId = sourceGraphIdsList[idx];
   *       const toId = targetGraphIdsList[idx];
   *       const fromPos = sourceGraphPosList[idx];
   *       const toPos = targetGraphPosList[idx];
   *       const toLabel = labelsList[toPos];
   *       const fromLabel = labelsList[fromPos];
   *       const toValue = valuesList[toPos];
   *       const fromValue = valuesList[fromPos];
   *       const comboItem = {
   *         // idx,
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
   *       graphEdgesList,
   *     });
   *   }
   * }, [
   *   // prettier-ignore
   *   graphEdgesList,
   *   // edgesData,
   *   labelsList,
   *   // valuesList,
   *   // sourceGraphPosList,
   *   // targetGraphPosList,
   *   // sourceGraphIdsList,
   *   // targetGraphIdsList,
   * ]);
   * // DEBUG: Effect: Check created data...
   * React.useEffect(() => {
   *   console.log('[useLinkData:Effect: Debug link data]', linkData);
   *   // debugger; // NOTE: Debug here: It's the end of the data processing
   * }, [linkData]);
   */

  /* // DEBUG (OLD_CODE): Here is the point to verify data processing
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
   *     for (let idx = 0; idx < edgesData.length; idx++) {
   *       const fromId = sourceGraphIdsList[idx];
   *       const toId = targetGraphIdsList[idx];
   *       const fromPos = sourceGraphPosList[idx];
   *       const toPos = targetGraphPosList[idx];
   *       const toLabel = labelsList[toPos];
   *       const fromLabel = labelsList[fromPos];
   *       const toValue = valuesList[toPos];
   *       const fromValue = valuesList[fromPos];
   *       const comboItem = {
   *         // idx,
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
   *       graphEdgesList,
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
   *   graphEdgesList,
   * ]);
   * // DEBUG: Effect: Check created data...
   * React.useEffect(() => {
   *   console.log('[useLinkData:Effect: Debug link data]', linkData);
   *   // debugger; // NOTE: Debug here: It's the end of the data processing
   * }, [linkData]);
   */

  return linkData;
}
