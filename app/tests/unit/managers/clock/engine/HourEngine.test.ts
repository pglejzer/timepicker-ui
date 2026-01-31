import { HourEngine } from '../../../../../src/managers/clock/engine/HourEngine';

describe('HourEngine', () => {
  describe('angleToIndex', () => {
    describe('12h mode', () => {
      it('should return 12 for 0 degrees', () => {
        const index = HourEngine.angleToIndex(0, '12h', false);
        expect(index).toBe(12);
      });

      it('should return 3 for 90 degrees', () => {
        const index = HourEngine.angleToIndex(90, '12h', false);
        expect(index).toBe(3);
      });

      it('should return 6 for 180 degrees', () => {
        const index = HourEngine.angleToIndex(180, '12h', false);
        expect(index).toBe(6);
      });

      it('should return 9 for 270 degrees', () => {
        const index = HourEngine.angleToIndex(270, '12h', false);
        expect(index).toBe(9);
      });
    });

    describe('24h mode outer circle', () => {
      it('should return 12 for 0 degrees outer circle', () => {
        const index = HourEngine.angleToIndex(0, '24h', false);
        expect(index).toBe(12);
      });

      it('should return 15 for 90 degrees outer circle', () => {
        const index = HourEngine.angleToIndex(90, '24h', false);
        expect(index).toBe(3);
      });
    });

    describe('24h mode inner circle', () => {
      it('should return 0 for 0 degrees inner circle', () => {
        const index = HourEngine.angleToIndex(0, '24h', true);
        expect(index).toBe(0);
      });

      it('should return 15 for 90 degrees inner circle', () => {
        const index = HourEngine.angleToIndex(90, '24h', true);
        expect(index).toBe(15);
      });

      it('should return 18 for 180 degrees inner circle', () => {
        const index = HourEngine.angleToIndex(180, '24h', true);
        expect(index).toBe(18);
      });

      it('should return 21 for 270 degrees inner circle', () => {
        const index = HourEngine.angleToIndex(270, '24h', true);
        expect(index).toBe(21);
      });
    });
  });

  describe('indexToValue', () => {
    describe('12h mode', () => {
      it('should format single digit hours with padding', () => {
        const value = HourEngine.indexToValue(3, '12h', 'AM');
        expect(value).toBe('03');
      });

      it('should format 12 correctly', () => {
        const value = HourEngine.indexToValue(12, '12h', 'AM');
        expect(value).toBe('12');
      });

      it('should convert 0 to 12', () => {
        const value = HourEngine.indexToValue(0, '12h', 'AM');
        expect(value).toBe('12');
      });
    });

    describe('24h mode', () => {
      it('should format 0 with padding', () => {
        const value = HourEngine.indexToValue(0, '24h', '');
        expect(value).toBe('00');
      });

      it('should format 15 correctly', () => {
        const value = HourEngine.indexToValue(15, '24h', '');
        expect(value).toBe('15');
      });

      it('should format 23 correctly', () => {
        const value = HourEngine.indexToValue(23, '24h', '');
        expect(value).toBe('23');
      });
    });
  });

  describe('indexToAngle', () => {
    describe('12h mode', () => {
      it('should return 0 for index 12', () => {
        const angle = HourEngine.indexToAngle(12, '12h');
        expect(angle).toBe(0);
      });

      it('should return 90 for index 3', () => {
        const angle = HourEngine.indexToAngle(3, '12h');
        expect(angle).toBe(90);
      });

      it('should return 180 for index 6', () => {
        const angle = HourEngine.indexToAngle(6, '12h');
        expect(angle).toBe(180);
      });

      it('should return 0 for index 0', () => {
        const angle = HourEngine.indexToAngle(0, '12h');
        expect(angle).toBe(0);
      });
    });

    describe('24h mode', () => {
      it('should return 0 for index 0', () => {
        const angle = HourEngine.indexToAngle(0, '24h');
        expect(angle).toBe(0);
      });

      it('should return 90 for index 15', () => {
        const angle = HourEngine.indexToAngle(15, '24h');
        expect(angle).toBe(90);
      });

      it('should return 0 for index 12', () => {
        const angle = HourEngine.indexToAngle(12, '24h');
        expect(angle).toBe(0);
      });
    });
  });

  describe('isDisabled', () => {
    it('should return false when no disabled config', () => {
      const result = HourEngine.isDisabled('03', 'AM', null);
      expect(result).toBe(false);
    });

    it('should return true when hour is in disabled hours array', () => {
      const disabledTime = {
        hours: ['03', '04', '05'],
      };

      const result = HourEngine.isDisabled('03', 'AM', disabledTime);
      expect(result).toBe(true);
    });

    it('should return false when hour is not in disabled hours array', () => {
      const disabledTime = {
        hours: ['03', '04', '05'],
      };

      const result = HourEngine.isDisabled('10', 'AM', disabledTime);
      expect(result).toBe(false);
    });

    it('should handle numeric comparisons', () => {
      const disabledTime = {
        hours: ['3'],
      };

      const result = HourEngine.isDisabled('03', 'AM', disabledTime);
      expect(result).toBe(true);
    });

    describe('interval-based disabled time', () => {
      it('should return true when all minutes in hour are disabled by interval', () => {
        const disabledTime = {
          isInterval: true,
          intervals: ['10:00 AM-10:59 AM'],
          clockType: '12h' as const,
        };

        const result = HourEngine.isDisabled('10', 'AM', disabledTime);
        expect(result).toBe(true);
      });

      it('should return false when some minutes in hour are not disabled', () => {
        const disabledTime = {
          isInterval: true,
          intervals: ['10:00 AM-10:30 AM'],
          clockType: '12h' as const,
        };

        const result = HourEngine.isDisabled('10', 'AM', disabledTime);
        expect(result).toBe(false);
      });

      it('should handle 24h intervals', () => {
        const disabledTime = {
          isInterval: true,
          intervals: ['14:00-14:59'],
          clockType: '24h' as const,
        };

        const result = HourEngine.isDisabled('14', '', disabledTime);
        expect(result).toBe(true);
      });

      it('should return false when no intervals match', () => {
        const disabledTime = {
          isInterval: true,
          intervals: ['09:00 AM-09:30 AM'],
          clockType: '12h' as const,
        };

        const result = HourEngine.isDisabled('10', 'AM', disabledTime);
        expect(result).toBe(false);
      });
    });

    describe('range-based disabled time (12h)', () => {
      it('should return true when AM and fromType is PM', () => {
        const disabledTime = {
          rangeFromType: 'PM',
          rangeFromHour: 3,
        };

        const result = HourEngine.isDisabled('10', 'AM', disabledTime);
        expect(result).toBe(true);
      });

      it('should return false when PM and fromType is AM', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 10,
        };

        const result = HourEngine.isDisabled('03', 'PM', disabledTime);
        expect(result).toBe(false);
      });

      it('should return false when AM and fromHour is 12', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 12,
        };

        const result = HourEngine.isDisabled('10', 'AM', disabledTime);
        expect(result).toBe(false);
      });

      it('should return true when AM toHour is 12 and fromHour is not 12', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 10,
        };

        const result = HourEngine.isDisabled('12', 'AM', disabledTime);
        expect(result).toBe(true);
      });

      it('should return true when AM toHour < fromHour', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 10,
        };

        const result = HourEngine.isDisabled('08', 'AM', disabledTime);
        expect(result).toBe(true);
      });

      it('should return false when AM toHour >= fromHour', () => {
        const disabledTime = {
          rangeFromType: 'AM',
          rangeFromHour: 8,
        };

        const result = HourEngine.isDisabled('10', 'AM', disabledTime);
        expect(result).toBe(false);
      });

      it('should return false when PM and fromHour is 12', () => {
        const disabledTime = {
          rangeFromType: 'PM',
          rangeFromHour: 12,
        };

        const result = HourEngine.isDisabled('03', 'PM', disabledTime);
        expect(result).toBe(false);
      });

      it('should return true when PM toHour is 12 and fromHour is not 12', () => {
        const disabledTime = {
          rangeFromType: 'PM',
          rangeFromHour: 3,
        };

        const result = HourEngine.isDisabled('12', 'PM', disabledTime);
        expect(result).toBe(true);
      });

      it('should return true when PM toHour < fromHour', () => {
        const disabledTime = {
          rangeFromType: 'PM',
          rangeFromHour: 5,
        };

        const result = HourEngine.isDisabled('03', 'PM', disabledTime);
        expect(result).toBe(true);
      });

      it('should return false when rangeFromType is null', () => {
        const disabledTime = {
          rangeFromType: null,
          rangeFromHour: 10,
        };

        const result = HourEngine.isDisabled('03', 'AM', disabledTime);
        expect(result).toBe(false);
      });
    });
  });

  describe('findNearestValid', () => {
    it('should return same index when not disabled', () => {
      const result = HourEngine.findNearestValid(5, '12h', 'AM', null, false);
      expect(result).toBe(5);
    });

    it('should find next valid hour when current is disabled', () => {
      const disabledTime = {
        hours: ['05'],
      };

      const result = HourEngine.findNearestValid(5, '12h', 'AM', disabledTime, false);
      expect(result).not.toBe(5);
    });

    it('should work with 24h mode', () => {
      const disabledTime = {
        hours: ['15'],
      };

      const result = HourEngine.findNearestValid(15, '24h', '', disabledTime, true);
      expect(result).not.toBe(15);
    });
  });
});

