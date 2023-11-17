import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import classNames from 'classnames';

import { PropsWithClassName } from 'src/core/types';

import styles from './SankeyAppCoreStart.module.scss';
import { useSankeyAppDataStore } from '../../SankeyAppDataStore';

type TSankeyAppCoreStartProps = PropsWithClassName;

export const SankeyAppCoreStart: React.FC<TSankeyAppCoreStartProps> = (props) => {
  const { className } = props;
  const sankeyDataStore = useSankeyAppDataStore();
  /** If data has already loaded then it's possible to go to core visualizer/editor */
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const doStart = React.useCallback(() => {
    console.log('[SankeyAppCoreStart:doStart]', {
    });
    debugger;
    sankeyDataStore.setReady(true);
  }, [sankeyDataStore]);
  return (
    <Container className={classNames(className, styles.root)} maxWidth="md">
      <Box className={classNames(styles.section, styles.content)}>
        <Typography variant="h3" gutterBottom>
          Load data
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          An intro text providing some explanations about the data loading procedure.
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
          unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate
          numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
          unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate
          numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
      </Box>
      <Box className={classNames(styles.section, styles.actions)}>
        <Button
          // prettier-ignore
          variant="contained"
          onClick={doStart}
          disabled={!isDataLoaded}
        >
          Start visualizing
        </Button>
      </Box>
    </Container>
  );
};
