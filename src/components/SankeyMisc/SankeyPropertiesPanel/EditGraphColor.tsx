import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import classNames from 'classnames';

import { TColor, TPropsWithClassName } from 'src/core/types';
import { TGraphId } from 'src/core/types/SankeyApp';
import { useGraphColor } from 'src/hooks/Sankey';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { checkValidHexColor } from 'src/helpers/colors';

interface TEditGraphColorProps extends TPropsWithClassName {
  graphId: TGraphId | undefined;
}

interface TMemo {
  graphId?: TGraphId;
  graphColor?: TColor;
}

export const EditGraphColor: React.FC<TEditGraphColorProps> = observer((props) => {
  const { className, graphId } = props;

  /** Memo is used to detect changed node id */
  const memo = React.useMemo<TMemo>(() => ({}), []);

  const sankeyAppDataStore = useSankeyAppDataStore();
  /** Graph color from store */
  const graphColor = useGraphColor(graphId);

  // Store color locally first
  const [color, setColor] = React.useState<string | undefined>(graphColor);

  // Effect: Update store with local color
  React.useEffect(() => {
    const { graphId, graphColor } = memo;
    const doSet =
      // prettier-ignore
      graphId !== undefined &&
      color &&
      color !== graphColor &&
      checkValidHexColor(color);
    /* console.log('[EditGraphColor:Effect: Update store with local color] check', {
     *   doSet,
     *   graphId,
     *   color,
     *   graphColor,
     * });
     */
    if (doSet) {
      // Update color in storage...
      runInAction(() => {
        const { nodeColors } = sankeyAppDataStore;
        /* console.log('[EditGraphColor:Effect: Update store with local color] do update', {
         *   graphId,
         *   color,
         *   graphColor,
         *   nodeColors: { ...nodeColors },
         *   changedNodes: { ...changedNodes },
         * });
         */
        sankeyAppDataStore.nodeColors = {
          ...nodeColors,
          [graphId]: color as TColor,
        };
        memo.graphColor = color as TColor;
      });
    }
  }, [memo, graphId, color, sankeyAppDataStore]);

  // Update local color from store...
  React.useEffect(() => {
    if (memo.graphColor !== graphColor) {
      /* console.log('[EditGraphColor:Effect: Update local color from store]', {
       *   'memo.graphId': memo.graphId,
       *   'memo.graphColor': memo.graphColor,
       *   graphColor,
       * });
       */
      setColor(graphColor);
      memo.graphColor = graphColor;
    }
  }, [memo, graphColor]);

  // Update local graph id...
  React.useEffect(() => {
    if (graphId !== memo.graphId) {
      /* console.log('[EditGraphColor:Effect: Update local graph id]', {
       *   'memo.graphId': memo.graphId,
       *   graphId,
       * });
       */
      // setId(graphId);
      memo.graphId = graphId;
    }
  }, [memo, graphId]);

  const handleEditGraphColor = (color: string) => {
    /* console.log('[EditGraphColor:handleEditGraphColor]', {
     *   color,
     * });
     */
    setColor(color);
  };

  return (
    <FormControl className={classNames(className, 'EditGraphColor')}>
      <MuiColorInput
        value={color || ''}
        onChange={handleEditGraphColor}
        format="hex"
        isAlphaHidden
      />
      <FormHelperText id="nodeColorText">
        {/* Helper text */}
        Edit node color
      </FormHelperText>
    </FormControl>
  );
});
