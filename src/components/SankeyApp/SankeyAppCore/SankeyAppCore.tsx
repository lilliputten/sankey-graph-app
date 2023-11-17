import React from 'react';
import { observer } from 'mobx-react-lite';

import {
  SankeyAppSessionStoreProvider,
  useSankeyAppSessionStore,
} from 'src/components/SankeyApp/SankeyAppSessionStore';
import { FullScreenPageLayout } from 'src/ui/layouts/FullScreenPageLayout';
import { TMuiThemeMode } from 'src/core/types';

/* // TODO: Implement a set of components for different sankey states...
 * import { SankeyAppReady } from 'src/components/SankeyApp/SankeyAppReady';
 */

const StubComponent = (text: string) => () => <>{text}</>;
const SankeyAppWaiter = StubComponent('SankeyAppWaiter');
const SankeyAppReady = StubComponent('SankeyAppReady');

interface TSankeyAppCoreProps {
  themeMode: TMuiThemeMode;
}

interface TSubComponentProps {
  ready: boolean;
  finished: boolean;
  showReadyApp: boolean;
  themeMode: TMuiThemeMode;
}

/** Components router */
const SubComponent: React.FC<TSubComponentProps> = (props) => {
  const {
    // prettier-ignore
    ready,
    finished,
    showReadyApp,
    // themeMode,
  } = props;
  // TODO: error?
  if (ready && !finished && showReadyApp) {
    return <SankeyAppReady />;
  } else {
    return <SankeyAppWaiter />; // themeMode={themeMode} waiting />;
  }
};

/** Choose & render suitable application part */
const RenderComponent: React.FC<TSankeyAppCoreProps> = observer((props) => {
  const { themeMode } = props;
  const sankeySession = useSankeyAppSessionStore();
  const { ready, finished } = sankeySession;
  // Show Preview page for guide if settings hasn't done
  const showReadyApp = ready;
  // Use dark theme for main application and light for all the other pages.
  // TODO: Wrap with error & loader splash renderer?
  return (
    <FullScreenPageLayout themeMode={themeMode}>
      <SubComponent
        ready={ready}
        finished={finished}
        showReadyApp={showReadyApp}
        themeMode={themeMode}
      />
    </FullScreenPageLayout>
  );
});

export const SankeyAppCore: React.FC<TSankeyAppCoreProps> = (props) => {
  return (
    <SankeyAppSessionStoreProvider>
      <RenderComponent {...props} />
    </SankeyAppSessionStoreProvider>
  );
};
