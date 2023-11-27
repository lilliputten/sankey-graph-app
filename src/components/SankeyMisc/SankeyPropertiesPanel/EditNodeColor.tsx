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

// import styles from './EditNodeColor.module.scss';

interface TEditNodeColorProps extends TPropsWithClassName {
  nodeId: TNodeId | undefined;
}
const defaultColor = '#ffffff';

export const EditNodeColor: React.FC<TEditNodeColorProps> = observer((props) => {
  const { className, nodeId } = props;
  const sankeyAppDataStore = useSankeyAppDataStore();
  const nodeColor = useNodeColor(nodeId);
  const handleEditNodeColor = (color: string) => {
    if (nodeId !== undefined) {
      runInAction(() => {
        const { nodeColors, changedNodes } = sankeyAppDataStore;
        sankeyAppDataStore.nodeColors = {
          ...nodeColors,
          [nodeId]: color,
        };
        if (!changedNodes.includes(nodeId)) {
          sankeyAppDataStore.changedNodes = changedNodes.concat(nodeId);
        }
        /* console.log('[EditNodeColor:handleEditNodeColor:runInAction]', {
         *   color,
         *   nodeId,
         *   nodeColors: { ...nodeColors },
         *   changedNodes: { ...changedNodes },
         * });
         */
      });
    }
  };

  return (
    <FormControl className={classNames(className, 'EditNodeColor')}>
      <MuiColorInput
        value={nodeColor || defaultColor}
        onChange={handleEditNodeColor}
        format="hex"
      />
      <FormHelperText id="nodeColorText">
        {/* Helper text */}
        Edit node color
      </FormHelperText>
    </FormControl>
  );
});
