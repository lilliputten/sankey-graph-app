import { TChartComponent } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { SankeyAnychartDemo } from 'src/libs/anychart/components/SankeyAnychartDemo';
import { SankeyGoJSDemo } from 'src/libs/components/SankeyGoJSDemo';

/* TODO 2023.11.24, 02:07 -- Load libraries dynamically? (Needs to be ensured
 * that it works in the embedding browser. And to preserve the way to use old
 * approach with static loading.)
 */

/** Get default chart component. Should be used under mobx observer. */
export const useChartComponent = (): TChartComponent => {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { chartLibrary } = sankeyAppSessionStore;
  switch (chartLibrary) {
    case 'anychart':
      return SankeyAnychartDemo;
    case 'gojs':
    default:
      return SankeyGoJSDemo;
  }
};
