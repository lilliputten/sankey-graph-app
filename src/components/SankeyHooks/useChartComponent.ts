import { TChartComponent } from 'src/core/types';
// import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

// Library components...
/* // Issue #15: Removed unused libraries
 * import { SankeyAnychartDemo } from 'src/libs/anychart/components/SankeyAnychartDemo';
 * import { SankeyGoJSDemo } from 'src/libs/gojs/components/SankeyGoJSDemo';
 */
import { SankeyPlotlyMain } from 'src/libs/plotly/components/SankeyPlotlyMain';

/* TODO 2023.11.24, 02:07 -- Load libraries dynamically? (Needs to be ensured
 * that it works in the embedding browser. And to preserve the way to use old
 * approach with static loading.)
 */

/** Get default chart component. Should be used under mobx observer. */
export const useChartComponent = (): TChartComponent => {
  return SankeyPlotlyMain;
  /* // Issue #15: Removed unused libraries
   * const sankeyAppSessionStore = useSankeyAppSessionStore();
   * const { chartLibrary } = sankeyAppSessionStore;
   * switch (chartLibrary) {
   *   case 'plotly':
   *     return SankeyPlotlyMain;
   *   case 'anychart':
   *     return SankeyAnychartDemo;
   *   case 'gojs':
   *     return SankeyGoJSDemo;
   *   default:
   *     const errMsg = 'Not found chart library component "' + chartLibrary + '"';
   *     const error = new Error(errMsg);
   *     // eslint-disable-next-line no-console
   *     console.error('[useChartComponent]', errMsg, {
   *       error,
   *     });
   *     // eslint-disable-next-line no-debugger
   *     debugger;
   *     throw error;
   * }
   */
};
