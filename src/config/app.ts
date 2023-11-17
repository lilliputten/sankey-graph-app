import { TMuiThemeMode } from 'src/core/types';
import { isDev } from './build';

const useDarkTheme = false;
export const defaultMuiThemeMode: TMuiThemeMode = useDarkTheme ? 'dark' : 'light';

export const defaultToastDelay = isDev ? 1500 : 1000;
