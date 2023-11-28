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

import { TPropsWithClassName } from 'src/core/types';
import { chartLibraryNames, TChartLibrary, validChartLibraries } from 'src/core/types/SankeyApp';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

const radioControl = <Radio size="small" />;

export const EditChartLibrary: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { chartLibrary } = sankeyAppSessionStore;
  const setChartLibrary: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const chartLibrary = ev.target.value as TChartLibrary;
    runInAction(() => {
      sankeyAppSessionStore.chartLibrary = chartLibrary;
    });
  };
  return (
    <FormControl className={classNames(className, 'EditChartLibrary')}>
      <FormLabel id="chartLibrary">Chart library</FormLabel>
      <RadioGroup
        aria-labelledby="chartLibrary"
        aria-describedby="chartLibraryText"
        // id="chartLibrary"
        name="chartLibrary"
        sx={{ marginTop: 1 }}
        onChange={setChartLibrary}
        value={chartLibrary}
      >
        {validChartLibraries.map((id) => (
          <FormControlLabel
            key={id}
            value={id}
            control={radioControl}
            label={chartLibraryNames[id]}
          />
        ))}
      </RadioGroup>
      <FormHelperText id="chartLibraryText">Library used to display data</FormHelperText>
    </FormControl>
  );
});
