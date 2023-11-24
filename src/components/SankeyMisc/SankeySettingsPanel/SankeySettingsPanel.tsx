import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { chartLibraryNames, TChartLibrary, validChartLibraries } from 'src/core/types/SankeyApp';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

import styles from './SankeySettingsPanel.module.scss';
import { runInAction } from 'mobx';

/* TODO 2023.11.24, 02:09 -- To initialize the settings from the url query. */

const radioControl = <Radio size="small" />;

export const SankeySettingsPanel: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const {
    // prettier-ignore
    lineWidthFactor,
    chartLibrary,
  } = sankeyAppSessionStore;
  const setLineWidthFactor: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const lineWidthFactor = Number(ev.target.value);
    runInAction(() => {
      sankeyAppSessionStore.lineWidthFactor = lineWidthFactor;
    });
  };
  const setChartLibrary: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const chartLibrary = ev.target.value as TChartLibrary;
    runInAction(() => {
      sankeyAppSessionStore.chartLibrary = chartLibrary;
    });
  };
  return (
    <Box className={classNames(className, styles.root)}>
      <FormControl>
        <InputLabel htmlFor="lineWidthFactor">Line width factor</InputLabel>
        <Input
          inputProps={{ type: 'number' }}
          id="lineWidthFactor"
          name="lineWidthFactor"
          aria-describedby="lineWidthFactorText"
          size="small"
          onChange={setLineWidthFactor}
          value={lineWidthFactor}
        />
        <FormHelperText id="lineWidthFactorText">
          Coefficient for multiplying the width of connecting lines between nodes (GoJS only)
        </FormHelperText>
      </FormControl>

      <FormControl>
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
    </Box>
  );
});
