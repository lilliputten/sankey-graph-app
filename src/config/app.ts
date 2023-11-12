import { TMuiThemeMode } from 'src/core/types';
import { isDev } from './build';

export const defaultMuiThemeMode: TMuiThemeMode = 'light';

export const defaultToastDelay = isDev ? 1500 : 1000;
