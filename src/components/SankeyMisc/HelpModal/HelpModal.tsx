import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { HelpContent } from 'src/components/SankeyMisc/HelpContent';

import styles from './HelpModal.module.scss';

export const HelpModal: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { showHelp } = sankeyAppSessionStore;
  // TODO: Fetch & store graph data from and to `SankeyAppDataStore` with `graphId`
  const closeModal = () => {
    sankeyAppSessionStore.setShowHelp(false);
  };
  const title = 'Application help';
  // @see https://mui.com/material-ui/react-dialog/
  return (
    <Dialog
      className={classNames(className, styles.root)}
      open={showHelp}
      onClose={closeModal}
      maxWidth="md"
    >
      <DialogTitle className={styles.title}>
        <Box flexGrow={1}>{title}</Box>
        <Box>
          <IconButton onClick={closeModal}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <HelpContent />
      </DialogContent>
      {/* NOTE: Close action isn't used: we have close button on the top panel
      <DialogActions>
        <Button onClick={closeModal}>Close help</Button>
      </DialogActions>
       */}
    </Dialog>
  );
});
