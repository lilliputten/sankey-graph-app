import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import classNames from 'classnames';

import { TColor, TPropsWithClassName } from 'src/core/types';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';
import { checkValidHexColor } from 'src/helpers/colors';

interface TEditColorProps extends TPropsWithClassName {
  /** Hint text */
  text?: string;
  /** Property id in SankeyAppSessionStore */
  storeId: 'baseNodesColor' | 'secondNodesColor';
}

export const EditColor: React.FC<TEditColorProps> = observer((props) => {
  const {
    // prettier-ignore
    className,
    text = 'Edit color',
    storeId,
  } = props;

  // Get color from store...
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const storeColor = sankeyAppSessionStore[storeId];

  // Store color locally first...
  const [color, setColor] = React.useState<string | undefined>(storeColor);

  // Update store color from local one...
  React.useEffect(() => {
    if (color && color !== storeColor && checkValidHexColor(color)) {
      // Update color in store...
      runInAction(() => {
        sankeyAppSessionStore[storeId] = color as TColor;
      });
    }
  }, [storeId, color, storeColor, sankeyAppSessionStore]);

  // Update local color from store...
  React.useEffect(() => {
    setColor(storeColor);
  }, [storeColor]);

  // Update local color from input...
  const handleEditColor = (color: string) => {
    setColor(color);
  };

  return (
    <FormControl className={classNames(className, 'EditColor')}>
      <MuiColorInput
        // prettier-ignore
        value={color || ''}
        onChange={handleEditColor}
        format="hex"
        isAlphaHidden
      />
      <FormHelperText id="EditColorHelpertext">
        {/* Helper text */}
        {text}
      </FormHelperText>
    </FormControl>
  );
});
