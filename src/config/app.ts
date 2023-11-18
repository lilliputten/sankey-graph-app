import { TMuiThemeMode } from 'src/core/types';
import { isDev } from './build';

const useDarkTheme = false;
export const defaultMuiThemeMode: TMuiThemeMode = useDarkTheme ? 'dark' : 'light';

export const defaultToastDelay = isDev ? 1500 : 1000;

export const sampleDataUrlPrefix = '/sample-data/';

/** App title. Don't forget to sync with `public/index.html` */
export const appTitle = 'Sankey Graph Visualizer';
