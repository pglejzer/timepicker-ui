import { sanitizeTimeInput } from '../../../src/utils/validation';

describe('validation utils', () => {
  describe('sanitizeTimeInput', () => {
    it('should keep valid time characters', () => {
      expect(sanitizeTimeInput('12:30 AM')).toBe('12:30 AM');
      expect(sanitizeTimeInput('09:45 PM')).toBe('09:45 PM');
      expect(sanitizeTimeInput('23:59')).toBe('23:59');
    });

    it('should remove invalid characters but keep APMapm', () => {
      expect(sanitizeTimeInput('12:30<script>')).toBe('12:30p');
      expect(sanitizeTimeInput('ab12:cd30')).toBe('a12:30');
      expect(sanitizeTimeInput('!@#$%12:30^&*()')).toBe('12:30');
    });

    it('should handle lowercase am/pm', () => {
      expect(sanitizeTimeInput('12:30 am')).toBe('12:30 am');
      expect(sanitizeTimeInput('09:45 pm')).toBe('09:45 pm');
    });

    it('should handle empty string', () => {
      expect(sanitizeTimeInput('')).toBe('');
    });

    it('should handle only invalid characters', () => {
      expect(sanitizeTimeInput('!@#$%^&*()')).toBe('');
    });
  });
});

