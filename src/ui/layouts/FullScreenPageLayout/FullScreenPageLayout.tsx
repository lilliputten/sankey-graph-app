import * as React from 'react';

// import { HtmlHeader, THtmlHeaderProps } from 'src/layout/structure/HtmlHeader';
import { ThemeWrapper } from 'src/ui/wrappers/ThemeWrapper';
import { TMuiThemeMode } from 'src/core/types';

export interface TFullScreenPageLayoutProps {
  // className?: string;
  children?: React.ReactNode;
  themeMode?: TMuiThemeMode;
}

export function FullScreenPageLayout(props: TFullScreenPageLayoutProps): JSX.Element {
  // NOTE: Get props from nextjs (as `pageProps`)
  const { children, themeMode } = props;
  // prettier-ignore
  return (
    <ThemeWrapper themeMode={themeMode} fullSize>
      {children}
    </ThemeWrapper>
  );
}
