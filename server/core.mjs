// @ts-check

// import ip from 'ip';

import cors from 'cors';
import express from 'express';
// import * as expressCore from 'express-serve-static-core';
// import bodyParser from 'body-parser';
// import xmlparser from 'express-xml-bodyparser';

// import http from 'http';
// import https from 'https';

import { defaultWebPort } from './config.mjs';
import { initStaticRoutes, notFoundHandler } from './helpers.mjs';

/** @type {TExpressServer} */
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

/**
 * @param {TExpressRequest} req
 * @param {TExpressResponse} res
 */
function testRoute(req, res) {
  console.log('[core:testRoute]', {
    // req,
    // res,
  });
  res.send('Hello World!');
}

/** @param {Partial<TOptions>} options */
export function startServer(options) {
  try {
    const webPort = options['web-port'] || defaultWebPort;

    // eslint-disable-next-line no-console
    console.log('[core:startServer] Starting server with options', options);

    server = express();

    // Configure CORS...
    const corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200, // NOTE: Some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    server.use(cors(corsOptions));

    /** @type {import('http').Server} */
    const listener = server.listen(webPort);

    initStaticRoutes(server);

    server.get('/test', testRoute);

    listener.on('error', listenerError);

    server.use(notFoundHandler);

    // eslint-disable-next-line no-console
    console.log('[core:startServer] Starting has already started.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('[core:core] error', message, {
      error,
    });
  }
}
