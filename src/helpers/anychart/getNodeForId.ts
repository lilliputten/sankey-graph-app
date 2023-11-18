import { TNodeHash, TNodeId } from 'src/core/types';

export function getNodeForId(nodesHash: TNodeHash, id: TNodeId) {
  const node = nodesHash[id];
  if (!node) {
    if (id === -1) {
      const error = new Error('Constructing stub root node for absent id = -1');
      // eslint-disable-next-line no-console
      console.warn('[getNodeForId]', error.message);
      return {
        name: 'Root node',
        product: 'Root product',
      };
    } else {
      const error = new Error('Cannot find node for id ' + id + ' (creating default node stub)');
      // eslint-disable-next-line no-console
      console.warn('[getNodeForId]', error.message);
      return {
        name: 'Node ' + id,
        product: 'Product' + id,
      };
    }
  }
  return node;
}
