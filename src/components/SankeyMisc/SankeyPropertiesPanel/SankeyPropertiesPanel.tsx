import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { Box, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { TGraphId, TNodeId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

import styles from './SankeyPropertiesPanel.module.scss';

function useGraphNodeId(graphId?: TGraphId): TNodeId | undefined {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { graphsData, nodesData } = sankeyAppDataStore;
  return React.useMemo(() => {
    if (graphsData && nodesData && graphId !== undefined) {
      const graph = graphsData.find((graph) => graph.id_in_graph === graphId);
      if (graph) {
        const nodeId = graph.id_in_database;
        return nodeId;
      }
    }
  }, [graphsData, nodesData, graphId]);
}

function useNodeName(nodeId?: TNodeId) {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { nodesData, nodeNames } = sankeyAppDataStore;
  return React.useMemo(() => {
    if (nodesData && nodeId !== undefined) {
      const node = nodesData.find((node) => node.id === nodeId);
      const name = nodeNames[nodeId] !== undefined ? nodeNames[nodeId] : node?.name;
      return name;
    }
  }, [nodesData, nodeNames, nodeId]);
}

const PropertiesContent: React.FC<TPropsWithClassName> = observer(() => {
  const sankeyAppDataStore = useSankeyAppDataStore();
  const { selectedGraphId } = sankeyAppDataStore;
  const graphNodeId = useGraphNodeId(selectedGraphId);
  const graphNodeName = useNodeName(graphNodeId);
  const handleGraphNodeName: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const name = ev.target.value;
    if (graphNodeId !== undefined) {
      runInAction(() => {
        sankeyAppDataStore.nodeNames = {
          ...sankeyAppDataStore.nodeNames,
          [graphNodeId]: name,
        };
        /* console.log('[SankeyPropertiesPanel:handleGraphNodeName:runInAction]', {
         *   name,
         *   graphNodeId,
         *   nodeNames: { ...sankeyAppDataStore.nodeNames },
         * });
         */
      });
    }
  };
  if (selectedGraphId === undefined) {
    // prettier-ignore
    return (
      <Box className={styles.infoBox}>
        No node selected
      </Box>
    )
  }
  return (
    <>
      {/*
      <Box>DEBUG: Edit graph id: {selectedGraphId}</Box>
      */}
      <FormControl>
        <InputLabel htmlFor="graphNodeName">Graph node name</InputLabel>
        <Input
          id="graphNodeName"
          name="graphNodeName"
          aria-describedby="graphNodeNameText"
          size="small"
          onChange={handleGraphNodeName}
          value={graphNodeName || ''}
        />
        <FormHelperText id="graphNodeNameText">
          {/* Helper text */}
          Edit selected node name
        </FormHelperText>
      </FormControl>
    </>
  );
});

export const SankeyPropertiesPanel: React.FC<TPropsWithClassName> = (props) => {
  const { className } = props;
  return (
    <Box className={classNames(className, styles.root)}>
      <PropertiesContent />
    </Box>
  );
};
