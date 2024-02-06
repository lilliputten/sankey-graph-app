// @ts-check

import { options, parseOptions } from './options.mjs';
import { startServer } from './core.mjs';

// [>* @type {TOptions} <]
// global.prototype.options = {};

export function start() {
  if (!parseOptions()) {
    // Exit if help output has requested
    return;
  }

  startServer(options);
}
