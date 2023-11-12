import React from 'react';
import { Typography } from '@mui/material';
import classnames from 'classnames';

import { WithToastsWrapper } from 'src/ui/Basic';
// import { TMuiThemeMode } from 'src/core/types/MuiThemeMode';
// import {
//   useAppParams,
//   useGlobalCssClasses,
//   // useUserParams,
// } from 'src/helpers/hooks';

import styles from './CoreWrapper.module.scss';

export interface TCoreWrapperProps extends JSX.IntrinsicAttributes {
  className?: string;
  children: React.ReactNode;
  // mode?: TMuiThemeMode;
}

export function CoreWrapper(props: TCoreWrapperProps) {
  const { children, className } = props;
  return (
    <>
      {/* Theme root for app-through typograpy support */}
      <Typography className={classnames(className, styles.container)} component="div">
        {/* Toasts support */}
        <WithToastsWrapper>
          {/* Core content */}
          {children}
        </WithToastsWrapper>
      </Typography>
    </>
  );
}
