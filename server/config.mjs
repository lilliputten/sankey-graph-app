// @ts-check

import ip from 'ip';

// Constants...
export const browserUrlPrefix = 'http://localhost:';
export const devBuildFolder = 'build';

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

// Environment...
export const realIPAddress = ip.address();

/* TODO: Potential options...
 * uploadDir
 * replaceUploadsDir
 * useDebugStops
 */
