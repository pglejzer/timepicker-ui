import { getInputValue, handleValueAndCheck } from '../../../src/utils/input';

describe('input utils', () => {
  describe('getInputValue', () => {
    const createInput = (value: string): HTMLInputElement => {
      const input = document.createElement('input');
      input.value = value;
      return input;
    };

    describe('with null input', () => {
      it('should return default values when input is null', () => {
        const result = getInputValue(null as unknown as HTMLInputElement, '12h');
        expect(result).toEqual({ hour: '12', minutes: '00', type: 'PM' });
      });
    });

    describe('with empty input', () => {
      it('should return default 12h values when no value and no currentTime', () => {
        const input = createInput('');
        const result = getInputValue(input, '12h');
        expect(result).toEqual({ hour: '12', minutes: '00', type: 'PM' });
      });

      it('should return default 24h values when no value and no currentTime', () => {
        const input = createInput('');
        const result = getInputValue(input, '24h');
        expect(result).toEqual({ hour: '12', minutes: '00', type: undefined });
      });
    });

    describe('with currentTime as boolean', () => {
      it('should use current time when currentTime is true', () => {
        const input = createInput('');
        const result = getInputValue(input, '24h', true);
        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
      });

      it('should parse 12h format from locale time', () => {
        const input = createInput('');
        const result = getInputValue(input, '12h', true);
        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
      });
    });

    describe('with currentTime as object', () => {
      it('should use provided time object', () => {
        const input = createInput('');
        const testDate = new Date('2024-01-15T14:30:00');
        const result = getInputValue(input, '24h', { time: testDate });
        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
      });

      it('should use locale when provided', () => {
        const input = createInput('');
        const testDate = new Date('2024-01-15T14:30:00');
        const result = getInputValue(input, '12h', { time: testDate, locales: 'en-US' });
        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
      });

      it('should handle preventClockType option', () => {
        const input = createInput('');
        const testDate = new Date('2024-01-15T14:30:00');
        const result = getInputValue(input, '24h', { time: testDate, preventClockType: true }, true);
        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
      });

      it('should default to current date when time is undefined', () => {
        const input = createInput('');
        const result = getInputValue(input, '12h', { locales: 'en-US' });
        expect(result.hour).toBeDefined();
        expect(result.minutes).toBeDefined();
      });
    });

    describe('with valid 12h input', () => {
      it('should parse "9:30 AM"', () => {
        const input = createInput('9:30 AM');
        const result = getInputValue(input, '12h');
        expect(result.hour).toBe('09');
        expect(result.minutes).toBe('30');
        expect(result.type).toBe('AM');
        expect(result.error).toBeUndefined();
      });

      it('should parse "12:00 PM"', () => {
        const input = createInput('12:00 PM');
        const result = getInputValue(input, '12h');
        expect(result.hour).toBe('12');
        expect(result.minutes).toBe('00');
        expect(result.type).toBe('PM');
        expect(result.error).toBeUndefined();
      });
    });

    describe('with valid 24h input', () => {
      it('should parse "09:30"', () => {
        const input = createInput('09:30');
        const result = getInputValue(input, '24h');
        expect(result.hour).toBe('09');
        expect(result.minutes).toBe('30');
        expect(result.type).toBeUndefined();
        expect(result.error).toBeUndefined();
      });

      it('should parse "23:59"', () => {
        const input = createInput('23:59');
        const result = getInputValue(input, '24h');
        expect(result.hour).toBe('23');
        expect(result.minutes).toBe('59');
        expect(result.error).toBeUndefined();
      });

      it('should parse "00:00"', () => {
        const input = createInput('00:00');
        const result = getInputValue(input, '24h');
        expect(result.hour).toBe('00');
        expect(result.minutes).toBe('00');
        expect(result.error).toBeUndefined();
      });
    });

    describe('with invalid input', () => {
      it('should return error for invalid 12h hour (13)', () => {
        const input = createInput('13:00 PM');
        const result = getInputValue(input, '12h');
        expect(result.error).toBeDefined();
      });

      it('should return error for invalid 12h hour (0)', () => {
        const input = createInput('0:00 AM');
        const result = getInputValue(input, '12h');
        expect(result.error).toBeDefined();
      });

      it('should return error for invalid 24h hour (24)', () => {
        const input = createInput('24:00');
        const result = getInputValue(input, '24h');
        expect(result.error).toBeDefined();
      });

      it('should return error for invalid minutes (60)', () => {
        const input = createInput('12:60 PM');
        const result = getInputValue(input, '12h');
        expect(result.error).toBeDefined();
      });

      it('should return error for too many digits', () => {
        const input = createInput('123:456');
        const result = getInputValue(input, '24h');
        expect(result.error).toContain('too many digits');
      });

      it('should return error for letters in hour part', () => {
        const input = createInput('ab:30');
        const result = getInputValue(input, '24h');
        expect(result.error).toContain('invalid letters');
      });

      it('should return error for invalid AM/PM type', () => {
        const input = createInput('9:30 XM');
        const result = getInputValue(input, '12h');
        expect(result.error).toBeDefined();
      });
    });
  });

  describe('handleValueAndCheck', () => {
    describe('hour validation', () => {
      it('should return true for valid 12h hour (1-12)', () => {
        expect(handleValueAndCheck('1', 'hour', '12h')).toBe(true);
        expect(handleValueAndCheck('12', 'hour', '12h')).toBe(true);
        expect(handleValueAndCheck(6, 'hour', '12h')).toBe(true);
      });

      it('should return false for invalid 12h hour (0, 13+)', () => {
        expect(handleValueAndCheck('0', 'hour', '12h')).toBe(false);
        expect(handleValueAndCheck('13', 'hour', '12h')).toBe(false);
      });

      it('should return true for valid 24h hour (0-23)', () => {
        expect(handleValueAndCheck('0', 'hour', '24h')).toBe(true);
        expect(handleValueAndCheck('23', 'hour', '24h')).toBe(true);
        expect(handleValueAndCheck(12, 'hour', '24h')).toBe(true);
      });

      it('should return false for invalid 24h hour (24+)', () => {
        expect(handleValueAndCheck('24', 'hour', '24h')).toBe(false);
        expect(handleValueAndCheck('25', 'hour', '24h')).toBe(false);
      });
    });

    describe('minutes validation', () => {
      it('should return true for valid minutes (0-59)', () => {
        expect(handleValueAndCheck('0', 'minutes')).toBe(true);
        expect(handleValueAndCheck('59', 'minutes')).toBe(true);
        expect(handleValueAndCheck(30, 'minutes')).toBe(true);
      });

      it('should return false for invalid minutes (60+)', () => {
        expect(handleValueAndCheck('60', 'minutes')).toBe(false);
        expect(handleValueAndCheck('99', 'minutes')).toBe(false);
      });

      it('should return false for negative minutes', () => {
        expect(handleValueAndCheck('-1', 'minutes')).toBe(false);
      });
    });

    it('should return false for NaN input', () => {
      expect(handleValueAndCheck('abc', 'hour', '12h')).toBe(false);
    });

    it('should return true for empty string (converts to 0)', () => {
      expect(handleValueAndCheck('', 'minutes')).toBe(true);
    });

    it('should return undefined for unknown type', () => {
      expect(handleValueAndCheck('5', 'unknown' as 'hour')).toBeUndefined();
    });
  });
});

