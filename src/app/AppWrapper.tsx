/** @module AppWrapper
 *  @since 2023.02.20, 23:41
 *  @changed 2023.05.08, 16:20
 */

import React from 'react';

// import { StoreWrapper } from 'src/store';
import {
  CoreWrapper,
  // ThemeWrapper,
} from 'src/app/wrappers/CoreWrapper';

// TODO: Import control nodes/hooks from `features` folder.

interface TWithChildren {
  children?: React.ReactNode;
}
type TAppWrapperProps = TWithChildren;

// Stubs...
const StubComponent = ({ children }: TWithChildren) => <>{children}</>;
const StoreWrapper = StubComponent;
// const CoreWrapper = StubComponent;

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
