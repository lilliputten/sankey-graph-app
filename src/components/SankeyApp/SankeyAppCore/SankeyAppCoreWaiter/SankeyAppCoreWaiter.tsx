import React from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { LoaderSplash } from 'src/ui/Basic';

type TSankeyAppCoreWaiterProps = TPropsWithClassName;

export const SankeyAppCoreWaiter: React.FC<TSankeyAppCoreWaiterProps> = (props) => {
  const { className } = props;
  return (
    <Box className={classNames(className, 'SankeyAppCoreWaiter')}>
      <LoaderSplash show mode="cover" fullSize />
    </Box>
  );
};
