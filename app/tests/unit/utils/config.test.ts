import {
  hasClass,
  range,
  reverseRange,
  initCallback,
  timeConversion,
  normalize24h,
  isOverlappingRangeArray,
  generateUUID,
  getScrollbarWidth,
} from '../../../src/utils/config';

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

  describe('range', () => {
    it('should generate range from start to stop inclusive', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle string inputs', () => {
      expect(range('0', '3')).toEqual([0, 1, 2, 3]);
    });

    it('should handle single element range', () => {
      expect(range(5, 5)).toEqual([5]);
    });

    it('should handle zero start', () => {
      expect(range(0, 2)).toEqual([0, 1, 2]);
    });
  });

  describe('reverseRange', () => {
    it('should generate reversed range from start to stop', () => {
      expect(reverseRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle string inputs', () => {
      expect(reverseRange('0', '3')).toEqual([0, 1, 2, 3]);
    });
  });

  describe('initCallback', () => {
    it('should call callback if provided', () => {
      const callback = jest.fn();
      initCallback(callback);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not throw if callback is undefined', () => {
      expect(() => initCallback(undefined)).not.toThrow();
    });

    it('should not throw if callback is not a function', () => {
      expect(() => initCallback('not a function' as unknown as () => void)).not.toThrow();
    });
  });

  describe('timeConversion', () => {
    it('should convert 12h time to 24h format', () => {
      expect(timeConversion('9:30AM')).toBe('09:30');
      expect(timeConversion('12:00PM')).toBe('12:00');
      expect(timeConversion('1:15PM')).toBe('13:15');
      expect(timeConversion('12:00AM')).toBe('00:00');
    });

    it('should handle times with space before AM/PM', () => {
      expect(timeConversion('9:30 AM')).toBe('09:30');
      expect(timeConversion('1:15 PM')).toBe('13:15');
    });

    it('should handle lowercase am/pm', () => {
      expect(timeConversion('9:30am')).toBe('09:30');
      expect(timeConversion('1:15pm')).toBe('13:15');
    });
  });

  describe('normalize24h', () => {
    it('should pad hour and minute with zeros', () => {
      expect(normalize24h('9:5')).toBe('09:05');
      expect(normalize24h('1:0')).toBe('01:00');
    });

    it('should not change already padded times', () => {
      expect(normalize24h('09:30')).toBe('09:30');
      expect(normalize24h('23:59')).toBe('23:59');
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

  describe('getScrollbarWidth', () => {
    it('should return a number', () => {
      const width = getScrollbarWidth();
      expect(typeof width).toBe('number');
      expect(width).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getClickTouchPosition', () => {
    it('should return undefined when object is null', () => {
      const { getClickTouchPosition } = require('../../../src/utils/config');
      const event = new TouchEvent('touchstart');
      const result = getClickTouchPosition(event, null as never);
      expect(result).toBeUndefined();
    });

    it('should handle mouse event without touches', () => {
      const { getClickTouchPosition } = require('../../../src/utils/config');
      const element = document.createElement('div');
      element.getBoundingClientRect = jest.fn().mockReturnValue({ left: 10, top: 20 });

      const event = {
        touches: undefined,
        clientX: 50,
        clientY: 60,
      } as unknown as TouchEvent;

      const result = getClickTouchPosition(event, element);
      expect(result).toEqual({ x: 40, y: 40 });
    });

    it('should handle touch event with touches array', () => {
      const { getClickTouchPosition } = require('../../../src/utils/config');
      const element = document.createElement('div');
      element.getBoundingClientRect = jest.fn().mockReturnValue({ left: 10, top: 20 });

      const event = {
        touches: [{ clientX: 100, clientY: 120 }],
      } as unknown as TouchEvent;

      const result = getClickTouchPosition(event, element);
      expect(result).toEqual({ x: 90, y: 100 });
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

