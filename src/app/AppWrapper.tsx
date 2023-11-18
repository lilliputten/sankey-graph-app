import React from 'react';

import { CoreWrapper } from 'src/app/wrappers/CoreWrapper';

interface TWithChildren {
  children?: React.ReactNode;
}
type TAppWrapperProps = TWithChildren;

// // Placeholders...
// const PlaceholderComponent = ({ children }: TWithChildren) => <>{children}</>;
// const StoreWrapper = PlaceholderComponent;

export function AppWrapper(props: TAppWrapperProps): JSX.Element {
  const { children } = props;
  return (
    <CoreWrapper>
      {/* TODO: Expose root control nodes or use custom hooks? */}
      {children}
    </CoreWrapper>
  );
}
