import React from 'react';

import PlotlyLib from 'src/libs/plotly/core/PlotlyLib';

export function useChartConfig() {
  const chartConfig = React.useMemo<Partial<PlotlyLib.Config>>(
    () => ({
      // NOTE: Sankey diagrams can't be zoomed?
      scrollZoom: true,
      displaylogo: false,
      responsive: true,
      displayModeBar: true,
      // displayModeBar: false,
      modeBarButtonsToRemove: [
        // prettier-ignore
        'lasso2d',
        'select2d',
      ],
      logging: 2,
      /* editable: true,
       * edits: {
       *   annotationPosition: true,
       *   annotationTail: true,
       *   annotationText: true,
       *   axisTitleText: true,
       *   colorbarPosition: true,
       *   colorbarTitleText: true,
       *   legendPosition: true,
       *   legendText: true,
       *   shapePosition: true,
       *   titleText: true,
       * },
       */
    }),
    [],
  );
  return chartConfig;
}
