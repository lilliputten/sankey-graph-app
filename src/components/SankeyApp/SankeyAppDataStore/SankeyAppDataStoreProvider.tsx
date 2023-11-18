import React from 'react';

import { SankeyAppDataStore } from './SankeyAppDataStore';
import { SankeyAppDataStoreContextProvider } from './SankeyAppDataStoreContext';

interface TSankeyAppDataStoreProviderProps {
  children?: React.ReactNode;
}
export function SankeyAppDataStoreProvider(props: TSankeyAppDataStoreProviderProps): JSX.Element {
  const { children } = props;
  const sankeyAppDataStore = React.useMemo(() => {
    return new SankeyAppDataStore();
  }, []);
  React.useEffect(() => {
    // TODO: To set inited flag in other place?
    sankeyAppDataStore.setInited(true);
    // TODO: Do some initializations?
    return () => {
      sankeyAppDataStore.destroy();
    };
  }, [sankeyAppDataStore]);
  // prettier-ignore
  return (
    <SankeyAppDataStoreContextProvider value={sankeyAppDataStore}>
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
