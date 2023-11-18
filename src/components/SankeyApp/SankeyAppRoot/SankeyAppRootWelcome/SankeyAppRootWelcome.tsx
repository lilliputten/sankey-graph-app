import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import classNames from 'classnames';

import { PropsWithClassName } from 'src/core/types';

import styles from './SankeyAppRootWelcome.module.scss';
import { useSankeyAppSessionStore } from '../../SankeyAppSessionStore';

type TSankeyAppRootWelcomeProps = PropsWithClassName;

export const SankeyAppRootWelcome: React.FC<TSankeyAppRootWelcomeProps> = (props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const doStart = React.useCallback(() => {
    sankeyAppSessionStore.setReady(true);
  }, [sankeyAppSessionStore]);
  return (
    <Container className={classNames(className, styles.root)} maxWidth="md">
      <Box className={classNames(styles.section, styles.content)}>
        <Typography variant="h3" gutterBottom>
          Welocme screen
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
          tenetur
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
        <Button variant="contained" onClick={doStart}>
          Load data
        </Button>
      </Box>
    </Container>
  );
};
