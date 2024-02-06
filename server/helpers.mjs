// @ts-check

import fs from 'fs';
import path from 'path';
import express from 'express';
import { format, formatInTimeZone } from 'date-fns-tz';

import {
  ipv6remove,
  ipv6localhost,
  realIPAddress,
  maxAgeStatic,
  rootPath,
  staticServerRoutes,
  tagFormatPrecise,
} from './config.mjs';

/**
 * @param {number | Date} date
 * @param {string | undefined} timeZone
 * @param {string} fmt
 */
export function formatDate(date, timeZone, fmt) {
  if (timeZone) {
    return formatInTimeZone(date, timeZone, fmt);
  } else {
    return format(date, fmt);
  }
}

/**
 * @param {string} filename
 * @param {unknown} data
 */
export function writeJson(filename, data) {
  // TODO: Use try..catch for data processing?
  const jsonStr = JSON.stringify(data, undefined, 2);
  // TODO: Use sync version or promise to control errors?
  fs.writeFile(filename, jsonStr, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('[helpers:writeJson] error', {
        filename,
        err,
      });
      // eslint-disable-next-line no-debugger
      debugger;
    }
  });
}

/**
 * @param {number | Date} [date]
 */
export function getDateTag(date) {
  if (!date) {
    date = new Date();
  }
  return formatDate(date, undefined, tagFormatPrecise);
}

/**
 * @param {number} timeout
 * @param {any} value
 */
export function delayPromise(timeout, value) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout, value);
  });
}

/** Get client origin host
 * @param {TExpressRequest} req
 * @return {String}
 */
export function getRequestOriginIp(req) {
  let ip = req.ip;
  if (!ip || ip === ipv6localhost) {
    // ip = localhostAddress; // TODO: Or use real ip address instead?
    ip = realIPAddress; // Use real ip address instead?
  } else if (ip.startsWith(ipv6remove)) {
    ip = ip.substring(ipv6remove.length);
  }
  return ip;
}

/** Get client ip
 * @param {TExpressRequest} req
 * @return {String}
 */
export function getRequestHostIp(req) {
  const { headers } = req;
  const host = (
    headers.origin ||
    headers.referer ||
    headers.host ||
    realIPAddress ||
    'UNKNOWN'
  ).replace(/^https?:\/\/([A-z0-9._-]+).*?$/, '$1');
  return host;
}

/* // UNUSED: fileNotFound
 * [>* Response route for a non-found file
 *  * @param {TExpressRequest} req
 *  * @param {TExpressResponse} res
 *  * @param {string} filePath
 *  <]
 * function fileNotFound(req, res, filePath) {
 *   const ip = getRequestOriginIp(req);
 *   const { method, url } = req;
 *   // eslint-disable-next-line no-console
 *   console.warn('[helpers:fileNotFound]', { ip, method, url, filePath });
 *   debugger; // eslint-disable-line no-debugger
 *   return res.status(404).send('File not found: ' + filePath + ' (' + url + ')');
 * }
 */

/** @param {Error} error */
export function listenerError(error) {
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

/** @param {string} pathName */
export function posixPath(pathName) {
  return pathName.replace(/\\/g, '/');
}

/**
 * @param {TExpressRequest} req
 * @param {TExpressResponse} _res
 * @param {() => void} next
 */
export function logRequest(req, _res, next) {
  // TODO: Filter requests according to `filterServerIp`/`filterDeviceIp` parameters. See `debugRoutes:filterDebug`.
  const ip = getRequestOriginIp(req); // Remote ip
  const { method, protocol, url, headers } = req;
  const host = headers.host; // Our address
  // Last regexp excludes debugs with extended info in url
  const ipText = ip + (host ? ' (host: ' + host + ')' : '') + ':';
  // eslint-disable-next-line no-console
  console.log('[helpers:logRequest]', ['Request from', ipText, protocol, method, url].join(' '));
  next();
}

/**
 * @param {TExpressRequest} req
 * @param {TExpressResponse} res
 */
export function notFoundHandler(req, res) {
  const remoteIp = getRequestOriginIp(req);
  const { protocol, method, url, headers, socket } = req;
  const protocolStr = protocol ? protocol + '://' : '';
  const { localPort, localAddress, remotePort, remoteAddress } = socket;
  const portStr = localPort && Number(localPort) !== 80 ? ':' + localPort : '';
  const { /* origin, */ referer, host } = headers;
  const hostStr = host || 'localhost' + portStr;
  const uri = [
    protocolStr,
    hostStr,
    // portStr,
    url,
  ]
    .filter(Boolean)
    .join('');

  const msg = 'Route not found';

  // eslint-disable-next-line no-console
  console.error('[helpers:notFoundHandler] Error: ' + msg, {
    remoteIp,
    host,
    referer,
    method,
    protocol,
    url,
    localPort,
    localAddress,
    remotePort,
    remoteAddress,
    uri,
  });

  const responseStatus = 404;
  const responseMessage = [
    // prettier-ignore
    msg + ':',
    method,
    uri,
    '(from ' + remoteIp + ')',
  ]
    .filter(Boolean)
    .join(' ');

  return res.status(responseStatus).send(responseMessage);
}

/** @typedef {object} TMakeQueryOptions
 * @property {string} [prefix] - Query prefix symbol (default: '?').
 * @property {string} [delimiter] - Delimiter symbol (default: '&').
 * @property {boolean} [preserveNullable] - Preserve null & undefined values as 'null' & 'undefined' crsp.
 * @property {boolean} [omitEmpty] - Exclude empty ('', '0', `0`, 'false', `false`) values.
 * @property {boolean} [omitUndefined] - Exclude undefined values.
 */

/**
 * Parse url query string (in form `?xx=yy&...` or `xx=yy&...`)
 * @param {Record<string, unknown>} data - Query object
 * @param {TMakeQueryOptions} opt - Options
 * @return {string} search - Query string
 */
export function makeQuery(data, opt = {}) {
  // Extend with default parameters...
  opt = { prefix: '?', delimiter: '&', ...opt };
  const keys = Object.keys(data);
  let query = keys.reduce(function (query, key) {
    let val = data[key];
    // Convert nulls to empty string if preserveNullable flag isnt specified
    const omitEmpty =
      opt.omitEmpty && (val === '' || val === '0' || val === 0 || val === 'false' || val === false);
    const omitUndefined = opt.omitUndefined && val == null;
    if (!omitEmpty && !omitUndefined) {
      if (!opt.preserveNullable && val == null) {
        val = '';
      }
      key = encodeURIComponent(key);
      val = encodeURIComponent(String(val));
      // Adds a delimiter if query isn't empty...
      if (query) {
        query += opt.delimiter;
      }
      query += key + '=' + val;
    }
    return query;
  }, '');

  if (opt.prefix) {
    query = opt.prefix + query;
  }

  return query;
}

/** @param {TExpressServer} server */
export function initStaticRoutes(server) {
  server.use(logRequest);
  const maxAge = maxAgeStatic;
  staticServerRoutes.forEach((route) => {
    const url = '/' + route;
    const file = path.resolve(rootPath, route);
    // eslint-disable-next-line no-console
    console.log('[helpers:initStaticRoutes]: initStaticRoutes:route', url);
    server.use(
      url,
      express.static(file, {
        maxAge,
        index: false,
        // UNUSED `setHeaders` -- Doubled `logRequest`?
        /* setHeaders: (res, filePath[> , file_stats <]) => { // Log static request
         *   const { req } = res
         *   const ip = common.getRequestOriginIp(req)
         *   const { query, method, [> url, <] headers } = req
         *   const host = headers.host
         *   const url = '/' + path.relative(rootPath, filePath).replace(/\\/g, '/')
         *   if (!config.noServerLogs && !excludeLogUrls.includes(url) && !url.match(/\/debug($|\?)/)) {
         *     const data = {}
         *     if (query && Object.keys(query).length) {
         *       data.query = query
         *     }
         *     DEBUG([ 'static request', ip, method, host, url ].join(' '), data)
         *   }
         * },
         */
      }),
    );
  });
}
