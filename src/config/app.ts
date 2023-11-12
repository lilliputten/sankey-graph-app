import { defaultMuiThemeMode, TMuiThemeMode } from 'src/core/types';
import { isDev } from './build';

export const themeMode: TMuiThemeMode = defaultMuiThemeMode;

export const defaultToastDelay = isDev ? 1500 : 1000;
