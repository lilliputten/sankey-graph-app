import { Context, createContext, Provider, useContext } from 'react';

// import { makeStoreContext } from '@/helpers/store/storeContextHelpers';
import { SankeyAppDataStore } from './SankeyAppDataStore';

const SankeyAppDataStoreContext: Context<SankeyAppDataStore> = createContext(
  {} as SankeyAppDataStore,
);
export const SankeyAppDataStoreContextProvider: Provider<SankeyAppDataStore> =
  SankeyAppDataStoreContext.Provider;

export function useSankeyAppDataStore() {
  return useContext(SankeyAppDataStoreContext);
}
