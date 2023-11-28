import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { TNodeId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
import { useNodeName } from 'src/hooks/Sankey';

interface TEditNodeNameProps extends TPropsWithClassName {
  nodeId: TNodeId | undefined;
}

interface TMemo {
  nodeId?: TNodeId;
}

export const EditNodeName: React.FC<TEditNodeNameProps> = observer((props) => {
  const { className, nodeId } = props;

  /** Memo is used to detect changed node id */
  const memo = React.useMemo<TMemo>(() => ({}), []);

  const sankeyAppDataStore = useSankeyAppDataStore();

  /** Node name from store */
  const nodeName = useNodeName(nodeId);
  // Store name locally first
  const [name, setName] = React.useState<string | undefined>(nodeName);

  // TODO: To throttle/debounce external handler (with local state)?
  React.useEffect(() => {
    /* console.log('[EditNodeName:handleEditNodeName] before', {
     *   nodeId,
     *   'memo.nodeId': memo.nodeId,
     *   nodeName,
     *   name,
     * });
     */
    if (nodeId !== memo.nodeId) {
      // Another node id: update local name
      /* console.log('[EditNodeName:handleEditNodeName] set local name for new id', {
       *   name,
       *   nodeId,
       *   'memo.nodeId': memo.nodeId,
       * });
       */
      setName(nodeName);
      memo.nodeId = nodeId;
    } else if (name && name !== nodeName && nodeId !== undefined) {
      // Update name in storage...
      runInAction(() => {
        const { nodeNames, changedNodes } = sankeyAppDataStore;
        /* console.log('[EditNodeName:handleEditNodeName:runInAction]', {
         *   name,
         *   nodeId,
         *   nodeNames: { ...nodeNames },
         *   changedNodes: { ...changedNodes },
         * });
         */
        sankeyAppDataStore.nodeNames = {
          ...nodeNames,
          [nodeId]: name,
        };
        if (!changedNodes.includes(nodeId)) {
          sankeyAppDataStore.changedNodes = changedNodes.concat(nodeId);
        }
      });
    }
  }, [memo, nodeId, name, nodeName, sankeyAppDataStore]);

  const handleEditNodeName: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const name = ev.target.value;
    setName(name);
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
