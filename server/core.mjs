// @ts-check

// import fs from 'fs';
// import path from 'path';

// import ip from 'ip';

import cors from 'cors';
import express from 'express';
// import * as expressCore from 'express-serve-static-core';
// import bodyParser from 'body-parser';
// import xmlparser from 'express-xml-bodyparser';

// import http from 'http';
// import https from 'https';

import { defaultWebPort } from 'config.mjs';

/** @type {import('express-serve-static-core').Express} */
let server;

/** @param {Error} error */
function listenerError(error) {
  let message = 'Server listener error: ';
  // Show only message for known errors
  if (
    error &&
    // @ts-expect-error: This parameter is exist
    error.code === 'EADDRINUSE'
  ) {
    message += error.message || String(error);
  } else {
    message += error.stack || String(error);
  }
  // eslint-disable-next-line no-console
  console.error('[core:listenerError] error', message, {
    error,
  });
  debugger; // eslint-disable-line no-debugger
}

/** @param {Partial<TOptions>} options */
export function startServer(options) {
  const webPort = options['web-port'] || defaultWebPort;

  console.log('[core:startServer]', {
    webPort,
    options,
  });
  debugger;

  server = express();

  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  server.use(cors(corsOptions));

  /** @type {import('http').Server} */
  const listener = server.listen(webPort);

  listener.on('error', listenerError);
}
