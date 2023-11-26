import { TPlotlyData } from 'src/libs/plotly/types';

/** Demo data
 * @see https://plotly.com/javascript/sankey-diagram/
 */
export const demoPlotlySankeyData: TPlotlyData = [
  /** @type {Partial<Plotly.SankeyData>} */
  {
    type: 'sankey',
    orientation: 'h',
    /** @type {Partial<SankeyNode>} */
    node: {
      /** Chart bar default (vertical?) padding */
      pad: 10,
      /** Chart bar width */
      thickness: 30,
      /** Chart bar outline */
      line: {
        color: 'black',
        width: 0,
      },
      label: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      // color: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
    },
    /** @type {Partial<SankeyLink>} */
    link: {
      source: [0, 1, 0, 2, 3, 3],
      target: [2, 3, 3, 4, 4, 5],
      value: [8, 4, 2, 8, 4, 2],
    },
  },
];
