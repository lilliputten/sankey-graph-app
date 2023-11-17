import React from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { PropsWithClassName } from 'src/core/types';
import { LoaderSplash } from 'src/ui/Basic';

type TSankeyAppCoreWaiterProps = PropsWithClassName;

export const SankeyAppCoreWaiter: React.FC<TSankeyAppCoreWaiterProps> = (props) => {
  const { className } = props;
  return (
    <Box className={classNames(className, 'SankeyAppCoreWaiter')}>
      <LoaderSplash show mode="cover" fullSize />
    </Box>
  );
};
