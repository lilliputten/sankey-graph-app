import React from 'react';

import { SankeyAppDataStore } from './SankeyAppDataStore';
import {
  // casterSession,
  SankeyAppDataStoreContextProvider,
} from './SankeyAppDataStoreContext';

interface TSankeyAppDataStoreProviderProps {
  children?: React.ReactNode;
}
export function SankeyAppDataStoreProvider(props: TSankeyAppDataStoreProviderProps): JSX.Element {
  const { children } = props;
  const casterSession = React.useMemo(() => {
    return new SankeyAppDataStore();
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
    <SankeyAppDataStoreContextProvider value={casterSession}>
      {children}
    </SankeyAppDataStoreContextProvider>
  );
}

export function withSankeyAppDataStoreProvider<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
) {
  return function SankeyAppDataStoreWrapped(props: P) {
    return (
      <SankeyAppDataStoreProvider>
        <Component {...props} />
      </SankeyAppDataStoreProvider>
    );
  };
}
