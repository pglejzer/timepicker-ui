import {
  parseTimeString,
  formatDisplayTime,
  formatOutputTime,
  timeToMinutes,
  calculateDuration,
  isValueComplete,
  formatRange,
  parseRangeInput,
} from '../../../../src/managers/plugins/range/utils';
import type { RangeValue } from '../../../../src/managers/plugins/range/types';

describe('range utils', () => {
  describe('parseTimeString', () => {
    it('should return null for empty string', () => {
      expect(parseTimeString('')).toBeNull();
    });

    it('should return null for placeholder', () => {
      expect(parseTimeString('--:--')).toBeNull();
    });

    it('should parse 12h time with AM', () => {
      const result = parseTimeString('9:30 AM');
      expect(result).toEqual({ hour: '9', minutes: '30', type: 'AM' });
    });

    it('should parse 12h time with PM', () => {
      const result = parseTimeString('12:00 PM');
      expect(result).toEqual({ hour: '12', minutes: '00', type: 'PM' });
    });

    it('should parse 12h time case insensitive', () => {
      const result = parseTimeString('9:30 am');
      expect(result).toEqual({ hour: '9', minutes: '30', type: 'AM' });
    });

    it('should parse 24h time', () => {
      const result = parseTimeString('14:30');
      expect(result).toEqual({ hour: '14', minutes: '30' });
    });

    it('should parse midnight in 24h', () => {
      const result = parseTimeString('00:00');
      expect(result).toEqual({ hour: '00', minutes: '00' });
    });

    it('should return null for invalid format', () => {
      expect(parseTimeString('invalid')).toBeNull();
      expect(parseTimeString('abc:def')).toBeNull();
    });

    it('should parse but not validate range (25:00 is parsed)', () => {
      const result = parseTimeString('25:00');
      expect(result).toEqual({ hour: '25', minutes: '00' });
    });
  });

  describe('formatDisplayTime', () => {
    it('should format 12h time', () => {
      const value: RangeValue = { hour: '9', minutes: '30', type: 'AM' };
      expect(formatDisplayTime(value)).toBe('9:30 AM');
    });

    it('should format 24h time', () => {
      const value: RangeValue = { hour: '14', minutes: '05' };
      expect(formatDisplayTime(value)).toBe('14:05');
    });

    it('should handle placeholder minutes', () => {
      const value: RangeValue = { hour: '9', minutes: '--', type: 'AM' };
      expect(formatDisplayTime(value)).toBe('9:-- AM');
    });

    it('should pad minutes with zero', () => {
      const value: RangeValue = { hour: '9', minutes: '5' };
      expect(formatDisplayTime(value)).toBe('9:05');
    });
  });

  describe('formatOutputTime', () => {
    it('should pad hour and minutes', () => {
      const value: RangeValue = { hour: '9', minutes: '5' };
      expect(formatOutputTime(value)).toBe('09:05');
    });

    it('should include type for 12h', () => {
      const value: RangeValue = { hour: '9', minutes: '30', type: 'AM' };
      expect(formatOutputTime(value)).toBe('09:30 AM');
    });
  });

  describe('timeToMinutes', () => {
    it('should return 0 for null value', () => {
      expect(timeToMinutes(null, '12h')).toBe(0);
    });

    it('should convert 12h AM time', () => {
      const value: RangeValue = { hour: '9', minutes: '30', type: 'AM' };
      expect(timeToMinutes(value, '12h')).toBe(9 * 60 + 30);
    });

    it('should convert 12h PM time', () => {
      const value: RangeValue = { hour: '2', minutes: '00', type: 'PM' };
      expect(timeToMinutes(value, '12h')).toBe(14 * 60);
    });

    it('should handle 12 PM (noon)', () => {
      const value: RangeValue = { hour: '12', minutes: '00', type: 'PM' };
      expect(timeToMinutes(value, '12h')).toBe(12 * 60);
    });

    it('should handle 12 AM (midnight)', () => {
      const value: RangeValue = { hour: '12', minutes: '00', type: 'AM' };
      expect(timeToMinutes(value, '12h')).toBe(0);
    });

    it('should convert 24h time', () => {
      const value: RangeValue = { hour: '14', minutes: '30' };
      expect(timeToMinutes(value, '24h')).toBe(14 * 60 + 30);
    });

    it('should handle midnight in 24h', () => {
      const value: RangeValue = { hour: '0', minutes: '00' };
      expect(timeToMinutes(value, '24h')).toBe(0);
    });
  });

  describe('calculateDuration', () => {
    it('should return 0 if from is null', () => {
      const to: RangeValue = { hour: '10', minutes: '00', type: 'AM' };
      expect(calculateDuration(null, to, '12h')).toBe(0);
    });

    it('should return 0 if to is null', () => {
      const from: RangeValue = { hour: '9', minutes: '00', type: 'AM' };
      expect(calculateDuration(from, null, '12h')).toBe(0);
    });

    it('should calculate duration in same day', () => {
      const from: RangeValue = { hour: '9', minutes: '00', type: 'AM' };
      const to: RangeValue = { hour: '5', minutes: '00', type: 'PM' };
      expect(calculateDuration(from, to, '12h')).toBe(8 * 60);
    });

    it('should handle overnight duration', () => {
      const from: RangeValue = { hour: '10', minutes: '00', type: 'PM' };
      const to: RangeValue = { hour: '6', minutes: '00', type: 'AM' };
      expect(calculateDuration(from, to, '12h')).toBe(8 * 60);
    });

    it('should calculate 24h duration', () => {
      const from: RangeValue = { hour: '9', minutes: '00' };
      const to: RangeValue = { hour: '17', minutes: '00' };
      expect(calculateDuration(from, to, '24h')).toBe(8 * 60);
    });
  });

  describe('isValueComplete', () => {
    it('should return false for null', () => {
      expect(isValueComplete(null, '12h')).toBe(false);
    });

    it('should return true for complete 12h value', () => {
      const value: RangeValue = { hour: '9', minutes: '30', type: 'AM' };
      expect(isValueComplete(value, '12h')).toBe(true);
    });

    it('should return false for 12h without type', () => {
      const value: RangeValue = { hour: '9', minutes: '30' };
      expect(isValueComplete(value, '12h')).toBe(false);
    });

    it('should return true for complete 24h value', () => {
      const value: RangeValue = { hour: '14', minutes: '30' };
      expect(isValueComplete(value, '24h')).toBe(true);
    });

    it('should return false for incomplete value', () => {
      const value: RangeValue = { hour: '9', minutes: '' };
      expect(isValueComplete(value, '24h')).toBe(false);
    });
  });

  describe('formatRange', () => {
    it('should return null if from is null', () => {
      const to: RangeValue = { hour: '17', minutes: '00' };
      expect(formatRange(null, to)).toBeNull();
    });

    it('should return null if to is null', () => {
      const from: RangeValue = { hour: '9', minutes: '00' };
      expect(formatRange(from, null)).toBeNull();
    });

    it('should format complete range', () => {
      const from: RangeValue = { hour: '9', minutes: '00', type: 'AM' };
      const to: RangeValue = { hour: '5', minutes: '00', type: 'PM' };
      expect(formatRange(from, to)).toEqual({
        from: '09:00 AM',
        to: '05:00 PM',
      });
    });
  });

  describe('parseRangeInput', () => {
    it('should return null values for empty input', () => {
      expect(parseRangeInput('')).toEqual({ from: null, to: null });
    });

    it('should return null values for input without separator', () => {
      expect(parseRangeInput('9:00 AM')).toEqual({ from: null, to: null });
    });

    it('should return null values for placeholder values', () => {
      expect(parseRangeInput('--:-- - --:--')).toEqual({ from: null, to: null });
    });

    it('should parse valid 12h range', () => {
      const result = parseRangeInput('9:00 AM - 5:00 PM');
      expect(result.from).toEqual({ hour: '9', minutes: '00', type: 'AM' });
      expect(result.to).toEqual({ hour: '5', minutes: '00', type: 'PM' });
    });

    it('should parse valid 24h range', () => {
      const result = parseRangeInput('09:00 - 17:00');
      expect(result.from).toEqual({ hour: '09', minutes: '00' });
      expect(result.to).toEqual({ hour: '17', minutes: '00' });
    });
  });
});

