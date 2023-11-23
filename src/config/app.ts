import { TMuiThemeMode } from 'src/core/types';
import { isDev } from './build';

const useDarkTheme = false;
export const defaultMuiThemeMode: TMuiThemeMode = useDarkTheme ? 'dark' : 'light';

export const defaultToastDelay = isDev ? 1500 : 1000;

const useTestData = false;
const useMinimalTestData = false;
export const sampleDataUrlPrefix = useTestData
  ? useMinimalTestData
    ? '/sample-data-minimal/'
    : '/sample-data-test/'
  : '/sample-data/';

/** App title. Don't forget to sync it in `public/index.html` */
export const appTitle = 'Sankey Graph Visualizer';
