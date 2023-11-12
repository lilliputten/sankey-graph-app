import { hourTicks, minuteTicks, secondTicks, weekTicks } from 'src/config/constants';
import * as dates from './dates';

// Create day start from current date
const dayDate = new Date();
/* // UNUSED
 * const dayTime = dayDate.getTime();
 * const dayMilliseconds = dayDate.getMilliseconds();
 * const daySeconds = dayDate.getSeconds();
 * const dayMinutes = dayDate.getMinutes();
 * const dayHours = dayDate.getHours();
 * const dayStart =
 *   dayTime -
 *   dayHours * hourTicks -
 *   dayMinutes * minuteTicks -
 *   daySeconds * secondTicks -
 *   dayMilliseconds;
 */
const dayStart = dates.getDayStartForDate(dayDate);

describe('dates', () => {
  it('should expose object', () => {
    const type = typeof dates;
    expect(type).toBe('object');
  });

  describe('getMessageTimeStr', () => {
    it('should be a function', () => {
      const type = typeof dates.getMessageTimeStr;
      expect(type).toBe('function');
    });
    it('should return short time string for current day dates', () => {
      const time = dayStart + 2 * hourTicks + 20 * minuteTicks;
      const result = dates.getMessageTimeStr(time, dayStart);
      expect(result).toEqual('02:20');
    });
  });

  describe('getAgoStr', () => {
    it('should return short time string for current day dates', () => {
      const time = dayStart + 2 * hourTicks + 20 * minuteTicks;
      const result = dates.getAgoStr(time, dayStart);
      // const test = result.replace(/ ago$/, '').match(/\d+ \S+/g);
      expect(result).toEqual('2 hours 20 minutes ago');
    });
    it('should return some short string for last week dates', () => {
      const time = dayStart - 1 * weekTicks + 2 * hourTicks + 20 * minuteTicks + 30 * secondTicks;
      const result = dates.getAgoStr(time, dayStart);
      expect(result).toEqual('6 days 21 hours ago');
    });
  });
});
