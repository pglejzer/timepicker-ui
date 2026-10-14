import { MinuteEngine } from '@/managers/clock/engine/MinuteEngine';
import type { AmPmType, DisabledTimeConfig } from '@/managers/clock/types';
import { buildToFaceDisabledTime } from './range-to-face-helpers';

describe('MinuteEngine on the range "to" face with disabled intervals', () => {
  describe('12h, from 10:15 AM, intervals 10:30-10:45 AM and 11:30-11:45 AM', () => {
    let disabledTime: DisabledTimeConfig;

    beforeAll(() => {
      disabledTime = buildToFaceDisabledTime({
        clockType: '12h',
        from: { hour: '10', minutes: '15', type: 'AM' },
        intervals: ['10:30 AM - 10:45 AM', '11:30 AM - 11:45 AM'],
      });
    });

    const isDisabled = (minute: string, hour: string, amPm: AmPmType): boolean =>
      MinuteEngine.isDisabled(minute, hour, amPm, disabledTime, '12h');

    it('disables a minute after "from" that falls inside an interval in the same hour', () => {
      expect(isDisabled('35', '10', 'AM')).toBe(true);
    });

    it('disables a minute after "from" that falls inside an interval in a later hour', () => {
      expect(isDisabled('40', '11', 'AM')).toBe(true);
    });

    it('disables a minute before "from" that is outside every interval', () => {
      expect(isDisabled('05', '10', 'AM')).toBe(true);
    });

    it('keeps minutes after "from" and outside every interval enabled', () => {
      expect(isDisabled('20', '10', 'AM')).toBe(false);
      expect(isDisabled('05', '11', 'AM')).toBe(false);
      expect(isDisabled('35', '10', 'PM')).toBe(false);
    });
  });

  describe('24h, from 10:15, intervals 10:30-10:45 and 11:30-11:45', () => {
    let disabledTime: DisabledTimeConfig;

    beforeAll(() => {
      disabledTime = buildToFaceDisabledTime({
        clockType: '24h',
        from: { hour: '10', minutes: '15' },
        intervals: ['10:30 - 10:45', '11:30 - 11:45'],
      });
    });

    const isDisabled = (minute: string, hour: string): boolean =>
      MinuteEngine.isDisabled(minute, hour, '', disabledTime, '24h');

    it('disables a minute after "from" that falls inside an interval in the same hour', () => {
      expect(isDisabled('35', '10')).toBe(true);
    });

    it('disables a minute after "from" that falls inside an interval in a later hour', () => {
      expect(isDisabled('40', '11')).toBe(true);
    });

    it('disables a minute before "from" that is outside every interval', () => {
      expect(isDisabled('05', '10')).toBe(true);
    });

    it('keeps minutes after "from" and outside every interval enabled', () => {
      expect(isDisabled('20', '10')).toBe(false);
      expect(isDisabled('05', '11')).toBe(false);
    });
  });
});
