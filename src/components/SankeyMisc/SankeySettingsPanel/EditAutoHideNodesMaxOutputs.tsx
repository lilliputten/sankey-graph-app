import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

export const EditAutoHideNodesMaxOutputs: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { autoHideNodes, autoHideNodesMaxOutputs } = sankeyAppSessionStore;
  if (!autoHideNodes) {
    return null;
  }
  const setAutoHideNodesMaxOutputs: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const autoHideNodesMaxOutputs = Number(ev.target.value);
    runInAction(() => {
      sankeyAppSessionStore.autoHideNodesMaxOutputs = autoHideNodesMaxOutputs;
    });
  };
  return (
    <FormControl className={classNames(className, 'EditAutoHideNodesMaxOutputs')}>
      <InputLabel htmlFor="autoHideNodesMaxOutputs">Filter by number of output edges</InputLabel>
      <Input
        inputProps={{ type: 'number' }}
        id="autoHideNodesMaxOutputs"
        name="autoHideNodesMaxOutputs"
        aria-describedby="lineWidthFactorText"
        size="small"
        onChange={setAutoHideNodesMaxOutputs}
        value={autoHideNodesMaxOutputs}
      />
      <FormHelperText id="lineWidthFactorText">
        Show only N larger output edges (0 - show all).
      </FormHelperText>
    </FormControl>
  );
});
