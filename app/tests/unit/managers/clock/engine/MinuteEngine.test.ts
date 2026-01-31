import { MinuteEngine } from '../../../../../src/managers/clock/engine/MinuteEngine';

describe('MinuteEngine', () => {
  describe('angleToIndex', () => {
    it('should return 0 for 0 degrees', () => {
      const index = MinuteEngine.angleToIndex(0);
      expect(index).toBe(0);
    });

    it('should return 15 for 90 degrees', () => {
      const index = MinuteEngine.angleToIndex(90);
      expect(index).toBe(15);
    });

    it('should return 30 for 180 degrees', () => {
      const index = MinuteEngine.angleToIndex(180);
      expect(index).toBe(30);
    });

    it('should return 45 for 270 degrees', () => {
      const index = MinuteEngine.angleToIndex(270);
      expect(index).toBe(45);
    });

    it('should return 0 for 360 degrees', () => {
      const index = MinuteEngine.angleToIndex(360);
      expect(index).toBe(0);
    });

    it('should round to nearest minute', () => {
      const index = MinuteEngine.angleToIndex(50);
      expect(index).toBe(8);
    });
  });

  describe('indexToValue', () => {
    it('should format 0 with padding', () => {
      const value = MinuteEngine.indexToValue(0);
      expect(value).toBe('00');
    });

    it('should format single digits with padding', () => {
      const value = MinuteEngine.indexToValue(5);
      expect(value).toBe('05');
    });

    it('should format double digits correctly', () => {
      const value = MinuteEngine.indexToValue(30);
      expect(value).toBe('30');
    });

    it('should format 59 correctly', () => {
      const value = MinuteEngine.indexToValue(59);
      expect(value).toBe('59');
    });
  });

  describe('indexToAngle', () => {
    it('should return 0 for index 0', () => {
      const angle = MinuteEngine.indexToAngle(0);
      expect(angle).toBe(0);
    });

    it('should return 90 for index 15', () => {
      const angle = MinuteEngine.indexToAngle(15);
      expect(angle).toBe(90);
    });

    it('should return 180 for index 30', () => {
      const angle = MinuteEngine.indexToAngle(30);
      expect(angle).toBe(180);
    });

    it('should return 354 for index 59', () => {
      const angle = MinuteEngine.indexToAngle(59);
      expect(angle).toBe(354);
    });

    it('should wrap at 60', () => {
      const angle = MinuteEngine.indexToAngle(60);
      expect(angle).toBe(0);
    });
  });

  describe('isDisabled', () => {
    it('should return false when no disabled config', () => {
      const result = MinuteEngine.isDisabled('30', '10', 'AM', null, '12h');
      expect(result).toBe(false);
    });

    it('should return true when minute is in disabled minutes array', () => {
      const disabledTime = {
        minutes: ['30', '45'],
      };

      const result = MinuteEngine.isDisabled('30', '10', 'AM', disabledTime, '12h');
      expect(result).toBe(true);
    });

    it('should return false when minute is not in disabled array', () => {
      const disabledTime = {
        minutes: ['30', '45'],
      };

      const result = MinuteEngine.isDisabled('15', '10', 'AM', disabledTime, '12h');
      expect(result).toBe(false);
    });

    it('should handle numeric comparisons', () => {
      const disabledTime = {
        minutes: ['5'],
      };

      const result = MinuteEngine.isDisabled('05', '10', 'AM', disabledTime, '12h');
      expect(result).toBe(true);
    });

    it('should work with 24h clock type', () => {
      const disabledTime = {
        minutes: ['30'],
      };

      const result = MinuteEngine.isDisabled('30', '14', '', disabledTime, '24h');
      expect(result).toBe(true);
    });

    describe('interval-based disabled time', () => {
      it('should return true when time is within interval (12h)', () => {
        const disabledTime = {
          isInterval: true,
          intervals: ['10:00 AM-10:45 AM'],
        };

        const result = MinuteEngine.isDisabled('30', '10', 'AM', disabledTime, '12h');
        expect(result).toBe(true);
      });

      it('should return false when time is outside interval (12h)', () => {
        const disabledTime = {
          isInterval: true,
          intervals: ['10:00 AM-10:30 AM'],
        };

        const result = MinuteEngine.isDisabled('45', '10', 'AM', disabledTime, '12h');
        expect(result).toBe(false);
      });

      it('should return true when time is within interval (24h)', () => {
        const disabledTime = {
          isInterval: true,
          intervals: ['14:00-14:45'],
        };

        const result = MinuteEngine.isDisabled('30', '14', '', disabledTime, '24h');
        expect(result).toBe(true);
      });

      it('should return false when no intervals match', () => {
        const disabledTime = {
          isInterval: true,
          intervals: ['09:00 AM-09:30 AM'],
        };

        const result = MinuteEngine.isDisabled('30', '10', 'AM', disabledTime, '12h');
        expect(result).toBe(false);
      });

      it('should return false when intervals array is empty', () => {
        const disabledTime = {
          isInterval: true,
          intervals: undefined,
        };

        const result = MinuteEngine.isDisabled('30', '10', 'AM', disabledTime, '12h');
        expect(result).toBe(false);
      });
    });

    describe('range-based disabled time (12h)', () => {
      it('should return true when AM and fromType is PM', () => {
        const disabledTime = {
          rangeFromType: 'PM',
          rangeFromHour: 3,
        };

        const result = MinuteEngine.isDisabled('30', '10', 'AM', disabledTime, '12h');
        expect(result).toBe(true);
      });

      it('should return false when PM and fromType is AM', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 10,
        };

        const result = MinuteEngine.isDisabled('30', '10', 'PM', disabledTime, '12h');
        expect(result).toBe(false);
      });

      it('should return true when same hour and minute < fromMinute', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 10,
          minutes: ['29'],
        };

        const result = MinuteEngine.isDisabled('15', '10', 'AM', disabledTime, '12h');
        expect(result).toBe(true);
      });

      it('should return false when same hour and minute >= fromMinute', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 10,
          minutes: ['29'],
        };

        const result = MinuteEngine.isDisabled('35', '10', 'AM', disabledTime, '12h');
        expect(result).toBe(false);
      });

      it('should return false when rangeFromType is null', () => {
        const disabledTime = {
          rangeFromType: null,
          rangeFromHour: 10,
        };

        const result = MinuteEngine.isDisabled('30', '10', 'AM', disabledTime, '12h');
        expect(result).toBe(false);
      });

      it('should handle hour 12 correctly', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 12,
          minutes: ['29'],
        };

        const result = MinuteEngine.isDisabled('15', '12', 'AM', disabledTime, '12h');
        expect(result).toBe(true);
      });
    });
  });

  describe('findNearestValid', () => {
    it('should return same index when not disabled', () => {
      const result = MinuteEngine.findNearestValid(30, '10', 'AM', null, '12h');
      expect(result).toBe(30);
    });

    it('should find next valid minute when current is disabled', () => {
      const disabledTime = {
        minutes: ['30'],
      };

      const result = MinuteEngine.findNearestValid(30, '10', 'AM', disabledTime, '12h');
      expect(result).not.toBe(30);
    });

    it('should search both directions', () => {
      const disabledTime = {
        minutes: ['30', '31'],
      };

      const result = MinuteEngine.findNearestValid(30, '10', 'AM', disabledTime, '12h');
      expect(result).toBe(29);
    });

    it('should wrap around at boundaries', () => {
      const disabledTime = {
        minutes: ['59'],
      };

      const result = MinuteEngine.findNearestValid(59, '10', 'AM', disabledTime, '12h');
      expect(result).not.toBe(59);
    });
  });
});

