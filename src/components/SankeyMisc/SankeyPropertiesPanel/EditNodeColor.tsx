import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { TNodeId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { useNodeColor } from './hooks';

interface TEditNodeColorProps extends TPropsWithClassName {
  nodeId: TNodeId | undefined;
}

interface TMemo {
  nodeId?: TNodeId;
}

const defaultColor = '#ffffff';

export const EditNodeColor: React.FC<TEditNodeColorProps> = observer((props) => {
  const { className, nodeId } = props;

  /** Memo is used to detect changed node id */
  const memo = React.useMemo<TMemo>(() => ({}), []);

  const sankeyAppDataStore = useSankeyAppDataStore();
  /** Node color from store */
  const nodeColor = useNodeColor(nodeId);
  // Store color locally first
  const [color, setColor] = React.useState<string | undefined>(nodeColor);

  // TODO: To throttle/debounce external handler (with local state)?
  React.useEffect(() => {
    /* console.log('[EditNodeColor:handleEditNodeColor] before', {
     *   nodeId,
     *   'memo.nodeId': memo.nodeId,
     *   nodeColor,
     *   color,
     * });
     */
    if (nodeId !== memo.nodeId) {
      // Another node id: update local color
      /* console.log('[EditNodeColor:handleEditNodeColor] set local color for new id', {
       *   color,
       *   nodeId,
       * });
       */
      setColor(nodeColor);
      memo.nodeId = nodeId;
    } else if (color && color !== nodeColor && nodeId !== undefined) {
      // Update color in storage...
      runInAction(() => {
        const { nodeColors, changedNodes } = sankeyAppDataStore;
        /* console.log('[EditNodeColor:handleEditNodeColor:runInAction]', {
         *   color,
         *   nodeId,
         *   nodeColors: { ...nodeColors },
         *   changedNodes: { ...changedNodes },
         * });
         */
        sankeyAppDataStore.nodeColors = {
          ...nodeColors,
          [nodeId]: color,
        };
        if (!changedNodes.includes(nodeId)) {
          sankeyAppDataStore.changedNodes = changedNodes.concat(nodeId);
        }
      });
    }
  }, [memo, nodeId, color, nodeColor, sankeyAppDataStore]);

  const handleEditNodeColor = (color: string) => {
    setColor(color);
  };

  return (
    <FormControl className={classNames(className, 'EditNodeColor')}>
      <MuiColorInput
        value={nodeColor || defaultColor}
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
