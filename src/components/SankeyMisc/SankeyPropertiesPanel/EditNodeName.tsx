import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { TNodeId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import { useNodeName } from './hooks';

interface TEditNodeNameProps extends TPropsWithClassName {
  nodeId: TNodeId | undefined;
}

export const EditNodeName: React.FC<TEditNodeNameProps> = observer((props) => {
  const { className, nodeId } = props;
  const sankeyAppDataStore = useSankeyAppDataStore();
  const nodeName = useNodeName(nodeId);
  const handleEditNodeName: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const name = ev.target.value;
    if (nodeId !== undefined) {
      runInAction(() => {
        const { nodeNames, changedNodes } = sankeyAppDataStore;
        sankeyAppDataStore.nodeNames = {
          ...nodeNames,
          [nodeId]: name,
        };
        if (!changedNodes.includes(nodeId)) {
          sankeyAppDataStore.changedNodes = changedNodes.concat(nodeId);
        }
        /* console.log('[EditNodeName:handleEditNodeName:runInAction]', {
         *   name,
         *   nodeId,
         *   nodeNames: { ...nodeNames },
         *   changedNodes: { ...changedNodes },
         * });
         */
      });
    }
  };
  return (
    <FormControl className={classNames(className, 'EditNodeName')}>
      <InputLabel htmlFor="nodeNameInput">Graph node name</InputLabel>
      <Input
        id="nodeNameInput"
        name="nodeName"
        aria-describedby="NodeNameText"
        size="small"
        onChange={handleEditNodeName}
        value={nodeName || ''}
      />
      <FormHelperText id="NodeNameText">
        {/* Helper text */}
        Edit node name
      </FormHelperText>
    </FormControl>
  );
});
