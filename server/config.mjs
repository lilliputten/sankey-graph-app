// @ts-check

import path from 'path';
import ip from 'ip';
import { fileURLToPath } from 'url';

// Date/time...

// NOTE: Date formats only for 'date-fn*'...
export const tagFormat = 'yyMMdd-HHmm';
export const tagFormatPrecise = 'yyMMdd-HHmmss';
export const timeFormat = 'yyyy.MM.dd, HH:mm zzz';

// Local environment...

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const currPath = path.resolve(__dirname);
export const rootPath = path.dirname(currPath);

// Network environment...

export const realIPAddress = ip.address();

// Constants...

export const browserUrlPrefix = 'http://localhost:';
export const devBuildFolder = 'build';

// Server routes...

export const acceptPostDataUrl = '/cgi-bin/accept-post-data';

// Default options...

export const defaultDataFolder = 'data';
export const defaultDataSetFolder = 'hardwood-forestry';
export const defaultTargetFolder = 'temp';
export const defaultWebPort = 8080;

// Helper's constants...

export const ipv6remove = '::ffff:';
export const ipv6localhost = '::1';
// export const localhostAddress = 'localhost';

/* TODO: Potential options...
 * uploadDir
 * replaceUploadsDir
 * useDebugStops
 */

// Server options...

export const maxAgeShort = 1000 * 60 * 1; // *ms = 1m
export const maxAgeLong = maxAgeShort * 60; // = 1h
export const maxAgeStatic = maxAgeLong; // maxAge value (ms) for caching static routes

// Express parameters...

/** @type {string[]} */
export const staticServerRoutes = [
  // TODO: Involve `dev` mode to conditionally include demo routes?
  // 'start-app-demo-post.html',
  // 'start-app-demo.js',
  // 'build.txt', // NOTE: Only for built app
  // 'favicon.ico',
];
