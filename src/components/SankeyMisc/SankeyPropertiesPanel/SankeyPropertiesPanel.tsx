import React from 'react';
import { observer } from 'mobx-react-lite';
// import { runInAction } from 'mobx';
import {
  Box,
  FormControl,
  // FormControlLabel,
  FormHelperText,
  // FormLabel,
  Input,
  InputLabel,
} from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { TGraphId, TGraphsData, TNodesData } from 'src/core/types/SankeyApp';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

import styles from './SankeyPropertiesPanel.module.scss';

function getGraphNodeName(graphsData?: TGraphsData, nodesData?: TNodesData, graphId?: TGraphId) {
  if (graphsData && nodesData && graphId !== undefined) {
    const graph = graphsData.find((graph) => graph.id_in_graph === graphId);
    if (graph) {
      const nodeId = graph.id_in_database;
      const node = nodesData.find((node) => node.id === nodeId);
      return node?.name;
    }
  }
}

export const SankeyPropertiesPanel: React.FC<TPropsWithClassName> = observer((props) => {
  const { className } = props;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const {
    // prettier-ignore
    selectedGraphId,
    sankeyAppDataStore,
  } = sankeyAppSessionStore;
  // Set inital name value...
  const [graphNodeName, setGraphNodeName] = React.useState<string | undefined>(
    getGraphNodeName(
      sankeyAppDataStore?.graphsData,
      sankeyAppDataStore?.nodesData,
      selectedGraphId,
    ),
  );
  // Effect: update name if external data changed...
  React.useEffect(() => {
    setGraphNodeName(
      getGraphNodeName(
        sankeyAppDataStore?.graphsData,
        sankeyAppDataStore?.nodesData,
        selectedGraphId,
      ),
    );
  }, [
    // prettier-ignore
    sankeyAppDataStore?.graphsData,
    sankeyAppDataStore?.nodesData,
    selectedGraphId,
  ]);
  const handleGraphNodeName: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const graphNodeName = ev.target.value;
    setGraphNodeName(graphNodeName);
  };
  return (
    <Box className={classNames(className, styles.root)}>
      <Box>DEBUG: Edit graph id: {selectedGraphId}</Box>
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
    </Box>
  );
});
