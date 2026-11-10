import {
  isHourBeforeRangeFrom,
  isMinuteBeforeRangeFrom,
  isSecondBeforeRangeFrom,
  toRangeFromLimit,
  type RangeFromLimit,
} from '@/utils/time/rangeLimit';

describe('rangeLimit', () => {
  describe('isHourBeforeRangeFrom', () => {
    describe('12h, from 10:30 AM', () => {
      const from: RangeFromLimit = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };
      const isBefore = (hour: string, amPm: string): boolean =>
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
      const from: RangeFromLimit = { rangeFromType: 'PM', rangeFromHour: 1, rangeFromMinute: 0 };

      it('treats 12 PM as hour 12, the hour right before 1 PM', () => {
        expect(isHourBeforeRangeFrom('12', 'PM', from, '12h')).toBe(true);
        expect(isHourBeforeRangeFrom('11', 'AM', from, '12h')).toBe(true);
        expect(isHourBeforeRangeFrom('01', 'PM', from, '12h')).toBe(false);
      });
    });

    describe('12h, "from" on hour 12', () => {
      it('from 12 AM leaves every hour enabled', () => {
        const from: RangeFromLimit = { rangeFromType: 'AM', rangeFromHour: 12 };

        expect(isHourBeforeRangeFrom('12', 'AM', from, '12h')).toBe(false);
        expect(isHourBeforeRangeFrom('01', 'AM', from, '12h')).toBe(false);
        expect(isHourBeforeRangeFrom('11', 'PM', from, '12h')).toBe(false);
      });

      it('from 12 PM disables every AM hour and keeps 12 PM enabled', () => {
        const from: RangeFromLimit = { rangeFromType: 'PM', rangeFromHour: 12 };

        expect(isHourBeforeRangeFrom('12', 'AM', from, '12h')).toBe(true);
        expect(isHourBeforeRangeFrom('11', 'AM', from, '12h')).toBe(true);
        expect(isHourBeforeRangeFrom('12', 'PM', from, '12h')).toBe(false);
        expect(isHourBeforeRangeFrom('01', 'PM', from, '12h')).toBe(false);
      });
    });

    describe('12h without a usable period', () => {
      it('applies no limit when the "from" type is null', () => {
        const from: RangeFromLimit = { rangeFromType: null, rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isHourBeforeRangeFrom('01', 'AM', from, '12h')).toBe(false);
      });

      it('applies no limit when the "from" type is missing', () => {
        const from: RangeFromLimit = { rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isHourBeforeRangeFrom('01', 'AM', from, '12h')).toBe(false);
      });

      it('applies no limit when the current period is empty', () => {
        const from: RangeFromLimit = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isHourBeforeRangeFrom('01', '', from, '12h')).toBe(false);
      });

      it.each([null, undefined])('applies no limit when the current period is %p', (period) => {
        const from: RangeFromLimit = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isHourBeforeRangeFrom('01', period, from, '12h')).toBe(false);
      });
    });

    describe('24h, from 14:30', () => {
      const from: RangeFromLimit = { rangeFromHour: 14, rangeFromMinute: 30 };
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
        const fromWithNullType: RangeFromLimit = { ...from, rangeFromType: null };

        expect(isHourBeforeRangeFrom('13', '', fromWithNullType, '24h')).toBe(true);
        expect(isHourBeforeRangeFrom('14', '', fromWithNullType, '24h')).toBe(false);
      });

      it('ignores the period', () => {
        expect(isHourBeforeRangeFrom('13', null, from, '24h')).toBe(true);
        expect(isHourBeforeRangeFrom('14', undefined, from, '24h')).toBe(false);
      });
    });

    it('keeps the "from" hour enabled when "from" is its last minute', () => {
      const from: RangeFromLimit = { rangeFromHour: 10, rangeFromMinute: 59 };

      expect(isHourBeforeRangeFrom('09', '', from, '24h')).toBe(true);
      expect(isHourBeforeRangeFrom('10', '', from, '24h')).toBe(false);
    });

    it('treats a missing rangeFromMinute as the start of the "from" hour', () => {
      const from: RangeFromLimit = { rangeFromHour: 10 };

      expect(isHourBeforeRangeFrom('09', '', from, '24h')).toBe(true);
      expect(isHourBeforeRangeFrom('10', '', from, '24h')).toBe(false);
    });

    it('applies no limit without rangeFromHour', () => {
      const fromWithoutHour: RangeFromLimit = { rangeFromType: 'PM', rangeFromMinute: 30 };

      expect(isHourBeforeRangeFrom('00', '', {}, '24h')).toBe(false);
      expect(isHourBeforeRangeFrom('01', 'AM', fromWithoutHour, '12h')).toBe(false);
    });
  });

  describe('isMinuteBeforeRangeFrom', () => {
    describe('12h, from 10:30 AM', () => {
      const from: RangeFromLimit = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };
      const isBefore = (minute: string, hour: string, amPm: string): boolean =>
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
        const from: RangeFromLimit = { rangeFromType: 'AM', rangeFromHour: 12, rangeFromMinute: 30 };

        expect(isMinuteBeforeRangeFrom('15', '12', 'AM', from, '12h')).toBe(true);
        expect(isMinuteBeforeRangeFrom('45', '12', 'AM', from, '12h')).toBe(false);
        expect(isMinuteBeforeRangeFrom('00', '01', 'AM', from, '12h')).toBe(false);
      });

      it('treats 12 PM as hour 12', () => {
        const from: RangeFromLimit = { rangeFromType: 'PM', rangeFromHour: 12, rangeFromMinute: 30 };

        expect(isMinuteBeforeRangeFrom('15', '12', 'PM', from, '12h')).toBe(true);
        expect(isMinuteBeforeRangeFrom('59', '11', 'AM', from, '12h')).toBe(true);
        expect(isMinuteBeforeRangeFrom('30', '12', 'PM', from, '12h')).toBe(false);
        expect(isMinuteBeforeRangeFrom('00', '01', 'PM', from, '12h')).toBe(false);
      });
    });

    describe('12h without a usable period', () => {
      it('applies no limit when the "from" type is null', () => {
        const from: RangeFromLimit = { rangeFromType: null, rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isMinuteBeforeRangeFrom('00', '10', 'AM', from, '12h')).toBe(false);
      });

      it('applies no limit when the current period is empty', () => {
        const from: RangeFromLimit = { rangeFromType: 'AM', rangeFromHour: 10, rangeFromMinute: 30 };

        expect(isMinuteBeforeRangeFrom('00', '10', '', from, '12h')).toBe(false);
      });
    });

    describe('24h, from 14:30', () => {
      const from: RangeFromLimit = { rangeFromHour: 14, rangeFromMinute: 30 };
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
      const from: RangeFromLimit = { rangeFromHour: 10 };

      expect(isMinuteBeforeRangeFrom('59', '09', '', from, '24h')).toBe(true);
      expect(isMinuteBeforeRangeFrom('00', '10', '', from, '24h')).toBe(false);
    });

    it('applies no limit without rangeFromHour', () => {
      expect(isMinuteBeforeRangeFrom('00', '00', '', { rangeFromMinute: 30 }, '24h')).toBe(false);
    });
  });

  describe('isSecondBeforeRangeFrom', () => {
    describe('12h, from 10:30:15 AM', () => {
      const from: RangeFromLimit = {
        rangeFromType: 'AM',
        rangeFromHour: 10,
        rangeFromMinute: 30,
        rangeFromSecond: 15,
      };
      const isBefore = (second: string, minute: string, hour: string, amPm: string): boolean =>
        isSecondBeforeRangeFrom(second, minute, hour, amPm, from, '12h');

      it('disables seconds before "from" inside the "from" minute', () => {
        expect(isBefore('00', '30', '10', 'AM')).toBe(true);
        expect(isBefore('14', '30', '10', 'AM')).toBe(true);
      });

      it('keeps the "from" second and later seconds enabled', () => {
        expect(isBefore('15', '30', '10', 'AM')).toBe(false);
        expect(isBefore('59', '30', '10', 'AM')).toBe(false);
      });

      it('disables every second of an earlier minute and keeps every second of a later one', () => {
        expect(isBefore('59', '29', '10', 'AM')).toBe(true);
        expect(isBefore('00', '31', '10', 'AM')).toBe(false);
      });

      it('keeps the PM period enabled', () => {
        expect(isBefore('00', '00', '10', 'PM')).toBe(false);
      });
    });

    it('treats a missing rangeFromSecond as the start of the "from" minute', () => {
      const from: RangeFromLimit = { rangeFromHour: 10, rangeFromMinute: 30 };

      expect(isSecondBeforeRangeFrom('59', '29', '10', '', from, '24h')).toBe(true);
      expect(isSecondBeforeRangeFrom('00', '30', '10', '', from, '24h')).toBe(false);
    });

    it('applies no limit without rangeFromHour or a usable 12h period', () => {
      expect(isSecondBeforeRangeFrom('00', '00', '00', '', { rangeFromMinute: 30 }, '24h')).toBe(false);
      expect(
        isSecondBeforeRangeFrom('00', '00', '01', 'AM', { rangeFromHour: 10, rangeFromType: null }, '12h'),
      ).toBe(false);
    });
  });

  describe('toRangeFromLimit', () => {
    it('returns null for a missing limit', () => {
      expect(toRangeFromLimit(null)).toBeNull();
      expect(toRangeFromLimit(undefined)).toBeNull();
    });

    it('takes fromMinute, else the minute after the last blocked one', () => {
      expect(toRangeFromLimit({ hours: [], minutes: ['00', '01'], fromHour: 9, fromType: 'AM' })).toEqual({
        rangeFromType: 'AM',
        rangeFromHour: 9,
        rangeFromMinute: 2,
        rangeFromSecond: undefined,
      });
      expect(
        toRangeFromLimit({
          hours: [],
          minutes: ['00'],
          seconds: ['00', '01', '02'],
          fromHour: 9,
          fromMinute: 30,
        }),
      ).toEqual(expect.objectContaining({ rangeFromMinute: 30, rangeFromSecond: 3 }));
    });

    it('leaves the minute and second unset when nothing is blocked', () => {
      expect(toRangeFromLimit({ hours: [], minutes: [], fromHour: 9 })).toEqual({
        rangeFromType: undefined,
        rangeFromHour: 9,
        rangeFromMinute: undefined,
        rangeFromSecond: undefined,
      });
    });

    it('produces a limit the before-From rules accept', () => {
      const limit = toRangeFromLimit({ hours: [], minutes: ['00', '01', '02'], fromHour: 14 });

      expect(limit).not.toBeNull();
      expect(isMinuteBeforeRangeFrom('02', '14', '', limit as RangeFromLimit, '24h')).toBe(true);
      expect(isMinuteBeforeRangeFrom('03', '14', '', limit as RangeFromLimit, '24h')).toBe(false);
    });
  });
});
