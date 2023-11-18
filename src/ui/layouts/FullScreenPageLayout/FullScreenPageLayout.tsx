import * as React from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { ThemeWrapper } from 'src/ui/wrappers/ThemeWrapper';
import { TMuiThemeMode } from 'src/core/types';
import { AppHeader } from 'src/components/App/AppHeader';
import { AppFooter } from 'src/components/App/AppFooter';

import styles from './FullScreenPageLayout.module.scss';

export interface TFullScreenPageLayoutProps {
  className?: string;
  children?: React.ReactNode;
  themeMode?: TMuiThemeMode;
}

export function FullScreenPageLayout(props: TFullScreenPageLayoutProps): JSX.Element {
  // NOTE: Get props from nextjs (as `pageProps`)
  const { className, children, themeMode } = props;
  // prettier-ignore
  return (
    <ThemeWrapper className={classNames(className,styles.container)} themeMode={themeMode} fullSize>
      <AppHeader className={styles.header} />
      <Box className={styles.content}>
        {children}
      </Box>
      <AppFooter />
    </ThemeWrapper>
  );
}
