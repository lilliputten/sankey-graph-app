import { AppWrapper } from 'src/app/AppWrapper';
import { FullScreenPageLayout } from 'src/ui/layouts/FullScreenPageLayout';
import { TMuiThemeMode } from 'src/core/types';

// import { ReactDemoPage } from 'src/pages/ReactDemoPage';
import { TestPage } from 'src/pages/TestPage';

export function App() {
  const useDarkTheme = true;
  const themeMode: TMuiThemeMode = useDarkTheme ? 'dark' : 'light';
  return (
    <AppWrapper>
      <FullScreenPageLayout themeMode={themeMode}>
        <TestPage />
      </FullScreenPageLayout>
    </AppWrapper>
  );
}
