import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { Button, FormControl, FormLabel } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

export const EditUserHideNodes: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { userHiddenGraphNodes } = sankeyAppDataStore;
  const hasUserHiddenGraphNodes =
    Array.isArray(userHiddenGraphNodes) && !!userHiddenGraphNodes.length;
  if (!hasUserHiddenGraphNodes) {
    return null;
  }
  const resetUserHiddenGraphNodes = () => {
    runInAction(() => {
      sankeyAppDataStore.userHiddenGraphNodes = [];
    });
  };
  return (
    <FormControl className={classNames(className, 'EditUserHideNodes')} sx={{ gap: 1 }}>
      <FormLabel htmlFor="userHiddenGraphNodes">Revert all manually hidden nodes</FormLabel>
      <Button
        id="userHiddenGraphNodes"
        name="userHiddenGraphNodes"
        aria-labelledby="userHiddenGraphNodes"
        aria-describedby="userHiddenGraphNodesText"
        // checked={userHiddenGraphNodes}
        onClick={resetUserHiddenGraphNodes}
        disabled={!hasUserHiddenGraphNodes}
        // inputProps={{ 'aria-label': 'controlled' }}
        color="primary"
        variant="contained"
      >
        Restore nodes ({userHiddenGraphNodes.length})
      </Button>
      {/*
      <FormHelperText id="userHiddenGraphNodesText">
        Revert all previously manually hidden nodes.
      </FormHelperText>
      */}
    </FormControl>
  );
});
