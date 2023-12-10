import React from 'react';

import PlotlyLib from 'src/libs/plotly/core/PlotlyLib';

import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

import cssVariables from 'src/core/assets/scss/variables.module.scss';

interface TChartLayoutParams {
  width?: number;
  height?: number;
}

const chartMarginSize = 16;
const chartMarginTopSize = 56;

export function useChartLayout(params: TChartLayoutParams) {
  const { width, height } = params;
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const { themeMode } = sankeyAppSessionStore;
  const isDarkTheme = themeMode === 'dark';
  const isLightTheme = !isDarkTheme;
  const chartLayout = React.useMemo<Partial<PlotlyLib.Layout>>(
    // @see https://plotly.com/python/reference/layout/
    () => ({
      width,
      height,
      type: 'sankey',
      // TODO: Store theming colors in config/storage?
      paper_bgcolor: cssVariables.graphPaperBgLight, // isDarkTheme ? 'black' : 'white',
      plot_bgcolor: cssVariables.graphPlotBgLight, // isDarkTheme ? '#222' : '#ddd',
      font: {
        color: isLightTheme
          ? cssVariables.graphPlotFontLightColor
          : cssVariables.graphPlotFontDarkColor, // isDarkTheme ? '#ccc' : '#333',
      },
      autosize: true, // Does it have an effect?
      // Set chart margins
      margin: {
        pad: 20,
        // @see https://plotly.com/javascript/reference/layout/#layout-margin
        // Top margin is wider in order to make room for panel buttons and legend
        t: chartMarginTopSize || chartMarginSize,
        b: chartMarginSize,
        l: chartMarginSize,
        r: chartMarginSize,
      },
      // Stylize hover labels
      hoverlabel: {
        // @see https://plotly.com/javascript/reference/layout/#layout-hoverlabel
        // @see https://plotly.com/javascript/reference/layout/#layout-newshape-label
        padding: 10,
        font: {
          color: isLightTheme
            ? cssVariables.graphLabelFontLightColor
            : cssVariables.graphLabelFontDarkColor, // isDarkTheme ? '#333' : '#ccc',
        },
        bgcolor: isLightTheme
          ? cssVariables.graphLabelBgLightColor
          : cssVariables.graphLabelBgDarkColor, // isDarkTheme ? '#eee' : '#222',
        bordercolor: isLightTheme
          ? cssVariables.graphLabelBorderLightColor
          : cssVariables.graphLabelBorderDarkColor, // isDarkTheme ? '#fff' : '#111', // Used fo contrastcolor here (?)
        // bordercolor: 'red',
        namelength: 5,
      },
      transition: {
        // @see https://plotly.com/javascript/reference/layout/#layout-transition
        easing: 'linear',
        duration: 50,
      },
      /* // Doesn't have effect...
       * newshape: {
       *   label: {
       *     // @see https://plotly.com/javascript/reference/layout/#layout-newshape-label
       *     padding: 10,
       *   },
       * },
       * opacity: 0.2,
       */
      /* // colorway: Use our colors
       * colorway: getStaticColorsList(),
       */
      /* // colorway: Plotly default colors
       * colorway: [
       *   '#1f77b4',
       *   '#ff7f0e',
       *   '#2ca02c',
       *   '#d62728',
       *   '#9467bd',
       *   '#8c564b',
       *   '#e377c2',
       *   '#7f7f7f',
       *   '#bcbd22',
       *   '#17becf',
       * ],
       */
      // hoverlabel
      /* // colorscale: Unknown effect
       * colorscale: {
       *   [> diverging: [
       *    *   [0, 'rgb(5, 10, 172)'],
       *    *   [0.35, 'rgb(106, 137, 247)'],
       *    *   [0.5, 'rgb(190, 190, 190)'],
       *    *   [0.6, 'rgb(220, 170, 132)'],
       *    *   [0.7, 'rgb(230, 145, 90)'],
       *    *   [1, 'rgb(178, 10, 28)'],
       *    * ],
       *    <]
       *   sequential: [
       *     [0, 'rgb(220, 220, 220)'],
       *     [0.2, 'rgb(245, 195, 157)'],
       *     [0.4, 'rgb(245, 160, 105)'],
       *     [1, 'rgb(178, 10, 28)'],
       *   ],
       * },
       */
      /* // TODO: Place text labels into the chart
       * annotations: [
       *   {
       *     text: 'Text',
       *     width: 100,
       *     textangle: '45',
       *     align: 'center',
       *     borderwidth: 0,
       *     showarrow: false,
       *     standoff: 20,
       *   },
       * ],
       */
      /* // TODO: To use to control updates?
       * uirevision: 1,
       * datarevision: 1,
       * editrevision: 1,
       * selectionrevision: 1,
       */
    }),
    [width, height, isLightTheme],
  );
  return chartLayout;
}
