// @ts-check

import fs from 'fs';
import http from 'http';

import { options, parseOptions } from './start-server-options.mjs';

if (!parseOptions()) {
  // Exit if help output has requested
  process.exit();
}

console.log('Server', {
  options,
});
