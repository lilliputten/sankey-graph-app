/* // NOTE: Use dev (patched) version of plotly (required core nodejs polyfills for webpack 5+, see solution in `craco.config.js`)
 * import PlotlyLib from 'plotly.js/lib';
 * // export * from 'plotly.js/lib';
 */
/* // NOTE: Use production version of plotly
 * import PlotlyLib from 'plotly.js';
 * export * from 'plotly.js';
 */

// NOTE: Use embedded plotly library
import PlotlyLib from 'src/libs/plotly.js';

// @see [typescript - How to reexport `*` from a module that uses `export =` - Stack Overflow](https://stackoverflow.com/questions/41892470/how-to-reexport-from-a-module-that-uses-export)
// @see [Re-exporting CJS module with `export =` from ESM via `export *` causes type error · Issue #51923 · microsoft/TypeScript](https://github.com/microsoft/TypeScript/issues/51923)

export default PlotlyLib;
