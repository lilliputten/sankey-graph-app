import { Figure } from 'src/libs/react-plotly.js';

export interface TPlotlyGraphNode {
  group: boolean; // (i > nodeCount - 1)
  childrenNodes: TPlotlyGraphNode[]; // []
  pointNumber: number; // i
  label: unknown; // l
  color: string; // hasNodeColorArray ? nodeSpec.color[i] : nodeSpec.color
  customdata: unknown; // hasNodeCustomdataArray ? nodeSpec.customdata[i] : nodeSpec.customdata
  originalLayer?: number; // nodes[i].originalLayerIndex / (distinctLayerPositions.length - 1)
  originalLayerIndex?: number; // distinctLayerPositions.indexOf(nodes[i].originalX)

  // from `sankeyModel`

  x0?: number; // groupingNode.x0
  x1?: number; // groupingNode.x1
  y0?: number; // groupingNode.y0
  y1?: number; // groupingNode.y1
  partOfGroup?: boolean; // true
  sourceLinks?: unknown[]; // []
  targetLinks?: unknown[]; // []

  // ???

  dy?: number;
  dx?: number;
}

// see `src/libs/plotly.js/src/traces/sankey/render.js`: `sankeyModel`, `linkModel`, `nodeModel`...
export interface TPlotlyNodeData {
  index: number; // n.pointNumber
  key: string; // key
  partOfGroup: boolean; // n.partOfGroup || false
  group: unknown; // n.group
  traceId: number; // d.key
  trace: unknown; // d.trace
  node: TPlotlyGraphNode; // n
  nodePad: number; // d.nodePad
  nodeLineColor: string; // d.nodeLineColor
  nodeLineWidth: number; // d.nodeLineWidth
  textFont: string; // d.textFont
  size: number; // d.horizontal ? d.height : d.width
  visibleWidth: number; // Math.ceil(visibleThickness)
  visibleHeight: number; // visibleLength
  zoneX: number; // -zoneThicknessPad
  zoneY: number; // -zoneLengthPad
  zoneWidth: number; // visibleThickness + 2 * zoneThicknessPad
  zoneHeight: number; // visibleLength + 2 * zoneLengthPad
  labelY: number; // d.horizontal ? n.dy / 2 + 1 : n.dx / 2 + 1
  left: boolean; // n.originalLayer === 1
  sizeAcross: number; // d.width
  forceLayouts: boolean; // d.forceLayouts
  horizontal: boolean; // d.horizontal
  darkBackground: boolean; // tc.getBrightness() <= 128
  tinyColorHue: string; // Color.tinyRGB(tc)
  tinyColorAlpha: number; // tc.getAlpha()
  valueFormat: unknown; // d.valueFormat
  valueSuffix: unknown; // d.valueSuffix
  sankey: unknown; // d.sankey
  graph: unknown; // d.graph
  arrangement: unknown; // d.arrangement
  uniqueNodeLabelPathId: string; // [d.guid, d.key, key].join('_')
  interactionState: unknown; // d.interactionState
  figure: Figure; // d
}

export interface TPlottlyNodeElement extends Element {
  __data__: TPlotlyNodeData;
}
