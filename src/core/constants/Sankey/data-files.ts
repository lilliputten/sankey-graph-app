import { sampleDataUrlPrefix } from 'src/config/app';

/** Default file names for specific data types */
export const defaultDataFiles = {
  edges: 'edges.json',
  flows: 'flows.json',
  graphs: 'nodes-supply-chain.json', // 'graphs.json',
  nodes: 'nodes.json',
};

/** Create demo urls list */
export const autoLoadUrls = Object.keys(defaultDataFiles).reduce<Partial<typeof defaultDataFiles>>(
  (urls, id) => {
    urls[id as keyof typeof defaultDataFiles] =
      sampleDataUrlPrefix + defaultDataFiles[id as keyof typeof defaultDataFiles];
    return urls;
  },
  {},
);
