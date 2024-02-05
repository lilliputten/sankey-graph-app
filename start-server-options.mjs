// @ts-check

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import {
  defaultDataFolder,
  defaultDataSetFolder,
  defaultTargetFolder,
  defaultWebPort,
  devBuildFolder,
} from './start-server-defaults.mjs';

// Parse options...
export const options = {};

/*
 * export const defaultOptions = {
 *   'web-port': defaultWebPort,
 * };
 */

// prettier-ignore
export const optionDefinitions = [
  // @see
  //   - https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md
  //   - https://github.com/75lb/command-line-args/blob/master/doc/API.md
  // NOTE: Curled quotes in descriptions processing by chalk parser.

  { alias: 'p', name: 'web-port', type: String, defaultValue: defaultWebPort, description: 'Web server port (default: "' + defaultWebPort + '")' },

  { name: 'demo-post', type: Boolean, description: 'Make demo POST request' },
  { name: 'demo-files', type: Boolean, description: 'Open the app with links to demo files' },

  { name: 'demo-files-data-folder', type: String, defaultValue: defaultDataFolder, description: 'Data folder name (default: "' + defaultDataFolder + '")' },
  { name: 'demo-files-data-set-folder', type: String, defaultValue: defaultDataSetFolder, description: 'Data set folder name (default: "' + defaultDataSetFolder + '")' },
  { name: 'demo-files-target-folder', type: String, defaultValue: defaultTargetFolder, description: 'Target folder name (default: "' + defaultTargetFolder + '")' },
  { name: 'demo-files-omit-date-tag', type: String, description: 'Omit date tag postfix for auto-generated target folder name (datetime module required)' },

  { alias: 'd', name: 'dev', type: Boolean, description: 'Use "public" folder prefix for demo data files and "' + devBuildFolder + '" for local web server (for non-built dev environment)' },
];

export function printUsage() {
  try {
    const sections = [
      {
        header: 'Description',
        content: 'Launch web server for the app.',
      },
      {
        header: 'Options',
        optionList: optionDefinitions.map(({ name, alias, paramName, description }) => {
          if (alias) {
            name += ', -' + alias;
          }
          const data = { name, description };
          const param = paramName;
          data.typeLabel = param ? '{underline ' + param + '}' : ' '; // NOTE: Using non-empty string for avoiding
          return data;
        }),
      },
    ];
    const usage = commandLineUsage(sections);
    // eslint-disable-next-line no-console
    console.log(usage);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Usage error:', error);
    // eslint-disable-next-line no-debugger
    debugger;
  }
  // process.exit(exitStatus)
}

/** Parse options
 * @return {Boolean} - true if application can starts
 */
export function parseOptions() {
  try {
    const parsedOptions = commandLineArgs(optionDefinitions);
    // NOTE: Ibject default options into the target options data (is it required?)
    Object.assign(options, parsedOptions);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Options parsing error:', error.message || error);
    // eslint-disable-next-line no-debugger
    debugger;
    printUsage();
  }
  if (options.help) {
    printUsage();
    return false;
  }
  return true;
}
