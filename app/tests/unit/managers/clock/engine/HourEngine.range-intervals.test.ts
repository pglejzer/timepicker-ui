import { HourEngine } from '@/managers/clock/engine/HourEngine';
import type { AmPmType, DisabledTimeConfig } from '@/managers/clock/types';
import { buildToFaceDisabledTime } from './range-to-face-helpers';

describe('HourEngine on the range "to" face with disabled intervals', () => {
  describe('12h, from 10:15 AM, intervals 11:00-11:59 AM and 01:15-01:59 PM', () => {
    let disabledTime: DisabledTimeConfig;

    beforeAll(() => {
      disabledTime = buildToFaceDisabledTime({
        clockType: '12h',
        from: { hour: '10', minutes: '15', type: 'AM' },
        intervals: ['11:00 AM - 11:59 AM', '01:15 PM - 01:59 PM'],
      });
    });

    const isDisabled = (hour: string, amPm: AmPmType): boolean =>
      HourEngine.isDisabled(hour, amPm, disabledTime, '12h');

    it('disables an hour after "from" that an interval covers completely', () => {
      expect(isDisabled('11', 'AM')).toBe(true);
    });

    it('disables an hour before "from" that is outside every interval', () => {
      expect(isDisabled('09', 'AM')).toBe(true);
    });

    it('keeps an hour after "from" enabled while part of it is outside every interval', () => {
      expect(isDisabled('01', 'PM')).toBe(false);
      expect(isDisabled('11', 'PM')).toBe(false);
    });
  });

  describe('24h, from 10:15, intervals 11:00-11:59 and 13:15-13:59', () => {
    let disabledTime: DisabledTimeConfig;

    beforeAll(() => {
      disabledTime = buildToFaceDisabledTime({
        clockType: '24h',
        from: { hour: '10', minutes: '15' },
        intervals: ['11:00 - 11:59', '13:15 - 13:59'],
      });
    });

    const isDisabled = (hour: string): boolean => HourEngine.isDisabled(hour, '', disabledTime, '24h');

    it('disables an hour after "from" that an interval covers completely', () => {
      expect(isDisabled('11')).toBe(true);
    });

    it('disables an hour before "from" that is outside every interval', () => {
      expect(isDisabled('09')).toBe(true);
    });

    it('keeps an hour after "from" enabled while part of it is outside every interval', () => {
      expect(isDisabled('13')).toBe(false);
      expect(isDisabled('14')).toBe(false);
    });
  });
});
