// @ts-check

import cors from 'cors';
import express from 'express';

import { defaultWebPort, maxAgeStatic } from './config.mjs';
import { initStaticRoutes, listenerError, notFoundHandler } from './helpers.mjs';
import { initAcceptPostDataServer } from './accept-post-data.mjs';
import { getPathPrefix } from './data-files.mjs';

/** @type {TExpressServer} */
let server;

/** DEBUG: Test route
 * @param {TExpressRequest} _req
 * @param {TExpressResponse} res
 */
function testRoute(_req, res) {
  // eslint-disable-next-line no-console
  console.log('[core:testRoute]', {
    // req,
    // res,
  });
  res.send('Hello World!');
}

/** @param {TExpressServer} server */
function serveApp(server) {
  const maxAge = maxAgeStatic;
  const pathPrefix = getPathPrefix();
  const url = '/';
  server.use(
    url,
    express.static(pathPrefix, {
      maxAge,
      // index: true,
    }),
  );
  // eslint-disable-next-line no-console
  console.log('[core:server] Started serve app', {
    maxAge,
    pathPrefix,
    url,
  });
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

    serveApp(server);

    // NOTE: Serve some specific static routes if defined (see `config:staticServerRoutes`)...
    initStaticRoutes(server);

    server.get('/test', testRoute);

    initAcceptPostDataServer(server);

    listener.on('error', listenerError);

    server.use(notFoundHandler);

    // eslint-disable-next-line no-console
    console.log('[core:startServer] Server has already started.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('[core:core] error', message, {
      error,
    });
  }
}
