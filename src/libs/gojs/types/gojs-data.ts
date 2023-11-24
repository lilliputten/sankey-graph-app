import * as go from 'gojs';

export type TGojsNodeDataArray = Array<go.ObjectData>;
export type TGojsLinkDataArray = Array<go.ObjectData>;

export interface TGojsData {
  nodeDataArray: TGojsNodeDataArray;
  linkDataArray?: TGojsLinkDataArray;
}
