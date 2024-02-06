// @ts-check

import fs from 'fs';
import path from 'path';

import { getDateTag, posixPath, writeJson } from './helpers.mjs';
import { defaultTargetFolder, devBuildFolder, rootPath } from './config.mjs';

/**
 * @return string
 */
export function getTargetFolder() {
  let targetFolder = global.options['files-target-folder'] || defaultTargetFolder;
  if (!global.options['files-omit-date-tag']) {
    targetFolder += '-' + getDateTag();
  }
  /* // Use `build` prefix for dev-mode run...
   * const isDev = global.options['dev'];
   * if (isDev) {
   *   targetFolder = [devBuildFolder, targetFolder].filter(Boolean).join('/');
   * }
   */
  return targetFolder;
}

/**
 * @param {string} targetFolder
 */
export function ensureTargetFolder(targetFolder) {
  const pathPrefix = getPathPrefix();
  const targetPath = posixPath(path.join(pathPrefix, targetFolder));
  // Ensure target path exists
  if (!fs.existsSync(targetPath)) {
    // TODO: To catch possible fs/io errors?
    fs.mkdirSync(targetPath, { recursive: true });
  }
  // TODO: Use try..catch?
}

/**
 * @param {string} targetFolder
 * @param {string} id
 * @return {TTargetFileNames}
 */
export function getTargetFileNames(targetFolder, id = '') {
  const prefix = id ? id + '-' : '';
  const postfix = '.json';
  // Create target file names...
  /** @type {TTargetFileNames} */
  const targetFileNames = {
    edges: posixPath(path.join(targetFolder, prefix + 'edges' + postfix)),
    flows: posixPath(path.join(targetFolder, prefix + 'flows' + postfix)),
    graphs: posixPath(path.join(targetFolder, prefix + 'graphs' + postfix)),
    nodes: posixPath(path.join(targetFolder, prefix + 'nodes' + postfix)),
  };
  return targetFileNames;
}

/** @param {TTargetFileNames} targetFileNames */
export function getAppUrlQuery(targetFileNames) {
  return [
    'autoLoadUrlEdges=' + encodeURIComponent(targetFileNames['edges']),
    'autoLoadUrlFlows=' + encodeURIComponent(targetFileNames['flows']),
    'autoLoadUrlGraphs=' + encodeURIComponent(targetFileNames['graphs']),
    'autoLoadUrlNodes=' + encodeURIComponent(targetFileNames['nodes']),
    'doAutoLoad=yes',
    'doAutoStart=yes',
  ].join('&');
}

/**
 */
export function getPathPrefix() {
  const isDev = global.options['dev'];
  let pathPrefix = rootPath;
  if (isDev) {
    pathPrefix = path.resolve(pathPrefix, devBuildFolder);
  }
  pathPrefix = posixPath(pathPrefix);
  return pathPrefix;
}

/** Write app data to later use in launched app.
 * @param {TAppData} appData
 * @param {TTargetFileNames} targetFileNames
 */
export function writeTempAppData(appData, targetFileNames) {
  try {
    const pathPrefix = getPathPrefix();
    // eslint-disable-next-line no-console
    console.log('Writting target files (in "' + pathPrefix + '")');
    // eslint-disable-next-line no-console
    console.log('Writting', targetFileNames['edges'], '...');
    writeJson(posixPath(path.join(pathPrefix, targetFileNames['edges'])), appData['edges']);
    // eslint-disable-next-line no-console
    console.log('Writting', targetFileNames['flows'], '...');
    writeJson(posixPath(path.join(pathPrefix, targetFileNames['flows'])), appData['flows']);
    // eslint-disable-next-line no-console
    console.log('Writting', targetFileNames['graphs'], '...');
    writeJson(posixPath(path.join(pathPrefix, targetFileNames['graphs'])), appData['graphs']);
    // eslint-disable-next-line no-console
    console.log('Writting', targetFileNames['nodes'], '...');
    writeJson(posixPath(path.join(pathPrefix, targetFileNames['nodes'])), appData['nodes']);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('accept-post-data:acceptPostData] Catched error', message, {
      error,
      targetFileNames,
    });
    debugger; // eslint-disable-line no-debugger
  } finally {
    // eslint-disable-next-line no-console
    console.log('Done');
  }
}

/** Remove previously created app data.
 * @param {string} targetFolder
 * @param {TTargetFileNames} targetFileNames
 */
export function removeTempAppData(targetFolder, targetFileNames) {
  try {
    const pathPrefix = getPathPrefix();
    const targetPath = posixPath(path.join(pathPrefix, targetFolder));
    // eslint-disable-next-line no-console
    console.log('Removing target files (in "' + pathPrefix + '")');
    // eslint-disable-next-line no-console
    console.log('Removing', targetFileNames['edges'], '...');
    fs.unlinkSync(posixPath(path.join(pathPrefix, targetFileNames['edges'])));
    // eslint-disable-next-line no-console
    console.log('Removing', targetFileNames['flows'], '...');
    fs.unlinkSync(posixPath(path.join(pathPrefix, targetFileNames['flows'])));
    // eslint-disable-next-line no-console
    console.log('Removing', targetFileNames['graphs'], '...');
    fs.unlinkSync(posixPath(path.join(pathPrefix, targetFileNames['graphs'])));
    // eslint-disable-next-line no-console
    console.log('Removing', targetFileNames['nodes'], '...');
    fs.unlinkSync(posixPath(path.join(pathPrefix, targetFileNames['nodes'])));
    // eslint-disable-next-line no-console
    console.log('Check if target folder ("' + targetPath + '") is empty...');
    const dir = fs.readdirSync(targetPath);
    if (!dir.length) {
      // eslint-disable-next-line no-console
      console.log('Removing folder "' + targetPath + '"...');
      fs.rmdirSync(targetPath);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('accept-post-data:acceptPostData] Catched error', message, {
      error,
      targetFileNames,
    });
    debugger; // eslint-disable-line no-debugger
  } finally {
    // eslint-disable-next-line no-console
    console.log('Done');
  }
}
