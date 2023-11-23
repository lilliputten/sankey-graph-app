import React from 'react';
import { Box, Typography } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { defaultDataFiles } from 'src/core/constants/Sankey';

import styles from './InfoContent.module.scss';

export const InfoContent: React.FC = ({ className }: TPropsWithClassName) => (
  <Box className={classNames(className, styles.root)}>
    <Typography variant="h3" gutterBottom>
      Load data
    </Typography>
    <Typography variant="subtitle1" gutterBottom>
      An intro text providing some explanations about the data loading procedure.
    </Typography>
    <Typography variant="h5" gutterBottom>
      Default data file names:
    </Typography>
    <ul className={styles.list}>
      <li>
        Edges: <u>{defaultDataFiles.edges}</u>
      </li>
      <li>
        Flows: <u>{defaultDataFiles.flows}</u>
      </li>
      <li>
        Graphs: <u>{defaultDataFiles.graphs}</u>
      </li>
      <li>
        Nodes: <u>{defaultDataFiles.nodes}</u>
      </li>
    </ul>
    <Typography variant="h5" gutterBottom>
      Demo data:
    </Typography>
    <Typography variant="body1" gutterBottom>
      <strong>Load demo data</strong> button loads demo data files (as in default data files, stored
      in project folder `public/sample-data/`, hosted in built app folder `sample-data`) from the
      project for the empty data slots.
    </Typography>
  </Box>
);
