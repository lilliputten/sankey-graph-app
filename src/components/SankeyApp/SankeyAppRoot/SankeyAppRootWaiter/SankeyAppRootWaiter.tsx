import React from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { LoaderSplash } from 'src/ui/Basic';

type TSankeyAppRootWaiterProps = TPropsWithClassName;

export const SankeyAppRootWaiter: React.FC<TSankeyAppRootWaiterProps> = (props) => {
  const { className } = props;
  return (
    <Box className={classNames(className, 'SankeyAppRootWaiter')}>
      <LoaderSplash show mode="cover" fullSize />
    </Box>
  );
};
