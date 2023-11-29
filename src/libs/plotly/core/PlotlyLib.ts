// NOTE: Use dev (patched) version of plotly (required core nodejs polyfills for webpack 5+, see solution in `craco.config.js`)
import PlotlyLib from 'plotly.js/lib';
export * from 'plotly.js/lib';

// // NOTE: Use production version of plotly
// import PlotlyLib from 'plotly.js';
// export * from 'plotly.js';

export default PlotlyLib;
