import { hasClass, isOverlappingRangeArray, generateUUID } from '../../../src/utils/config';

describe('config utils', () => {
  describe('hasClass', () => {
    it('should return true if element has the class', () => {
      const el = document.createElement('div');
      el.classList.add('test-class');
      expect(hasClass(el, 'test-class')).toBe(true);
    });

    it('should return false if element does not have the class', () => {
      const el = document.createElement('div');
      expect(hasClass(el, 'test-class')).toBe(false);
    });

    it('should return false for null element', () => {
      expect(hasClass(null, 'test-class')).toBe(false);
    });
  });

  describe('isOverlappingRangeArray', () => {
    it('should return false for single interval', () => {
      expect(isOverlappingRangeArray(['9:00 AM - 10:00 AM'], '12h')).toBe(false);
    });

    it('should return false for non-overlapping 12h intervals', () => {
      expect(isOverlappingRangeArray(['9:00 AM - 10:00 AM', '11:00 AM - 12:00 PM'], '12h')).toBe(false);
    });

    it('should throw for overlapping 12h intervals', () => {
      expect(() => isOverlappingRangeArray(['9:00 AM - 11:00 AM', '10:00 AM - 12:00 PM'], '12h')).toThrow(
        /Overlapping intervals/,
      );
    });

    it('should return false for non-overlapping 24h intervals', () => {
      expect(isOverlappingRangeArray(['09:00 - 10:00', '11:00 - 12:00'], '24h')).toBe(false);
    });

    it('should throw for overlapping 24h intervals', () => {
      expect(() => isOverlappingRangeArray(['09:00 - 11:00', '10:00 - 12:00'], '24h')).toThrow(
        /Overlapping intervals/,
      );
    });

    it('should throw for invalid 12h format (missing AM/PM)', () => {
      expect(() => isOverlappingRangeArray(['9:00 - 10:00', '11:00 - 12:00'], '12h')).toThrow(
        /Invalid 12h format/,
      );
    });

    it('should throw for invalid 24h format (with AM/PM)', () => {
      expect(() => isOverlappingRangeArray(['9:00 AM - 10:00 AM', '11:00 AM - 12:00 PM'], '24h')).toThrow(
        /Invalid 24h format/,
      );
    });
  });

  describe('generateUUID', () => {
    beforeEach(() => {
      let counter = 0;
      Object.defineProperty(window, 'crypto', {
        value: {
          randomUUID: () => {
            counter++;
            return `${counter.toString(16).padStart(8, '0')}-${counter.toString(16).padStart(4, '0')}-${counter.toString(16).padStart(4, '0')}-${counter.toString(16).padStart(4, '0')}-${counter.toString(16).padStart(12, '0')}`;
          },
        },
        configurable: true,
      });
    });

    it('should generate valid UUID format', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('generateUUID fallback', () => {
    it('should use fallback when crypto.randomUUID is not available', () => {
      const originalCrypto = window.crypto;

      Object.defineProperty(window, 'crypto', {
        value: undefined,
        configurable: true,
      });

      jest.resetModules();
      const { generateUUID } = require('../../../src/utils/config');
      const uuid = generateUUID();

      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

      Object.defineProperty(window, 'crypto', {
        value: originalCrypto,
        configurable: true,
      });
    });
  });
});

