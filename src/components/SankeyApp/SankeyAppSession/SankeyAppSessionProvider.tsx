import React from 'react';

import { SankeyAppSession } from './SankeyAppSession';
import {
  // casterSession,
  SankeyAppSessionContextProvider,
} from './SankeyAppSessionContext';

interface TSankeyAppSessionProviderProps {
  children?: React.ReactNode;
}
export function SankeyAppSessionProvider(props: TSankeyAppSessionProviderProps): JSX.Element {
  const { children } = props;
  const casterSession = React.useMemo(() => {
    return new SankeyAppSession();
  }, []);
  React.useEffect(() => {
    // TODO: To set inited flag in other place?
    casterSession.setInited(true);
    // TODO: Do some initializations?
    return () => {
      casterSession.destroy();
    };
  }, [casterSession]);
  // prettier-ignore
  return (
    <SankeyAppSessionContextProvider value={casterSession}>
      {children}
    </SankeyAppSessionContextProvider>
  );
}

export function withSankeyAppSessionProvider<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
) {
  return function SankeyAppSessionWrapped(props: P) {
    return (
      <SankeyAppSessionProvider>
        <Component {...props} />
      </SankeyAppSessionProvider>
    );
  };
}
