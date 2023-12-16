import React from 'react';
import { Box, Typography } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';

import styles from './HelpContent.module.scss';

type THelpContentProps = TPropsWithClassName;

export const HelpContent: React.FC<THelpContentProps> = (props) => {
  const { className } = props;
  return (
    <Box
      className={classNames(className, styles.root)}
      maxWidth="md" // NOTE: This modifier has specified in wrapping `HelpModal`
    >
      <Box className={classNames(styles.section, styles.content)}>
        <Typography variant="h3" gutterBottom>
          Help content section
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
      {/*
      <Box className={classNames(styles.section, styles.actions)}>
        <Button variant="contained" onClick={doLoadData}>
          Load data
        </Button>
      </Box>
      */}
    </Box>
  );
};
