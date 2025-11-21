import { getInputValue, handleValueAndCheck } from '../../../src/utils/input';

describe('utils/input', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    input.type = 'text';
  });

  describe('getInputValue', () => {
    it('should return default 12h values for empty input', () => {
      input.value = '';
      const result = getInputValue(input, '12h');

      expect(result).toEqual({
        hour: '12',
        minutes: '00',
        type: 'PM',
      });
    });

    it('should return default 24h values for empty input', () => {
      input.value = '';
      const result = getInputValue(input, '24h');

      expect(result).toEqual({
        hour: '12',
        minutes: '00',
        type: undefined,
      });
    });

    it('should parse valid 12h time', () => {
      input.value = '10:30 AM';
      const result = getInputValue(input, '12h');

      expect(result).toEqual({
        hour: '10',
        minutes: '30',
        type: 'AM',
      });
    });

    it('should parse valid 24h time', () => {
      input.value = '14:45';
      const result = getInputValue(input, '24h');

      expect(result).toEqual({
        hour: '14',
        minutes: '45',
        type: undefined,
      });
    });

    it('should pad single digit hours and minutes', () => {
      input.value = '5:3 AM';
      const result = getInputValue(input, '12h');

      expect(result).toEqual({
        hour: '05',
        minutes: '03',
        type: 'AM',
      });
    });

    it('should detect invalid hour digits', () => {
      input.value = '123:30 AM';
      const result = getInputValue(input, '12h');

      expect(result.error).toBe('Invalid input: too many digits.');
      expect(result.currentHour).toBe('123');
    });

    it('should detect invalid minute digits', () => {
      input.value = '10:300 AM';
      const result = getInputValue(input, '12h');

      expect(result.error).toBe('Invalid input: too many digits.');
      expect(result.currentMin).toBe('300');
    });

    it('should detect letters in time', () => {
      input.value = '10a:30 AM';
      const result = getInputValue(input, '12h');

      expect(result.error).toBe('Input contains invalid letters.');
    });

    it('should detect invalid AM/PM format', () => {
      input.value = '10:30 XM';
      const result = getInputValue(input, '12h');

      expect(result.error).toContain('Invalid AM/PM format');
      expect(result.currentType).toBe('XM');
    });

    it('should detect invalid hour range for 12h', () => {
      input.value = '13:30 AM';
      const result = getInputValue(input, '12h');

      expect(result.error).toBe('Invalid 12h time.');
      expect(result.currentHour).toBe(13);
    });

    it('should detect invalid hour range for 24h', () => {
      input.value = '25:30';
      const result = getInputValue(input, '24h');

      expect(result.error).toBe('Invalid 24h time.');
      expect(result.currentHour).toBe(25);
    });

    it('should detect invalid minute range', () => {
      input.value = '10:60 AM';
      const result = getInputValue(input, '12h');

      expect(result.error).toBe('Invalid 12h time.');
      expect(result.currentMin).toBe(60);
    });

    describe('currentTime boolean', () => {
      it.skip('should use current time when currentTime is true', () => {
        input.value = '';
        const result = getInputValue(input, '12h', true);

        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
        expect(result.type).toBeDefined();
      });
    });

    describe('currentTime object', () => {
      it('should use specific date from currentTime.time', () => {
        const testDate = new Date('2023-05-15T14:30:00');
        input.value = '';
        const result = getInputValue(input, '12h', {
          time: testDate,
          locales: 'en-US',
        });

        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
      });

      it('should use locales setting', () => {
        const testDate = new Date('2023-05-15T14:30:00');
        input.value = '';
        const result = getInputValue(input, '12h', {
          time: testDate,
          locales: 'en-GB',
        });

        expect(result).toBeDefined();
      });

      it('should handle preventClockType option', () => {
        const testDate = new Date('2023-05-15T14:30:00');
        input.value = '';
        const result = getInputValue(
          input,
          '12h',
          {
            time: testDate,
            preventClockType: true,
          },
          true,
        );

        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
      });
    });

    it('should return default for null input', () => {
      const result = getInputValue(null as unknown as HTMLInputElement, '12h');

      expect(result).toEqual({
        hour: '12',
        minutes: '00',
        type: 'PM',
      });
    });
  });

  describe('handleValueAndCheck', () => {
    describe('hour validation', () => {
      it('should validate 12h hour range', () => {
        expect(handleValueAndCheck('1', 'hour', '12h')).toBe(true);
        expect(handleValueAndCheck('12', 'hour', '12h')).toBe(true);
        expect(handleValueAndCheck('0', 'hour', '12h')).toBe(false);
        expect(handleValueAndCheck('13', 'hour', '12h')).toBe(false);
      });

      it('should validate 24h hour range', () => {
        expect(handleValueAndCheck('0', 'hour', '24h')).toBe(true);
        expect(handleValueAndCheck('23', 'hour', '24h')).toBe(true);
        expect(handleValueAndCheck('24', 'hour', '24h')).toBe(false);
        expect(handleValueAndCheck('-1', 'hour', '24h')).toBe(false);
      });

      it('should handle numeric input', () => {
        expect(handleValueAndCheck(5, 'hour', '12h')).toBe(true);
        expect(handleValueAndCheck(15, 'hour', '24h')).toBe(true);
      });
    });

    describe('minutes validation', () => {
      it('should validate minute range', () => {
        expect(handleValueAndCheck('0', 'minutes')).toBe(true);
        expect(handleValueAndCheck('30', 'minutes')).toBe(true);
        expect(handleValueAndCheck('59', 'minutes')).toBe(true);
        expect(handleValueAndCheck('60', 'minutes')).toBe(false);
        expect(handleValueAndCheck('-1', 'minutes')).toBe(false);
      });
    });

    describe('invalid input', () => {
      it('should return false for NaN', () => {
        expect(handleValueAndCheck('abc', 'hour')).toBe(false);
        expect(handleValueAndCheck('xyz', 'minutes')).toBe(false);
      });

      it.skip('should return false for null', () => {
        expect(handleValueAndCheck(null, 'hour')).toBe(false);
        expect(handleValueAndCheck(null, 'minutes')).toBe(false);
      });

      it('should return undefined for invalid type', () => {
        expect(handleValueAndCheck('10', 'invalid' as 'hour')).toBeUndefined();
      });
    });
  });
});

