/** @module strings
 *  @description Strings utilities
 *  @since 2023.02.01, 00:37
 *  @changed 2023.02.17, 18:05
 */

import { format, Duration, intervalToDuration } from 'date-fns';

import {
  dateTimeFormat,
  hourTicks,
  minuteTicks,
  secondTicks,
  timeFormat,
} from 'src/config/constants';

export function formatIsoDateString(dateStr: string, formatStr?: string): string {
  if (!formatStr) {
    formatStr = dateTimeFormat;
  }
  // XXX: Is it bug? Eg: '0012-11-16T16:31:15Z'? -> Change it to 20XX. Is it correct?
  if (dateStr.startsWith('00')) {
    dateStr = dateStr.replace(/^00/, '20');
  }
  const date = new Date(dateStr);
  return format(date, formatStr);
}

function getNumeralPair(value: number | undefined, unitName: string): string {
  if (!value) {
    return '';
  }
  if (value > 1) {
    unitName += 's';
  }
  return String(value) + ' ' + unitName;
}

interface DurationOpts {
  years?: boolean;
  months?: boolean;
  weeks?: boolean;
  days?: boolean;
  hours?: boolean;
  minutes?: boolean;
  seconds?: boolean;
  maxEntries?: number;
}

export function getDurationStringForData(d: Duration, opt: DurationOpts = {}): string | undefined {
  /* duration object:
   * years : 0
   * months : 0
   * weeks : 0
   * days : 0
   * hours : 0
   * minutes : 0
   * seconds : 6
   */
  const { years, months, weeks, days, hours, minutes, seconds } = d;
  const fullList = [
    opt.years !== false && getNumeralPair(years, 'year'),
    opt.months !== false && getNumeralPair(months, 'month'),
    // opt.weeks === true && getNumeralPair(weeks, 'week'), // OPPOSITE: Only if true!
    opt.weeks !== false && getNumeralPair(weeks, 'week'),
    opt.days !== false && getNumeralPair(days, 'day'),
    opt.hours !== false && getNumeralPair(hours, 'hour'),
    opt.minutes !== false && getNumeralPair(minutes, 'minute'),
    opt.seconds !== false && getNumeralPair(seconds, 'second'),
  ].filter(Boolean);
  const list = opt.maxEntries ? fullList.slice(0, opt.maxEntries) : fullList;
  return list.join(' ');
}

export function getDurationString(start?: number, end?: number): string | undefined {
  const hasTimes = !!(end && start);
  if (!hasTimes) {
    return undefined;
  }
  const d = intervalToDuration({ start, end });
  return getDurationStringForData(d);
}

export function getMessageTimeStr(time: number, now?: number) {
  if (now == null) {
    now = Date.now();
  }
  const d = intervalToDuration({ start: time, end: now });
  const agoDuration = getDurationStringForData(d, { hours: false, minutes: false, seconds: false });
  const date = new Date(time);
  const timeStr = format(date, timeFormat);
  const agoStr = agoDuration && agoDuration + ' ago';
  return [timeStr, agoStr].filter(Boolean).join(', ');
}

export function getAgoStr(time: number, now?: number) {
  if (now == null) {
    now = Date.now();
  }
  const d = intervalToDuration({ start: time, end: now });
  const agoDuration = getDurationStringForData(d, { maxEntries: 2 }); // , { seconds: false });
  // const date = new Date(time);
  // const timeStr = format(date, timeFormat);
  // return [timeStr, agoStr].filter(Boolean).join(', ');
  return agoDuration ? agoDuration + ' ago' : 'now';
  // TODO: To make shorter human-readable period strings, like 'yesterday', '2 weeks ago', 'year ago' etc.
}

export function getDayStartForDate(date: Date): number {
  const time = date.getTime();
  const milliseconds = date.getMilliseconds();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayStart =
    time - hours * hourTicks - minutes * minuteTicks - seconds * secondTicks - milliseconds;
  return dayStart;
}
export function getDayStart(time: number): number {
  const date = new Date(time);
  return getDayStartForDate(date);
}
