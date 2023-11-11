/** @desc Update build date/time tag file with current timestamp
 *  @changed 2023.04.07, 23:39
 */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { format, formatInTimeZone } = require('date-fns-tz');

const currPath = path.resolve(__dirname);
const prjPath = path.dirname(path.basename(currPath));

const configFileName = path.resolve(prjPath, 'utils', 'config.js');
const config = require(configFileName);

const defaultTimeZome = config.timeZone || '';

const tagFormat = 'yyMMdd-HHmm';
const timeFormat = 'yyyy.MM.dd, HH:mm';
const timeTzFormat = 'yyyy.MM.dd, HH:mm zzz';

// Timezone argument should be passed as '--tz={timeZone}`
const timeZone = getTzFromArgs() || defaultTimeZome; // 'Europe/Moscow', 'GMT, etc

const now = new Date();
const buildTag = formatDate(now, timeZone, tagFormat);
const buildTime = formatDate(now, timeZone, timeFormat);
const buildTzTime = formatDate(now, timeZone, timeTzFormat);

/* console.log('DEBUG', {
 *   config,
 *   configFileName,
 *   argv: process.argv,
 *   args: process.args,
 *   now,
 *   buildTag,
 *   buildTime,
 *   buildTzTime,
 *   timeZone,
 * });
 */

const timestampFileName = path.resolve(prjPath, 'build-timestamp.txt');
const timetagFileName = path.resolve(prjPath, 'build-timetag.txt');
// const versionFileName = path.resolve(prjPath, 'build-version.txt');

console.log('Updating build tag/time:', buildTag, '/', buildTzTime);

fs.writeFileSync(timetagFileName, buildTag, 'utf8');
fs.writeFileSync(timestampFileName, buildTzTime, 'utf8');

function formatDate(date, timeZone, fmt) {
  if (timeZone) {
    return formatInTimeZone(date, timeZone, fmt);
  } else {
    return format(date, fmt);
  }
}

function getTzFromArgs() {
  const args = process.argv.slice(2);
  const lookup = '--tz=';
  for (const s of args) {
    if (s.startsWith(lookup)) {
      return s.substring(lookup.length);
    }
  }
}
