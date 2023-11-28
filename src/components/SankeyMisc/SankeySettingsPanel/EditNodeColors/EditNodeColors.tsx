import React from 'react';
import { observer } from 'mobx-react-lite';

import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

import { EditColor } from './EditColor';

export const EditNodeColors: React.FC = observer(() => {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { nodesColorMode } = sankeyAppSessionStore;
  const content = React.useMemo(() => {
    switch (nodesColorMode) {
      case 'single': {
        return (
          <EditColor
            // prettier-ignore
            storeId="baseNodesColor"
            text="Default nodes color"
          />
        );
      }
      case 'progressive': {
        return (
          <>
            <EditColor
              // prettier-ignore
              storeId="baseNodesColor"
              text="Progression start color"
            />
            <EditColor
              // prettier-ignore
              storeId="secondNodesColor"
              text="Progression end color"
            />
          </>
        );
      }
      default:
      case 'random': {
        return null;
      }
    }
  }, [nodesColorMode]);
  return content;
});
