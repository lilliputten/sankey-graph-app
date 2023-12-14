import { isDev } from './build';

export const defaultToastDelay = isDev ? 1500 : 1000;

/** App title. Don't forget to sync it in `public/index.html` */
export const appTitle = 'Sankey Graph Visualizer';
