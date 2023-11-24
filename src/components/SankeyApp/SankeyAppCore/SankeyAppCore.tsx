import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { isDevBrowser } from 'src/config/build';
import { TMuiThemeMode } from 'src/core/types';
import {
  SankeyAppDataStoreProvider,
  useSankeyAppDataStore,
} from 'src/components/SankeyApp/SankeyAppDataStore';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

import { SankeyViewer } from 'src/components/SankeyViewer';

import { SankeyAppCoreWaiter } from './SankeyAppCoreWaiter';
import { SankeyAppCoreStart } from './SankeyAppCoreStart';

import styles from './SankeyAppCore.module.scss';

/** DEBUG: Don't wait for user action */
const __debugEmulateDataReady = false && isDevBrowser;

// DEBUG!
const PlaceholderComponent = (id: string) => () => (
  <Box className={classNames('SankeyAppCorePlaceholder', id)}>
    Placeholder for component: <strong>{id}</strong>
  </Box>
);
// const SankeyAppCoreWaiter = PlaceholderComponent('SankeyAppCoreWaiter');
// const SankeyAppCoreReady = PlaceholderComponent('SankeyAppCoreReady');
// const SankeyAppCoreStart = PlaceholderComponent('SankeyAppCoreStart');
const SankeyAppCoreFinished = PlaceholderComponent('SankeyAppCoreFinished');

interface TSankeyAppCoreProps {
  className?: string;
  themeMode: TMuiThemeMode;
}

interface TCurrentComponentProps {
  inited: boolean;
  loading: boolean;
  ready: boolean;
  finished: boolean;
  themeMode: TMuiThemeMode;
}

/** Components router */
const RenderCurrentComponent: React.FC<TCurrentComponentProps> = (props) => {
  const {
    // prettier-ignore
    inited,
    loading,
    ready,
    finished,
  } = props;
  // TODO: Show an error?
  if (!inited || loading) {
    return <SankeyAppCoreWaiter />;
  } else if (finished) {
    return <SankeyAppCoreFinished />;
  } else if (ready) {
    return <SankeyViewer />;
  } else {
    return <SankeyAppCoreStart />;
  }
};

/** Choose & render suitable application part */
const RenderLayout: React.FC<TSankeyAppCoreProps> = observer((props) => {
  const { themeMode } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const sankeyAppDataStore = useSankeyAppDataStore();
  const loadNewData = React.useCallback(() => {
    // console.log('[SankeyAppCore:loadNewData]');
    sankeyAppDataStore.setReady(false);
  }, [sankeyAppDataStore]);
  React.useEffect(() => {
    /* // NOTE: It's already inited in `SankeyAppDataStoreProvider`
     * sankeyAppDataStore.setInited(true);
     */
    // Set ready flag for demo mode. Otherwise it'll be set in `SankeyAppCoreStart` after data load
    if (__debugEmulateDataReady) {
      // TODO: Set demo data
      sankeyAppDataStore.setReady(true);
    }
    // Set (and reset) handler for navigate to data load page...
    sankeyAppSessionStore.setLoadNewDataCb(loadNewData);
    return () => {
      sankeyAppSessionStore.setLoadNewDataCb(undefined);
    };
  }, [sankeyAppDataStore, sankeyAppSessionStore, loadNewData]);
  const { inited, loading, ready, finished } = sankeyAppDataStore;
  return (
    <RenderCurrentComponent
      inited={inited}
      loading={loading}
      ready={ready}
      finished={finished}
      themeMode={themeMode}
    />
  );
});

export const SankeyAppCore: React.FC<TSankeyAppCoreProps> = (props) => {
  const { className } = props;
  return (
    <SankeyAppDataStoreProvider>
      <Box className={classNames(className, styles.root)}>
        <RenderLayout {...props} />
      </Box>
    </SankeyAppDataStoreProvider>
  );
};
