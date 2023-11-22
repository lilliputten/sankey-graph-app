import { TChartDataSet, TFullChartDataSet } from 'src/core/types';
import { getErrorText } from 'src/helpers';

import { constructGraphsHashGraphsData } from './constructGraphsHashGraphsData';
import { constructNodesHashFromData } from './constructNodesHashFromData';

export function getFullDataSet(dataSet: Partial<TChartDataSet>) {
  const {
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData,
    nodesData,
  } = dataSet;
  try {
    if (!edgesData || !flowsData || !graphsData || !nodesData) {
      const errMsg = 'Some of required data is undefined';
      const error = new Error(errMsg);
      throw error;
    }
    const graphsHash = constructGraphsHashGraphsData(graphsData);
    const nodesHash = constructNodesHashFromData(nodesData);
    const fullDataSet: TFullChartDataSet = {
      edgesData,
      flowsData,
      graphsData,
      nodesData,
      graphsHash,
      nodesHash,
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
    // setErrorText(getErrorText(resultError));
  }
}
