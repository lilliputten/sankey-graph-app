/** The list of available values */
export const validNodesColorModes = [
  // prettier-ignore
  'random',
  'single',
  'progressive',
] as const;

export type TNodesColorMode = (typeof validNodesColorModes)[number];

/** Default chart engine */
export const defaultNodesColorMode: TNodesColorMode = validNodesColorModes[0];

export const nodesColorModeNames: Record<TNodesColorMode, string> = {
  random: 'Random',
  single: 'Single',
  progressive: 'Progressive',
};
