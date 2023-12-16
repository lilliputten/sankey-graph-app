import React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { FormControl, FormHelperText, FormLabel, Switch } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithClassName } from 'src/core/types';
import { TGraphId } from 'src/core/types/SankeyApp';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';

interface THideNodeButtonProps extends TPropsWithClassName {
  graphId: TGraphId | undefined;
}

export const HideNodeButton: React.FC<THideNodeButtonProps> = observer((props) => {
  const { className, graphId } = props;

  const sankeyAppDataStore = useSankeyAppDataStore();
  const { userHiddenGraphNodes } = sankeyAppDataStore;

  if (graphId == null) {
    return null;
  }

  const isNodeHidden = graphId != null && userHiddenGraphNodes.includes(graphId);

  const handleHideNodeButton: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const hideNode = ev.target.checked;
    let updatedList: TGraphId[] | undefined = undefined;
    if (hideNode) {
      if (!isNodeHidden) {
        // Add current id...
        updatedList = userHiddenGraphNodes.concat(graphId);
      }
    } else {
      if (isNodeHidden) {
        // Remove current id...
        updatedList = userHiddenGraphNodes.filter((id) => id !== graphId);
      }
    }
    /* console.log('[HideNodeButton:handleHideNodeButton]', {
     *   isNodeHidden,
     *   hideNode,
     *   updatedList,
     *   userHiddenGraphNodes,
     * });
     */
    runInAction(() => {
      if (updatedList) {
        sankeyAppDataStore.userHiddenGraphNodes = updatedList;
      }
    });
  };

  return (
    <FormControl className={classNames(className, 'HideNodeButton')}>
      <FormLabel htmlFor="hideNodeButton">Hide node</FormLabel>
      <Switch
        id="hideNodeButton"
        name="hideNodeButton"
        aria-labelledby="hideNodeButton"
        aria-describedby="hideNodeButtonText"
        checked={isNodeHidden}
        onChange={handleHideNodeButton}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <FormHelperText id="hideNodeButtonText">
        {/* Helper text */}
        Hide this specific node from the chart.
      </FormHelperText>
    </FormControl>
  );
});
