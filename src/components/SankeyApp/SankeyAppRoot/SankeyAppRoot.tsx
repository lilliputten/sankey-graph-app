import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { isDevBrowser } from 'src/config/build';
import { defaultMuiThemeMode } from 'src/config/app';
import { PropsWithClassName, TMuiThemeMode } from 'src/core/types';
import {
  SankeyAppSessionStoreProvider,
  useSankeyAppSessionStore,
} from 'src/components/SankeyApp/SankeyAppSessionStore';
import { FullScreenPageLayout } from 'src/ui/layouts/FullScreenPageLayout';

import { SankeyAppCore } from 'src/components/SankeyApp/SankeyAppCore';
import { SankeyAppRootWaiter } from './SankeyAppRootWaiter/SankeyAppRootWaiter';
import { SankeyAppRootWelcome } from './SankeyAppRootWelcome';

import styles from './SankeyAppRoot.module.scss';

/** DEBUG: Don't wait for user action */
const __debugEmulateSessionReady = isDevBrowser;

// DEBUG!
const PlaceholderComponent = (id: string) => () => (
  <Box className={classNames('SankeyAppRootPlaceholder', id)}>
    Placeholder component: <strong>{id}</strong>
  </Box>
);
// const SankeyAppRootWelcome = PlaceholderComponent('SankeyAppRootWelcome');
const SankeyAppRootFinished = PlaceholderComponent('SankeyAppRootFinished');
// const SankeyAppCore = PlaceholderComponent('SankeyAppCore');
// const SankeyAppStart = PlaceholderComponent('SankeyAppStart');

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
    themeMode,
  } = props;
  if (!inited || loading) {
    return <SankeyAppRootWaiter />;
  } else if (finished) {
    return <SankeyAppRootFinished />;
  } else if (ready) {
    return <SankeyAppCore themeMode={themeMode} />;
  } else {
    return <SankeyAppRootWelcome />;
  }
};

/** Choose & render suitable application part */
const RenderLayout: React.FC = observer(() => {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  React.useEffect(() => {
    // Init store...
    sankeyAppSessionStore.setInited(true);
    if (__debugEmulateSessionReady) {
      sankeyAppSessionStore.setReady(true);
    }
  }, [sankeyAppSessionStore]);
  const { inited, loading, ready, finished } = sankeyAppSessionStore;
  // TODO: Get theme mode from config, session or the local storage?
  const themeMode: TMuiThemeMode = defaultMuiThemeMode;
  // TODO: Wrap with error & loader splash renderer?
  return (
    <FullScreenPageLayout className={classNames(styles.layout)} themeMode={themeMode}>
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

type TSankeyAppRootProps = PropsWithClassName;

export const SankeyAppRoot: React.FC<TSankeyAppRootProps> = (props) => {
  const { className } = props;
  return (
    <SankeyAppSessionStoreProvider>
      <Box className={classNames(className, styles.root)}>
        <RenderLayout />
      </Box>
    </SankeyAppSessionStoreProvider>
  );
};
