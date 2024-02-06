// @ts-check

import bodyParser from 'body-parser';

import { acceptPostDataUrl } from './config.mjs';
import { getDateTag, getRequestHostIp, getRequestOriginIp } from './helpers.mjs';
import {
  ensureTargetFolder,
  getAppUrlQuery,
  getTargetFileNames,
  getTargetFolder,
  writeTempAppData,
} from './data-files.mjs';

/* // UNUSED: addRawBody
 * [>*
 *  * @param {TExpressRequest} req
 *  * @param {TExpressResponse} res
 *  * @param {Buffer} buf
 *  <]
 * function addRawBody(req, res, buf [> , encoding <]) {
 *   // @ts-ignore
 *   req.rawBody = buf.toString();
 * }
 */

/** Creates an 'unique' id to safe store data files.
 * @param {TExpressRequest} req
 * @return {string}
 */
function getPostedDataId(req) {
  // Get parameters...
  const ip = getRequestOriginIp(req);
  // const host = getRequestHostIp(req);

  const {
    headers,
    // protocol,
    // method,
    // url,
    // socket,
    // query,
    // body,
  } = req;
  // const port = socket.localPort; // || 80;

  const referer = headers['referer'];
  let dataId = [global.options['files-omit-date-tag'] ? '' : getDateTag(), ip, referer].join('-');
  dataId = dataId
    .replace(/[^\w]+/g, ' ')
    .trim()
    .replace(/[ \s]+/g, '-');
  return dataId;
}

/**
 * @param {TExpressRequest} req
 * @param {TExpressResponse} res
 * @param {() => void} next
 */
function bodyParserErrorHandler(req, res, next) {
  // TODO: Use method!
  bodyParser.json({
    // verify: addRawBody, // NOTE: Is it deprecated?
    limit: '15mb',
  })(req, res, (err) => {
    if (err) {
      const { body, message } = err;
      const { method, url, query /*  body: reqBody, rawBody */ } = req;
      // eslint-disable-next-line no-console
      console.error('[accept-post-data:bodyParserErrorHandler] Request body parsing error', {
        err,
        method,
        url,
        query,
        message,
        body /* , rawBody, reqBody */,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(400).send('Request body parsing error: ' + message);
      return;
    }
    next();
  });
}

/**
 * @param {TAppDataNode} obj
 * @param {string} id
 */
function makeAppDataEntry(obj, id) {
  if (!obj) {
    const error = new Error('Undefined data for node "' + id + '"!');
    // eslint-disable-next-line no-console
    console.error('[accept-post-data:makeAppDataEntry]', id, error.message, {
      error,
      obj,
    });
    // eslint-disable-next-line no-debugger
    debugger;
    throw error;
  }
  if (typeof obj === 'string') {
    try {
      obj = JSON.parse(obj);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const error = new Error('Can not parse data for node "' + id + '": ' + message);
      // eslint-disable-next-line no-console
      console.error('[accept-post-data:makeAppDataEntry]', id, error.message, {
        message,
        err,
        error,
        obj,
      });
      // eslint-disable-next-line no-debugger
      debugger;
      throw error;
    }
  }
  return obj;
}

/**
 * @param {Partial<TAppData>} [rawData]
 * @return {TAppData}
 */
function getAppDataFromPostData(rawData) {
  if (!rawData) {
    const error = new Error('Empty raw data object received!');
    // eslint-disable-next-line no-console
    console.error('[accept-post-data:makeAppDataEntry]', error.message, {
      error,
      rawData,
    });
    // eslint-disable-next-line no-debugger
    debugger;
    throw error;
  }
  const { edges, flows, graphs, nodes } = rawData;
  const appData = {
    edges: makeAppDataEntry(edges, 'edges'),
    flows: makeAppDataEntry(flows, 'flows'),
    graphs: makeAppDataEntry(graphs, 'graphs'),
    nodes: makeAppDataEntry(nodes, 'nodes'),
  };
  return appData;
}

/**
 * @param {TExpressRequest} req
 * @param {TExpressResponse} res
 */
function acceptPostData(req, res) {
  try {
    const ip = getRequestOriginIp(req);
    const host = getRequestHostIp(req);

    const { protocol, method, url, headers, socket, query, body } = req;
    const port = socket.localPort; // || 80;

    const redirectVal = String(query?.redirect || '').toLowerCase();
    const doRedirect =
      !!redirectVal && redirectVal !== '0' && redirectVal !== 'false' && redirectVal !== 'no';

    const contentType = headers['content-type'];

    // Prepare unique file id...
    const dataId = getPostedDataId(req);
    const targetFolder = getTargetFolder();
    // const logPrefix = 'POST ' + acceptPostDataUrl + ':';
    console.log(
      '[accept-post-data:acceptPostData] Starting to prepare data in folder "' +
        targetFolder +
        '" with data id: "' +
        dataId +
        '"',
    );

    const targetFileNames = getTargetFileNames(targetFolder, dataId);
    const urlQuery = '/?' + getAppUrlQuery(targetFileNames);

    const appData = getAppDataFromPostData(body);

    console.log('[accept-post-data:acceptPostData]', {
      urlQuery,
      targetFileNames,
      targetFolder,
      dataId,
      appData,
      doRedirect,
      __bodyKeys: body && Object.keys(body),
      query,
      contentType,
      ip,
      host,
      protocol,
      method,
      url,
      headers,
      port,
    });

    // Write files...
    ensureTargetFolder(targetFolder);
    writeTempAppData(appData, targetFileNames);

    // NOTE: Make 303 redirect if `doRedirect` else return redirect url...
    if (doRedirect) {
      console.log('[accept-post-data:acceptPostData] Redirecting to url', urlQuery);
      // res.status(303);
      // res.set('Status', '303 Redirect to main app page');
      // res.set('Location', urlQuery);
      res.redirect(urlQuery);
    } else {
      console.log('[accept-post-data:acceptPostData] Return url data', urlQuery);
      res.status(200);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ url: urlQuery }));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('accept-post-data:acceptPostData] Catched error', message, {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    res
      .status(500)
      .send('Server error: ' + message)
      .end();
  }
}

/** @param {TExpressServer} server */
export function initAcceptPostDataServer(server) {
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.use(bodyParserErrorHandler);
  server.post(acceptPostDataUrl, acceptPostData);
  // eslint-disable-next-line no-console
  console.log('[accept-post-data:initAcceptPostDataServer] Added support for post data');
}
