import { Context, createContext, Provider, useContext } from 'react';

// import { makeStoreContext } from '@/helpers/store/storeContextHelpers';
import { SankeyAppSession } from './SankeyAppSession';

const SankeyAppSessionContext: Context<SankeyAppSession> = createContext({} as SankeyAppSession);
export const SankeyAppSessionContextProvider: Provider<SankeyAppSession> =
  SankeyAppSessionContext.Provider;

export function useSankeyAppSession() {
  return useContext(SankeyAppSessionContext);
}
