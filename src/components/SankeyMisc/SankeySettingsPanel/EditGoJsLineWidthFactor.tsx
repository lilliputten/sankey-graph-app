import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

export const EditGoJsLineWidthFactor: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { goJsLineWidthFactor } = sankeyAppSessionStore;
  const setGoJsLineWidthFactor: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const goJsLineWidthFactor = Number(ev.target.value);
    runInAction(() => {
      sankeyAppSessionStore.goJsLineWidthFactor = goJsLineWidthFactor;
    });
  };
  return (
    <FormControl className={classNames(className, 'EditGoJsLineWidthFactor')}>
      <InputLabel htmlFor="goJsLineWidthFactor">Line width factor</InputLabel>
      <Input
        inputProps={{ type: 'number' }}
        id="goJsLineWidthFactor"
        name="goJsLineWidthFactor"
        aria-describedby="lineWidthFactorText"
        size="small"
        onChange={setGoJsLineWidthFactor}
        value={goJsLineWidthFactor}
      />
      <FormHelperText id="lineWidthFactorText">
        Coefficient for multiplying the width of connecting lines between nodes (GoJS only)
      </FormHelperText>
    </FormControl>
  );
});
