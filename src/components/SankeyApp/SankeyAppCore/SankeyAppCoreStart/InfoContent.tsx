import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { dataUrlPrefix, defaultDataFiles, autoLoadUrls } from 'src/core/constants/Sankey';
import { useSankeyAppSessionStore } from '../../SankeyAppSessionStore';

import styles from './InfoContent.module.scss';

export const InfoContent: React.FC<TPropsWithClassName> = observer(({ className }) => {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const {
    // prettier-ignore
    autoLoadUrlEdges,
    autoLoadUrlFlows,
    autoLoadUrlGraphs,
    autoLoadUrlNodes,
  } = sankeyAppSessionStore;
  return (
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
          Edges: <b>{defaultDataFiles.edges}</b> ('<u>{autoLoadUrlEdges}</u>')
        </li>
        <li>
          Flows: <b>{defaultDataFiles.flows}</b> ('<u>{autoLoadUrlFlows}</u>')
        </li>
        <li>
          Graphs: <b>{defaultDataFiles.graphs}</b> ('<u>{autoLoadUrlGraphs}</u>')
        </li>
        <li>
          Nodes: <b>{defaultDataFiles.nodes}</b> ('<u>{autoLoadUrlNodes}</u>')
        </li>
      </ul>
      <Typography variant="h5" gutterBottom>
        Demo data:
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Load demo data</strong> button loads demo data files (as in default data files,
        stored in project folder `public/{dataUrlPrefix}/`, hosted as built app folder `
        {dataUrlPrefix}/`) from the project for the empty data slots.
      </Typography>
    </Box>
  );
});
