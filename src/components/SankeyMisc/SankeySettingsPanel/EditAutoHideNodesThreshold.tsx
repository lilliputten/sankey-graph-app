import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

export const EditAutoHideNodesThreshold: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { autoHideNodes, autoHideNodesThreshold } = sankeyAppSessionStore;
  if (!autoHideNodes) {
    return null;
  }
  const setAutoHideNodesThreshold: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const autoHideNodesThreshold = Number(ev.target.value);
    runInAction(() => {
      sankeyAppSessionStore.autoHideNodesThreshold = autoHideNodesThreshold;
    });
  };
  return (
    <FormControl className={classNames(className, 'EditAutoHideNodesThreshold')}>
      <InputLabel htmlFor="autoHideNodesThreshold">Filter by output values (%)</InputLabel>
      <Input
        inputProps={{ type: 'number' }}
        id="autoHideNodesThreshold"
        name="autoHideNodesThreshold"
        aria-describedby="lineWidthFactorText"
        size="small"
        onChange={setAutoHideNodesThreshold}
        value={autoHideNodesThreshold}
      />
      <FormHelperText id="lineWidthFactorText">
        Show only children with values more than this treshold (0 - show all).
      </FormHelperText>
    </FormControl>
  );
});
