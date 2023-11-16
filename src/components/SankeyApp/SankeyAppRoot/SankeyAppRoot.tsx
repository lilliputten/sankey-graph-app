import React from 'react';
import { observer } from 'mobx-react-lite';

import {
  SankeyAppSessionStoreProvider,
  useSankeyAppSessionStore,
} from 'src/components/SankeyApp/SankeyAppSessionStore';
import { FullScreenPageLayout } from 'src/ui/layouts/FullScreenPageLayout';
import { TMuiThemeMode } from 'src/core/types';

/* // TODO: Implement a set of components for different sankey states...
 * import { SankeyAppMain } from 'src/components/SankeyApp/SankeyAppMain';
 * import { SankeyAppPreview } from 'src/components/SankeyAppPreview';
 * import { SankeyAppStart } from 'src/components/SankeyAppStart';
 * import { SankeyAppFinished } from 'src/components/SankeyAppFinished';
 * import { SankeyAppWaiter } from 'src/components/SankeyAppWaiter';
 * import { SankeyAppStateWrapper } from 'src/layout/state-wrappers/SankeyAppStateWrapper';
 * import { TracksStoreProvider } from 'src/features/Tracks';
 * import { guideRoute } from 'src/config/app';
 */

const StubComponent = (text: string) => () => <>{text}</>;
const SankeyAppWaiter = StubComponent('SankeyAppWaiter');
const SankeyAppFinished = StubComponent('SankeyAppFinished');
const SankeyAppMain = StubComponent('SankeyAppMain');
const SankeyAppStart = StubComponent('SankeyAppStart');

interface TSankeyAppComponentProps {
  isReady: boolean;
  isFinished: boolean;
  showMainApp: boolean;
  themeMode: TMuiThemeMode;
}

/** Components router */
const SankeyAppComponent: React.FC<TSankeyAppComponentProps> = (props) => {
  const {
    // prettier-ignore
    isReady,
    isFinished,
    showMainApp,
    // themeMode,
  } = props;
  // TODO: notReady
  if (!isReady) {
    return <SankeyAppWaiter />; // themeMode={themeMode} waiting />;
  } else if (isFinished) {
    return <SankeyAppFinished />;
  } else if (showMainApp) {
    return <SankeyAppMain />;
  } else {
    return <SankeyAppStart />;
  }
};

/** Choose & render suitable application part */
const RenderComponent: React.FC = observer(() => {
  const sankeySession = useSankeyAppSessionStore();
  const { isDataLoaded, isFinished } = sankeySession;
  const isReady = true;
  // Show Preview page for guide if settings hasn't done
  const showMainApp = isDataLoaded;
  // Use dark theme for main application and light for all the other pages.
  const useDarkTheme = true;
  const themeMode: TMuiThemeMode = useDarkTheme ? 'dark' : 'light';
  // TODO: Wrap with error & loader splash renderer?
  return (
    <FullScreenPageLayout themeMode={themeMode}>
      <SankeyAppComponent
        isReady={isReady}
        isFinished={isFinished}
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
