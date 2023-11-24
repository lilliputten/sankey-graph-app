/** YThe list of available chart engines */
export const validChartLibraries = [
  // prettier-ignore
  'anychart',
  'gojs',
] as const;
export type TChartLibrary = (typeof validChartLibraries)[number];
/** Default chart engine */
export const defaultChartLibrary: TChartLibrary = validChartLibraries[0];
