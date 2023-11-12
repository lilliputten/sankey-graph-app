import React from 'react';
import { Paper } from '@mui/material';
import classnames from 'classnames';

import { defaultMuiThemeMode } from 'src/config/app';
import { TMuiThemeMode } from 'src/core/types';
import { createCustomizedMuiTheme, ThemeProvider } from 'src/core/global/mui-theme';

import styles from './ThemeWrapper.module.scss';

export interface TThemeWrapperParams {
  themeMode?: TMuiThemeMode;
  fullSize?: boolean;
  className?: string;
}
export interface TThemeWrapperProps extends JSX.IntrinsicAttributes, TThemeWrapperParams {
  children: React.ReactNode;
}

export function ThemeWrapper(props: TThemeWrapperProps) {
  const { children, fullSize, className, themeMode = defaultMuiThemeMode } = props;
  const theme = React.useMemo(() => createCustomizedMuiTheme({ mode: themeMode }), [themeMode]);
  const paperClassName = classnames(
    className,
    styles.paperContainer,
    fullSize && styles.fullSize,
    'theme-mode-' + themeMode,
  );
  // @see https://mui.com/material-ui/react-paper/
  return (
    <>
      {/* Theme */}
      <ThemeProvider theme={theme}>
        {/* Basic page style
          See https://mui.com/material-ui/api/paper/
         */}
        <Paper className={paperClassName} square elevation={0}>
          {/* Core content */}
          {children}
        </Paper>
      </ThemeProvider>
    </>
  );
}

/*
export function withThemeWrapperFabric<P extends JSX.IntrinsicAttributes>(
  params: TThemeWrapperParams = {},
): (Component: React.ComponentType<P & TThemeWrapperProps>) => (props: P) => JSX.Element {
  const { className, fullSize, themeMode = appConfig.themeMode } = params;
  return function withThemeWrapper<P extends JSX.IntrinsicAttributes>(
    Component: React.ComponentType<P>,
  ) {
    return function WithThemeWrapper(props: P) {
      return (
        <ThemeWrapper className={className} fullSize={fullSize} themeMode={themeMode}>
          <Component {...props} />
        </ThemeWrapper>
      );
    };
  };
}
*/
