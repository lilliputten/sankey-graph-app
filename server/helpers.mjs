// @ts-check

// UNUSED: Import config parameters...
import {
  ipv6remove,
  ipv6localhost,
  realIPAddress,
  // localhostAddress,
  // uploadDir,
  // replaceUploadsDir,
  // useDebugStops,
} from './config.mjs';

/**
 * @param {number} timeout
 * @param {any} value
 */
export function delayPromise(timeout, value) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout, value);
  });
}

// UNUSED: getRequestOriginIp
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

// UNUSED: getRequestHostIp
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

/* // UNUSED: prepareDestDir
 * [>*
 *  * @param {string} dirName
 *  <]
 * export function prepareDestDir(dirName) {
 *   if (uploadDir && replaceUploadsDir && dirName.indexOf(replaceUploadsDir) === 0) {
 *     dirName = dirName.substr(replaceUploadsDir.length);
 *     // if (dirName.indexOf('/') === 0) {
 *     //   dirName = dirName.substr(1)
 *     // }
 *     // dirName = path.resolve(uploadDir, dirName)
 *     dirName = path.join(uploadDir, dirName);
 *   }
 *   return dirName;
 * }
 */

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
