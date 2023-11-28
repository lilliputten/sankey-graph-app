import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import classNames from 'classnames';

import {
  muiThemeModeNames,
  TMuiThemeMode,
  TPropsWithClassName,
  validMuiThemeModes,
} from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

const radioControl = <Radio />;

export const EditThemeMode: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { themeMode } = sankeyAppSessionStore;
  const setMuiThemeMode: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const themeMode = ev.target.value as TMuiThemeMode;
    runInAction(() => {
      sankeyAppSessionStore.themeMode = themeMode;
    });
  };
  return (
    <FormControl className={classNames(className, 'EditThemeMode')}>
      <FormLabel id="themeMode">Theme</FormLabel>
      <RadioGroup
        aria-labelledby="themeMode"
        aria-describedby="muiThemeModeText"
        name="themeMode"
        onChange={setMuiThemeMode}
        value={themeMode}
      >
        {validMuiThemeModes.map((id) => (
          <FormControlLabel
            key={id}
            value={id}
            control={radioControl}
            label={muiThemeModeNames[id]}
          />
        ))}
      </RadioGroup>
      <FormHelperText id="muiThemeModeText">Application theme</FormHelperText>
    </FormControl>
  );
});
