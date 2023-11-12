import React from 'react';

import { CoreWrapper } from 'src/app/wrappers/CoreWrapper';

interface TWithChildren {
  children?: React.ReactNode;
}
type TAppWrapperProps = TWithChildren;

// Stubs...
const StubComponent = ({ children }: TWithChildren) => <>{children}</>;
const StoreWrapper = StubComponent;

export function AppWrapper(props: TAppWrapperProps): JSX.Element {
  const { children } = props;
  return (
    <>
      <StoreWrapper>
        <CoreWrapper>
          {/* TODO: Expose root control nodes or use custom hooks? */}
          {children}
        </CoreWrapper>
      </StoreWrapper>
    </>
  );
}
