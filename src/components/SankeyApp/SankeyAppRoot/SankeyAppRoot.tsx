import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { showError } from 'src/ui/Basic';
import { getErrorText } from 'src/helpers';
import { TPropsWithClassName, TMuiThemeMode } from 'src/core/types';
import {
  SankeyAppSessionStore,
  SankeyAppSessionStoreProvider,
  useSankeyAppSessionStore,
} from 'src/components/SankeyApp/SankeyAppSessionStore';
import { FullScreenPageLayout } from 'src/ui/layouts/FullScreenPageLayout';

import { SankeyAppCore } from 'src/components/SankeyApp/SankeyAppCore';
import { SankeyAppRootWaiter } from './SankeyAppRootWaiter/SankeyAppRootWaiter';
import { HelpModal } from 'src/components/SankeyMisc/HelpModal';

import styles from './SankeyAppRoot.module.scss';

// DEBUG: Unimplemented component stubs!
const PlaceholderComponent = (id: string) => () => (
  <Box className={classNames('SankeyAppRootPlaceholder', id)}>
    Placeholder component: <strong>{id}</strong>
  </Box>
);
const SankeyAppRootFinished = PlaceholderComponent('SankeyAppRootFinished');

interface TCurrentComponentProps {
  rootState: typeof SankeyAppSessionStore.prototype.rootState;
  themeMode: TMuiThemeMode;
}

/** Components router */
const RenderCurrentComponent: React.FC<TCurrentComponentProps> = (props) => {
  const {
    // prettier-ignore
    rootState,
    themeMode,
  } = props;
  switch (rootState) {
    case 'waiting':
      return <SankeyAppRootWaiter />;
    case 'finished':
      return <SankeyAppRootFinished />;
    case 'ready':
      return <SankeyAppCore themeMode={themeMode} />;
    // case 'welcome': // UNUSED!
    //   return <SankeyAppRootWelcome />;
  }
};

function useSankeyAppSessionInit() {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  React.useEffect(() => {
    // Init store...
    sankeyAppSessionStore.setInited(true);
    // Init options, parameters and settings...
    sankeyAppSessionStore
      .initSettings()
      .then(() => {
        sankeyAppSessionStore.setReady(true);
      })
      .catch((error) => {
        const errMsg = [
          // prettier-ignore
          'Cannot to initialize app session store settings',
          getErrorText(error),
        ]
          .filter(Boolean)
          .join(': ');
        const err = new Error(errMsg);
        // eslint-disable-next-line no-console
        console.error('[SankeyAppRoot:useSankeyAppSessionStore]', errMsg, {
          err,
          error,
        });
        // eslint-disable-next-line no-debugger
        debugger;
        showError(err);
        // throw error;
      });
  }, [sankeyAppSessionStore]);
}

/** Choose & render suitable application part */
const RenderLayout: React.FC = observer(() => {
  useSankeyAppSessionInit();
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { rootState } = sankeyAppSessionStore;
  // TODO: Get theme mode from config, session or the local storage?
  const { themeMode } = sankeyAppSessionStore;
  // const themeMode: TMuiThemeMode = defaultMuiThemeMode;
  // TODO: Wrap with error & loader splash renderer?
  return (
    <FullScreenPageLayout className={classNames(styles.layout)} themeMode={themeMode}>
      <RenderCurrentComponent
        // prettier-ignore
        rootState={rootState}
        themeMode={themeMode}
      />
      <HelpModal />
    </FullScreenPageLayout>
  );
});

type TSankeyAppRootProps = TPropsWithClassName;

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
