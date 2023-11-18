import React from 'react';

import { SankeyAppSessionStore } from './SankeyAppSessionStore';
import {
  // casterSession,
  SankeyAppSessionStoreContextProvider,
} from './SankeyAppSessionStoreContext';

interface TSankeyAppSessionStoreProviderProps {
  children?: React.ReactNode;
}
export function SankeyAppSessionStoreProvider(
  props: TSankeyAppSessionStoreProviderProps,
): JSX.Element {
  const { children } = props;
  const sankeyAppSessionStore = React.useMemo(() => {
    return new SankeyAppSessionStore();
  }, []);
  React.useEffect(() => {
    // TODO: To set inited flag in other place?
    sankeyAppSessionStore.setInited(true);
    // TODO: Do some initializations?
    return () => {
      sankeyAppSessionStore.destroy();
    };
  }, [sankeyAppSessionStore]);
  // prettier-ignore
  return (
    <SankeyAppSessionStoreContextProvider value={sankeyAppSessionStore}>
      {children}
    </SankeyAppSessionStoreContextProvider>
  );
}

export function withSankeyAppSessionStoreProvider<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
) {
  return function SankeyAppSessionStoreWrapped(props: P) {
    return (
      <SankeyAppSessionStoreProvider>
        <Component {...props} />
      </SankeyAppSessionStoreProvider>
    );
  };
}
