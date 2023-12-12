import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText, FormLabel, Switch } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

export const EditAutoHideNodes: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { autoHideNodes } = sankeyAppSessionStore;
  const setAutoHideNodes: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const autoHideNodes = ev.target.checked;
    runInAction(() => {
      sankeyAppSessionStore.autoHideNodes = autoHideNodes;
    });
  };
  return (
    <FormControl className={classNames(className, 'EditAutoHideNodes')}>
      <FormLabel htmlFor="autoHideNodes">Auto hide nodes</FormLabel>
      <Switch
        id="autoHideNodes"
        name="autoHideNodes"
        aria-labelledby="autoHideNodes"
        aria-describedby="autoHideNodesText"
        checked={autoHideNodes}
        onChange={setAutoHideNodes}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <FormHelperText id="autoHideNodesText">
        {/* Helper text */}
        Auto hide graph nodes by specified filter parameters.
      </FormHelperText>
    </FormControl>
  );
});
