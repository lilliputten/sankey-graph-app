/** The list of available chart engines */
export const validChartLibraries = [
  // prettier-ignore
  'plotly',
  'anychart',
  'gojs',
] as const;

// NOTE: Don't forget to update the library selection method in `src/components/SankeyHooks/useChartComponent.ts`

export type TChartLibrary = (typeof validChartLibraries)[number];

/** Default chart engine */
export const defaultChartLibrary: TChartLibrary = validChartLibraries[0];

export const chartLibraryNames: Record<TChartLibrary, string> = {
  plotly: 'Plotly',
  anychart: 'Anychart',
  gojs: 'GoJS',
};
