import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Switch,
  // FormHelperText,
} from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

export const EditVerticalLayout: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { verticalLayout } = sankeyAppSessionStore;
  const setVerticalLayout: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const verticalLayout = ev.target.checked;
    runInAction(() => {
      sankeyAppSessionStore.verticalLayout = verticalLayout;
    });
  };
  return (
    <FormControl className={classNames(className, 'EditVerticalLayout')}>
      <FormLabel htmlFor="verticalLayout">Vertical layout</FormLabel>
      <Switch
        id="verticalLayout"
        name="verticalLayout"
        aria-labelledby="verticalLayout"
        aria-describedby="verticalLayoutText"
        checked={verticalLayout}
        onChange={setVerticalLayout}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      {/*
      <FormHelperText id="verticalLayoutText">Vertical layout</FormHelperText>
      */}
    </FormControl>
  );
});
