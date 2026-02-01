import { clampValue, clampHourValue, clampMinuteValue } from '../../../src/utils/input/clamp';

describe('Input clamping utilities', () => {
  describe('clampValue', () => {
    it('should clamp value above max to max', () => {
      expect(clampValue(100, 0, 23)).toBe(23);
      expect(clampValue(169, 0, 23)).toBe(23);
      expect(clampValue(70, 0, 59)).toBe(59);
    });

    it('should clamp value below min to min', () => {
      expect(clampValue(-10, 0, 23)).toBe(0);
      expect(clampValue(-5, 1, 12)).toBe(1);
    });

    it('should keep value within range unchanged', () => {
      expect(clampValue(12, 0, 23)).toBe(12);
      expect(clampValue(30, 0, 59)).toBe(30);
      expect(clampValue(5, 1, 12)).toBe(5);
    });

    it('should handle min === max', () => {
      expect(clampValue(100, 5, 5)).toBe(5);
      expect(clampValue(0, 5, 5)).toBe(5);
    });
  });

  describe('clampHourValue', () => {
    describe('24h format', () => {
      it('should clamp hours > 23 to 23', () => {
        expect(clampHourValue('169', false)).toBe('23');
        expect(clampHourValue('25', false)).toBe('23');
        expect(clampHourValue('100', false)).toBe('23');
      });

      it('should clamp hours < 0 to 00', () => {
        expect(clampHourValue('-5', false)).toBe('00');
        expect(clampHourValue('-10', false)).toBe('00');
      });

      it('should keep valid hours unchanged', () => {
        expect(clampHourValue('12', false)).toBe('12');
        expect(clampHourValue('00', false)).toBe('00');
        expect(clampHourValue('23', false)).toBe('23');
      });

      it('should pad single digit hours', () => {
        expect(clampHourValue('5', false)).toBe('05');
        expect(clampHourValue('0', false)).toBe('00');
      });
    });

    describe('12h format', () => {
      it('should clamp hours > 12 to 12', () => {
        expect(clampHourValue('169', true)).toBe('12');
        expect(clampHourValue('25', true)).toBe('12');
        expect(clampHourValue('13', true)).toBe('12');
      });

      it('should clamp hours <= 0 to 01', () => {
        expect(clampHourValue('0', true)).toBe('01');
        expect(clampHourValue('-5', true)).toBe('01');
      });

      it('should keep valid hours unchanged', () => {
        expect(clampHourValue('12', true)).toBe('12');
        expect(clampHourValue('1', true)).toBe('01');
        expect(clampHourValue('6', true)).toBe('06');
      });
    });

    describe('edge cases', () => {
      it('should return empty string for empty input', () => {
        expect(clampHourValue('', false)).toBe('');
        expect(clampHourValue('', true)).toBe('');
      });

      it('should return empty string for non-numeric input', () => {
        expect(clampHourValue('abc', false)).toBe('');
        expect(clampHourValue('xx', true)).toBe('');
      });
    });
  });

  describe('clampMinuteValue', () => {
    it('should clamp minutes > 59 to 59', () => {
      expect(clampMinuteValue('70')).toBe('59');
      expect(clampMinuteValue('100')).toBe('59');
      expect(clampMinuteValue('999')).toBe('59');
    });

    it('should clamp minutes < 0 to 00', () => {
      expect(clampMinuteValue('-5')).toBe('00');
      expect(clampMinuteValue('-10')).toBe('00');
    });

    it('should keep valid minutes unchanged', () => {
      expect(clampMinuteValue('30')).toBe('30');
      expect(clampMinuteValue('00')).toBe('00');
      expect(clampMinuteValue('59')).toBe('59');
    });

    it('should pad single digit minutes', () => {
      expect(clampMinuteValue('5')).toBe('05');
      expect(clampMinuteValue('0')).toBe('00');
    });

    it('should return empty string for empty input', () => {
      expect(clampMinuteValue('')).toBe('');
    });

    it('should return empty string for non-numeric input', () => {
      expect(clampMinuteValue('abc')).toBe('');
      expect(clampMinuteValue('xx')).toBe('');
    });
  });
});

