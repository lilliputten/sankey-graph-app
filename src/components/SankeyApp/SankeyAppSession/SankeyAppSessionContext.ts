import { Context, createContext, Provider, useContext } from 'react';

// import { makeStoreContext } from '@/helpers/store/storeContextHelpers';
import { SankeyAppSessionStore } from './SankeyAppSessionStore';

const SankeyAppSessionStoreContext: Context<SankeyAppSessionStore> = createContext({} as SankeyAppSessionStore);
export const SankeyAppSessionStoreContextProvider: Provider<SankeyAppSessionStore> =
  SankeyAppSessionStoreContext.Provider;

export function useSankeyAppSessionStore() {
  return useContext(SankeyAppSessionStoreContext);
}
