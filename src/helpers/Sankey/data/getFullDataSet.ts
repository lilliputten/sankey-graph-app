import { TChartDataSet, TFullChartDataSet } from 'src/core/types';
import { getErrorText } from 'src/helpers';

import { constructGraphHashFromGraphsData } from './constructGraphHashFromGraphsData';
import { constructGraphMapFromGraphsData } from './constructGraphMapFromGraphsData';
import { constructNodeHashFromNodesData } from './constructNodeHashFromNodesData';
import { constructNodeMapFromNodesData } from './constructNodeMapFromNodesData';

export function getFullDataSet(dataSet: Partial<TChartDataSet>): TFullChartDataSet {
  const {
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData, // nodes-supply-chain.json
    nodesData,
  } = dataSet;
  try {
    if (!edgesData || !flowsData || !graphsData || !nodesData) {
      const errMsg = 'Some of required data is undefined';
      const error = new Error(errMsg);
      throw error;
    }
    const graphsHash = constructGraphHashFromGraphsData(graphsData);
    const nodesHash = constructNodeHashFromNodesData(nodesData);
    const graphsMap = constructGraphMapFromGraphsData(graphsData);
    const nodesMap = constructNodeMapFromNodesData(nodesData);
    const fullDataSet: TFullChartDataSet = {
      edgesData,
      flowsData,
      graphsData,
      nodesData,
      graphsHash,
      nodesHash,
      graphsMap,
      nodesMap,
    };
    return fullDataSet;
  } catch (error) {
    const errMsg = [
      // prettier-ignore
      'Cannot costruct full data set',
      getErrorText(error),
    ]
      .filter(Boolean)
      .join(': ');
    const resultError = new Error(errMsg);
    // eslint-disable-next-line no-console
    console.error('[SankeyGoJSDemo:getFullDataSet] error', {
      // error,
      resultError,
      edgesData,
      flowsData,
      graphsData,
      nodesData,
    });
    debugger; // eslint-disable-line no-debugger
    throw resultError;
  }
}
