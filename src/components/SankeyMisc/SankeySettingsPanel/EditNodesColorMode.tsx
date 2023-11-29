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
import {
  defaultNodesColorMode,
  nodesColorModeNames,
  TNodesColorMode,
  validNodesColorModes,
} from 'src/core/types/SankeyApp';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

const radioControl = <Radio />;

export const EditNodesColorMode: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { nodesColorMode = defaultNodesColorMode } = sankeyAppSessionStore;
  const setNodesColorMode: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const nodesColorMode = ev.target.value as TNodesColorMode;
    runInAction(() => {
      // console.log('[EditNodesColorMode:setNodesColorMode] runInAction', nodesColorMode);
      // Update color mode...
      sankeyAppSessionStore.nodesColorMode = nodesColorMode;
    });
  };
  const helperText = React.useMemo(() => {
    switch (nodesColorMode) {
      case 'single': {
        return 'Single color (set below) will be used for all node colors as default.';
      }
      case 'progressive': {
        return 'Node colors will be set respectively to node depths with gradient from start to end colors (see below).';
      }
      case 'random': {
        return 'Node colors will be set randomly for their node ids.';
      }
    }
  }, [nodesColorMode]);
  return (
    <FormControl className={classNames(className, 'EditNodesColorMode')}>
      <FormLabel id="nodesColorMode">Nodes color mode</FormLabel>
      <RadioGroup
        aria-labelledby="nodesColorMode"
        aria-describedby="nodesColorModeText"
        name="nodesColorMode"
        onChange={setNodesColorMode}
        value={nodesColorMode}
      >
        {validNodesColorModes.map((id) => (
          <FormControlLabel
            key={id}
            value={id}
            control={radioControl}
            label={nodesColorModeNames[id]}
          />
        ))}
      </RadioGroup>
      <FormHelperText id="nodesColorModeText">
        {/* Helper text */}
        {helperText} Node colors could be overriden manually later.
      </FormHelperText>
    </FormControl>
  );
});
