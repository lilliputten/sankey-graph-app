// @ts-check

// import fs from 'fs';
// import http from 'http';

import { options, parseOptions } from './options.mjs';
import { startServer } from './core.mjs';

export function start() {
  if (!parseOptions()) {
    // Exit if help output has requested
    return;
  }

  startServer(options);
}
