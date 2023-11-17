import React from 'react';
import { observer } from 'mobx-react-lite';

import {
  SankeyAppSessionStoreProvider,
  useSankeyAppSessionStore,
} from 'src/components/SankeyApp/SankeyAppSessionStore';
import { FullScreenPageLayout } from 'src/ui/layouts/FullScreenPageLayout';
import { TMuiThemeMode } from 'src/core/types';

import { SankeyAppCore } from 'src/components/SankeyApp/SankeyAppCore';

/* // TODO: Implement a set of components for different sankey states...
 * import { SankeyAppCore } from 'src/components/SankeyApp/SankeyAppCore';
 */

const StubComponent = (text: string) => () => <>{text}</>;
const SankeyAppWaiter = StubComponent('SankeyAppWaiter');
const SankeyAppFinished = StubComponent('SankeyAppFinished');
// const SankeyAppCore = StubComponent('SankeyAppCore');
const SankeyAppStart = StubComponent('SankeyAppStart');

interface TSubComponentProps {
  ready: boolean;
  finished: boolean;
  showMainApp: boolean;
  themeMode: TMuiThemeMode;
}

/** Components router */
const SubComponent: React.FC<TSubComponentProps> = (props) => {
  const {
    // prettier-ignore
    ready,
    finished,
    showMainApp,
    themeMode,
  } = props;
  // TODO: notReady
  if (!ready) {
    return <SankeyAppWaiter />; // themeMode={themeMode} waiting />;
  } else if (finished) {
    return <SankeyAppFinished />;
  } else if (showMainApp) {
    return <SankeyAppCore themeMode={themeMode} />;
  } else {
    return <SankeyAppStart />;
  }
};

/** Choose & render suitable application part */
const RenderComponent: React.FC = observer(() => {
  const sankeySession = useSankeyAppSessionStore();
  const { ready, finished } = sankeySession;
  // Show Preview page for guide if settings hasn't done
  const showMainApp = ready;
  // Use dark theme for main application and light for all the other pages.
  const useDarkTheme = true;
  const themeMode: TMuiThemeMode = useDarkTheme ? 'dark' : 'light';
  // TODO: Wrap with error & loader splash renderer?
  return (
    <FullScreenPageLayout themeMode={themeMode}>
      <SubComponent
        ready={ready}
        finished={finished}
        showMainApp={showMainApp}
        themeMode={themeMode}
      />
    </FullScreenPageLayout>
  );
});

export const SankeyAppRoot: React.FC = () => {
  return (
    <SankeyAppSessionStoreProvider>
      <RenderComponent />
    </SankeyAppSessionStoreProvider>
  );
};
