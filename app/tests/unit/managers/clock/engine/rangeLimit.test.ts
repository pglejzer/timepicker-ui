import { isHourBeforeRangeFrom, isMinuteBeforeRangeFrom } from '@/managers/clock/engine/rangeLimit';
import type { AmPmType, DisabledTimeConfig } from '@/managers/clock/types';

describe('rangeLimit', () => {
  describe('isHourBeforeRangeFrom', () => {
    describe('12h, from 10:30 AM', () => {
      const from: DisabledTimeConfig = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };
      const isBefore = (hour: string, amPm: AmPmType): boolean =>
        isHourBeforeRangeFrom(hour, amPm, from, '12h');

      it('disables an hour whose :59 is before "from"', () => {
        expect(isBefore('09', 'AM')).toBe(true);
        expect(isBefore('01', 'AM')).toBe(true);
      });

      it('keeps the "from" hour itself enabled', () => {
        expect(isBefore('10', 'AM')).toBe(false);
      });

      it('keeps later hours and the whole PM period enabled', () => {
        expect(isBefore('11', 'AM')).toBe(false);
        expect(isBefore('01', 'PM')).toBe(false);
        expect(isBefore('10', 'PM')).toBe(false);
      });

      it('treats 12 AM as hour 0', () => {
        expect(isBefore('12', 'AM')).toBe(true);
      });
    });

    describe('12h, from 1:00 PM', () => {
      const from: DisabledTimeConfig = { rangeFromType: 'PM', rangeFromHour: 1, rangeFromMinute: 0 };

      it('treats 12 PM as hour 12, the hour right before 1 PM', () => {
        expect(isHourBeforeRangeFrom('12', 'PM', from, '12h')).toBe(true);
        expect(isHourBeforeRangeFrom('11', 'AM', from, '12h')).toBe(true);
        expect(isHourBeforeRangeFrom('01', 'PM', from, '12h')).toBe(false);
      });
    });

    describe('12h, "from" on hour 12', () => {
      it('from 12 AM leaves every hour enabled', () => {
        const from: DisabledTimeConfig = { rangeFromType: 'AM', rangeFromHour: 12 };

        expect(isHourBeforeRangeFrom('12', 'AM', from, '12h')).toBe(false);
        expect(isHourBeforeRangeFrom('01', 'AM', from, '12h')).toBe(false);
        expect(isHourBeforeRangeFrom('11', 'PM', from, '12h')).toBe(false);
      });

      it('from 12 PM disables every AM hour and keeps 12 PM enabled', () => {
        const from: DisabledTimeConfig = { rangeFromType: 'PM', rangeFromHour: 12 };

        expect(isHourBeforeRangeFrom('12', 'AM', from, '12h')).toBe(true);
        expect(isHourBeforeRangeFrom('11', 'AM', from, '12h')).toBe(true);
        expect(isHourBeforeRangeFrom('12', 'PM', from, '12h')).toBe(false);
        expect(isHourBeforeRangeFrom('01', 'PM', from, '12h')).toBe(false);
      });
    });

    describe('12h without a usable period', () => {
      it('applies no limit when the "from" type is null', () => {
        const from: DisabledTimeConfig = { rangeFromType: null, rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isHourBeforeRangeFrom('01', 'AM', from, '12h')).toBe(false);
      });

      it('applies no limit when the "from" type is missing', () => {
        const from: DisabledTimeConfig = { rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isHourBeforeRangeFrom('01', 'AM', from, '12h')).toBe(false);
      });

      it('applies no limit when the current period is empty', () => {
        const from: DisabledTimeConfig = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isHourBeforeRangeFrom('01', '', from, '12h')).toBe(false);
      });
    });

    describe('24h, from 14:30', () => {
      const from: DisabledTimeConfig = { rangeFromHour: 14, rangeFromMinute: 30 };
      const isBefore = (hour: string): boolean => isHourBeforeRangeFrom(hour, '', from, '24h');

      it('disables hours whose :59 is before "from"', () => {
        expect(isBefore('00')).toBe(true);
        expect(isBefore('13')).toBe(true);
      });

      it('keeps the "from" hour and later hours enabled', () => {
        expect(isBefore('14')).toBe(false);
        expect(isBefore('15')).toBe(false);
        expect(isBefore('23')).toBe(false);
      });

      it('ignores the "from" type', () => {
        const fromWithNullType: DisabledTimeConfig = { ...from, rangeFromType: null };

        expect(isHourBeforeRangeFrom('13', '', fromWithNullType, '24h')).toBe(true);
        expect(isHourBeforeRangeFrom('14', '', fromWithNullType, '24h')).toBe(false);
      });
    });

    it('keeps the "from" hour enabled when "from" is its last minute', () => {
      const from: DisabledTimeConfig = { rangeFromHour: 10, rangeFromMinute: 59 };

      expect(isHourBeforeRangeFrom('09', '', from, '24h')).toBe(true);
      expect(isHourBeforeRangeFrom('10', '', from, '24h')).toBe(false);
    });

    it('treats a missing rangeFromMinute as the start of the "from" hour', () => {
      const from: DisabledTimeConfig = { rangeFromHour: 10 };

      expect(isHourBeforeRangeFrom('09', '', from, '24h')).toBe(true);
      expect(isHourBeforeRangeFrom('10', '', from, '24h')).toBe(false);
    });

    it('applies no limit without rangeFromHour', () => {
      const fromWithoutHour: DisabledTimeConfig = { rangeFromType: 'PM', rangeFromMinute: 30 };

      expect(isHourBeforeRangeFrom('00', '', {}, '24h')).toBe(false);
      expect(isHourBeforeRangeFrom('01', 'AM', fromWithoutHour, '12h')).toBe(false);
    });
  });

  describe('isMinuteBeforeRangeFrom', () => {
    describe('12h, from 10:30 AM', () => {
      const from: DisabledTimeConfig = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };
      const isBefore = (minute: string, hour: string, amPm: AmPmType): boolean =>
        isMinuteBeforeRangeFrom(minute, hour, amPm, from, '12h');

      it('disables minutes before "from" in the "from" hour', () => {
        expect(isBefore('00', '10', 'AM')).toBe(true);
        expect(isBefore('29', '10', 'AM')).toBe(true);
      });

      it('keeps the "from" minute and later minutes enabled', () => {
        expect(isBefore('30', '10', 'AM')).toBe(false);
        expect(isBefore('31', '10', 'AM')).toBe(false);
        expect(isBefore('59', '10', 'AM')).toBe(false);
      });

      it('disables every minute of an earlier hour, including 12 AM', () => {
        expect(isBefore('59', '09', 'AM')).toBe(true);
        expect(isBefore('00', '12', 'AM')).toBe(true);
      });

      it('keeps every minute of a later hour or the PM period enabled', () => {
        expect(isBefore('00', '11', 'AM')).toBe(false);
        expect(isBefore('15', '10', 'PM')).toBe(false);
      });
    });

    describe('12h, "from" on hour 12', () => {
      it('treats 12 AM as hour 0', () => {
        const from: DisabledTimeConfig = { rangeFromType: 'AM', rangeFromHour: 12, rangeFromMinute: 30 };

        expect(isMinuteBeforeRangeFrom('15', '12', 'AM', from, '12h')).toBe(true);
        expect(isMinuteBeforeRangeFrom('45', '12', 'AM', from, '12h')).toBe(false);
        expect(isMinuteBeforeRangeFrom('00', '01', 'AM', from, '12h')).toBe(false);
      });

      it('treats 12 PM as hour 12', () => {
        const from: DisabledTimeConfig = { rangeFromType: 'PM', rangeFromHour: 12, rangeFromMinute: 30 };

        expect(isMinuteBeforeRangeFrom('15', '12', 'PM', from, '12h')).toBe(true);
        expect(isMinuteBeforeRangeFrom('59', '11', 'AM', from, '12h')).toBe(true);
        expect(isMinuteBeforeRangeFrom('30', '12', 'PM', from, '12h')).toBe(false);
        expect(isMinuteBeforeRangeFrom('00', '01', 'PM', from, '12h')).toBe(false);
      });
    });

    describe('12h without a usable period', () => {
      it('applies no limit when the "from" type is null', () => {
        const from: DisabledTimeConfig = { rangeFromType: null, rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isMinuteBeforeRangeFrom('00', '10', 'AM', from, '12h')).toBe(false);
      });

      it('applies no limit when the current period is empty', () => {
        const from: DisabledTimeConfig = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isMinuteBeforeRangeFrom('00', '10', '', from, '12h')).toBe(false);
      });
    });

    describe('24h, from 14:30', () => {
      const from: DisabledTimeConfig = { rangeFromHour: 14, rangeFromMinute: 30 };
      const isBefore = (minute: string, hour: string): boolean =>
        isMinuteBeforeRangeFrom(minute, hour, '', from, '24h');

      it('disables minutes before "from"', () => {
        expect(isBefore('29', '14')).toBe(true);
        expect(isBefore('59', '13')).toBe(true);
      });

      it('keeps the "from" minute and everything after it enabled', () => {
        expect(isBefore('30', '14')).toBe(false);
        expect(isBefore('31', '14')).toBe(false);
        expect(isBefore('00', '15')).toBe(false);
      });
    });

    it('treats a missing rangeFromMinute as the start of the "from" hour', () => {
      const from: DisabledTimeConfig = { rangeFromHour: 10 };

      expect(isMinuteBeforeRangeFrom('59', '09', '', from, '24h')).toBe(true);
      expect(isMinuteBeforeRangeFrom('00', '10', '', from, '24h')).toBe(false);
    });

    it('applies no limit without rangeFromHour', () => {
      expect(isMinuteBeforeRangeFrom('00', '00', '', { rangeFromMinute: 30 }, '24h')).toBe(false);
    });
  });
});
