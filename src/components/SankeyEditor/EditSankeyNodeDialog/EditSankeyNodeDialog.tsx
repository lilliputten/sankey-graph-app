// https://mui.com/material-ui/react-dialog/
import React from 'react';
import classNames from 'classnames';

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { TGraphId, TPropsWithClassName } from 'src/core/types';

import styles from './EditSankeyNodeDialog.module.scss';

interface TEditSankeyNodeDialogProps extends TPropsWithClassName {
  // ...
  open?: boolean;
  handleClose: () => void;
  graphId?: TGraphId;
}

export const EditSankeyNodeDialog: React.FC<TEditSankeyNodeDialogProps> = (props) => {
  const {
    // prettier-ignore
    className,
    graphId,
    handleClose,
    open = false,
  } = props;
  // TODO: Fetch & store graph data from and to `SankeyAppDataStore` with `graphId`
  const handleSave = () => {
    // console.log('[EditSankeyNodeDialog:handleSave]');
    handleClose();
  };
  return (
    <Dialog
      // prettier-ignore
      className={classNames(className, styles.root)}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Edit node</DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>
          {/* Helper text */}
          Edit graph node properties.
        </DialogContentText>
        <TextField
          autoFocus
          // margin="dense"
          id="name"
          label="Node name"
          type="text"
          fullWidth
          variant="standard"
          value={graphId}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSave}
          // prettier-ignore
          variant="contained"
        >
          Save
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
