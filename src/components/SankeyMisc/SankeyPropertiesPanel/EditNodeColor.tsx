import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import classNames from 'classnames';

import { TColor, TPropsWithClassName } from 'src/core/types';
import { TNodeId } from 'src/core/types/SankeyApp';
import { useNodeColor } from 'src/hooks/Sankey';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { checkValidHexColor } from 'src/helpers/colors';

interface TEditNodeColorProps extends TPropsWithClassName {
  nodeId: TNodeId | undefined;
}

interface TMemo {
  nodeId?: TNodeId;
  nodeColor?: TColor;
}

export const EditNodeColor: React.FC<TEditNodeColorProps> = observer((props) => {
  const { className, nodeId } = props;

  /** Memo is used to detect changed node id */
  const memo = React.useMemo<TMemo>(() => ({}), []);

  const sankeyAppDataStore = useSankeyAppDataStore();
  /** Node color from store */
  const nodeColor = useNodeColor(nodeId);

  // Store color locally first
  const [color, setColor] = React.useState<string | undefined>(nodeColor);

  // Effect: Update store with local color
  React.useEffect(() => {
    const { nodeId, nodeColor } = memo;
    const doSet =
      nodeId !== undefined &&
      // nodeId === memo.nodeId &&
      color &&
      color !== nodeColor &&
      checkValidHexColor(color);
    /* console.log('[EditNodeColor:Effect: Update store with local color] check', {
     *   doSet,
     *   nodeId,
     *   color,
     *   nodeColor,
     * });
     */
    if (doSet) {
      // Update color in storage...
      runInAction(() => {
        const { nodeColors, changedNodes } = sankeyAppDataStore;
        /* console.log('[EditNodeColor:Effect: Update store with local color] do update', {
         *   nodeId,
         *   color,
         *   nodeColor,
         *   nodeColors: { ...nodeColors },
         *   changedNodes: { ...changedNodes },
         * });
         */
        sankeyAppDataStore.nodeColors = {
          ...nodeColors,
          [nodeId]: color as TColor,
        };
        if (!changedNodes.includes(nodeId)) {
          sankeyAppDataStore.changedNodes = changedNodes.concat(nodeId);
        }
        memo.nodeColor = color as TColor;
      });
    }
  }, [memo, nodeId, color, sankeyAppDataStore]);

  // Update local color from store...
  React.useEffect(() => {
    if (memo.nodeColor !== nodeColor) {
      /* console.log('[EditNodeColor:Effect: Update local color from store]', {
       *   'memo.nodeId': memo.nodeId,
       *   'memo.nodeColor': memo.nodeColor,
       *   nodeColor,
       * });
       */
      setColor(nodeColor);
      memo.nodeColor = nodeColor;
    }
  }, [memo, nodeColor]);

  // Update local node id...
  React.useEffect(() => {
    if (nodeId !== memo.nodeId) {
      /* console.log('[EditNodeColor:Effect: Update local node id]', {
       *   'memo.nodeId': memo.nodeId,
       *   nodeId,
       * });
       */
      // setId(nodeId);
      memo.nodeId = nodeId;
    }
  }, [memo, nodeId]);

  const handleEditNodeColor = (color: string) => {
    /* console.log('[EditNodeColor:handleEditNodeColor]', {
     *   color,
     * });
     */
    setColor(color);
  };

  return (
    <FormControl className={classNames(className, 'EditNodeColor')}>
      <MuiColorInput
        value={color || ''}
        onChange={handleEditNodeColor}
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
