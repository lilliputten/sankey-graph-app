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
import { FullScreenPageLayout } from 'src/ui/layouts/FullScreenPageLayout';

import { SankeyAppCoreWaiter } from './SankeyAppCoreWaiter';
import { SankeyAppCoreStart } from './SankeyAppCoreStart';

import styles from './SankeyAppCore.module.scss';

/** DEBUG: Don't wait for user action */
const __debugEmulateDataReady = false && isDevBrowser;

// DEBUG!
const StubComponent = (id: string) => () => (
  <Box className={classNames('SankeyAppCoreStub', id)}>
    Stub component: <strong>{id}</strong>
  </Box>
);
// const SankeyAppCoreWaiter = StubComponent('SankeyAppCoreWaiter');
const SankeyAppCoreReady = StubComponent('SankeyAppCoreReady');
// const SankeyAppCoreStart = StubComponent('SankeyAppCoreStart');
const SankeyAppCoreFinished = StubComponent('SankeyAppCoreFinished');

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
    return <SankeyAppCoreReady />;
  } else {
    return <SankeyAppCoreStart />;
  }
};

/** Choose & render suitable application part */
const RenderLayout: React.FC<TSankeyAppCoreProps> = observer((props) => {
  const { themeMode } = props;
  const sankeyAppDataStore = useSankeyAppDataStore();
  React.useEffect(() => {
    // Init store...
    sankeyAppDataStore.setInited(true);
    if (__debugEmulateDataReady) {
      // TODO: Set demo data
      sankeyAppDataStore.setReady(true);
    }
  }, [sankeyAppDataStore]);
  const { inited, loading, ready, finished } = sankeyAppDataStore;
  return (
    <FullScreenPageLayout themeMode={themeMode}>
      <RenderCurrentComponent
        inited={inited}
        loading={loading}
        ready={ready}
        finished={finished}
        themeMode={themeMode}
      />
    </FullScreenPageLayout>
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
