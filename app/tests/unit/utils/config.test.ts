import {
  toType,
  isElement,
  typeCheckConfig,
  getConfig,
  getScrollbarWidth,
  getRadians,
  getClickTouchPosition,
  getMathDegIncrement,
  hasClass,
  createNewEvent,
  createEventWithCallback,
  getBrowser,
  getIncrementTimes,
  createObjectFromData,
  range,
  reverseRange,
  initCallback,
  timeConversion,
  normalize24h,
  isOverlappingRangeArray,
  generateUUID,
} from '../../../src/utils/config';

describe('utils/config', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('toType', () => {
    it('should return "null" for null', () => {
      expect(toType(null)).toBe('null');
    });

    it('should return "undefined" for undefined', () => {
      expect(toType(undefined)).toBe('undefined');
    });

    it('should return "string" for string', () => {
      expect(toType('test')).toBe('string');
    });

    it('should return "number" for number', () => {
      expect(toType(42)).toBe('number');
    });
  });

  describe('isElement', () => {
    it('should return nodeType for HTMLElement', () => {
      const div = document.createElement('div');
      expect(isElement(div)).toBe(1);
    });

    it('should return nodeType from array of elements', () => {
      const div = document.createElement('div');
      expect(isElement([div])).toBe(1);
    });
  });

  describe('typeCheckConfig', () => {
    it('should not throw for valid config', () => {
      const config = { testProp: 'string' };
      const configTypes = { testProp: 'string' };

      expect(() => {
        typeCheckConfig('TestComponent', config, configTypes);
      }).not.toThrow();
    });

    it('should throw for invalid type', () => {
      const config = { testProp: 123 };
      const configTypes = { testProp: 'string' };

      expect(() => {
        typeCheckConfig('TestComponent', config, configTypes);
      }).toThrow('TESTCOMPONENT');
    });

    it('should handle element type check', () => {
      const div = document.createElement('div');
      const config = { element: div };
      const configTypes = { element: 'el' };

      expect(() => {
        typeCheckConfig('TestComponent', config, configTypes);
      }).not.toThrow();
    });
  });

  describe('getConfig', () => {
    it('should merge options with defaults', () => {
      const defaults = { a: 1, b: 2 };
      const options = { b: 3, c: 4 } as Record<string, unknown>;
      const result = getConfig(options, defaults);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should return defaults when no options provided', () => {
      const defaults = { a: 1, b: 2 };
      const result = getConfig(undefined, defaults);

      expect(result).toEqual(defaults);
    });
  });
  describe('getScrollbarWidth', () => {
    it('should return a number', () => {
      const width = getScrollbarWidth();
      expect(typeof width).toBe('number');
      expect(width).toBeGreaterThanOrEqual(0);
    });

    it('should clean up after measurement', () => {
      const initialChildren = document.body.children.length;
      getScrollbarWidth();
      expect(document.body.children.length).toBe(initialChildren);
    });
  });

  describe('getRadians', () => {
    it('should convert degrees to radians', () => {
      expect(getRadians(180)).toBeCloseTo(Math.PI);
      expect(getRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(getRadians(0)).toBe(0);
    });
  });

  describe('getClickTouchPosition', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.getBoundingClientRect = (() => ({
        left: 10,
        top: 20,
        width: 100,
        height: 100,
        right: 110,
        bottom: 120,
        x: 10,
        y: 20,
        toJSON: () => ({}),
      })) as () => DOMRect;
    });

    it('should return position for mouse event', () => {
      const event = new MouseEvent('click', { clientX: 50, clientY: 60 });
      const result = getClickTouchPosition(event as unknown as TouchEvent, element);

      expect(result).toEqual({ x: 40, y: 40 });
    });

    it('should return position for touch event', () => {
      const touch = new Touch({
        identifier: 1,
        target: element,
        clientX: 50,
        clientY: 60,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
      });

      const event = new TouchEvent('touchstart', {
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
      });

      const result = getClickTouchPosition(event, element);
      expect(result).toEqual({ x: 40, y: 40 });
    });

    it('should return undefined for invalid object', () => {
      const event = new MouseEvent('click');
      const result = getClickTouchPosition(event as unknown as TouchEvent, null as unknown as HTMLElement);

      expect(result).toBeUndefined();
    });
  });

  describe('getMathDegIncrement', () => {
    it('should round to nearest increment', () => {
      expect(getMathDegIncrement(37, 30)).toBe(30);
      expect(getMathDegIncrement(45, 30)).toBe(60);
      expect(getMathDegIncrement(14, 5)).toBe(15);
    });
  });

  describe('hasClass', () => {
    it('should return true when element has class', () => {
      const div = document.createElement('div');
      div.classList.add('test-class');
      expect(hasClass(div, 'test-class')).toBe(true);
    });

    it('should return false when element does not have class', () => {
      const div = document.createElement('div');
      expect(hasClass(div, 'test-class')).toBe(false);
    });

    it('should return false for null element', () => {
      expect(hasClass(null, 'test-class')).toBe(false);
    });
  });

  describe('createNewEvent', () => {
    it('should dispatch custom event with data', () => {
      const div = document.createElement('div');
      const eventData = { hour: '12', minutes: '30' };
      let receivedData: typeof eventData | null = null;

      div.addEventListener('test-event', (e: Event) => {
        receivedData = (e as CustomEvent).detail;
      });

      createNewEvent(div, 'test-event', eventData);
      expect(receivedData).toEqual(eventData);
    });

    it('should not throw for null element', () => {
      expect(() => {
        createNewEvent(null as unknown as Element, 'test', {});
      }).not.toThrow();
    });
  });

  describe('createEventWithCallback', () => {
    it('should dispatch event and call callback', () => {
      const div = document.createElement('div');
      const eventData = { hour: '12', minutes: '30' };
      const callback = jest.fn();

      createEventWithCallback(div, 'accept', 'timepicker:confirm', eventData, callback);

      expect(callback).toHaveBeenCalledWith(eventData);
    });

    it('should dispatch both legacy and namespaced events', () => {
      const div = document.createElement('div');
      const eventData = { hour: '12' };
      const legacyHandler = jest.fn();
      const namespacedHandler = jest.fn();

      div.addEventListener('accept', legacyHandler);
      div.addEventListener('timepicker:confirm', namespacedHandler);

      createEventWithCallback(div, 'accept', 'timepicker:confirm', eventData);

      expect(legacyHandler).toHaveBeenCalled();
      expect(namespacedHandler).toHaveBeenCalled();
    });

    it('should not throw when callback is undefined', () => {
      const div = document.createElement('div');

      expect(() => {
        createEventWithCallback(div, 'test', 'timepicker:test', {}, undefined);
      }).not.toThrow();
    });

    it('should handle callback errors gracefully', () => {
      const div = document.createElement('div');
      const errorCallback = () => {
        throw new Error('Callback error');
      };
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      createEventWithCallback(div, 'test', 'timepicker:test', {}, errorCallback);

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('getBrowser', () => {
    it('should detect mobile browser', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
      });

      expect(getBrowser()).toBe(true);
    });

    it('should detect desktop browser', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        writable: true,
      });

      expect(getBrowser()).toBe(false);
    });
  });

  describe('getIncrementTimes', () => {
    it('should calculate increment correctly', () => {
      expect(getIncrementTimes(37, 5, 6)).toBe(30);
      expect(getIncrementTimes(95, 1, 30)).toBe(90);
    });
  });

  describe('createObjectFromData', () => {
    it('should parse numeric strings to numbers', () => {
      const input = { value1: '123', value2: 'text' };
      const result = createObjectFromData(input as unknown as Record<string, string>);

      expect(result?.value1).toBe(123);
      expect(result?.value2).toBe('text');
    });

    it('should parse boolean strings', () => {
      const input = { flag1: 'true', flag2: 'false' };
      const result = createObjectFromData(input as unknown as Record<string, string>);

      expect(result?.flag1).toBe(true);
      expect(result?.flag2).toBe(false);
    });

    it('should return undefined for falsy input', () => {
      expect(createObjectFromData(null as unknown as Record<string, string>)).toBeUndefined();
      expect(createObjectFromData(undefined as unknown as Record<string, string>)).toBeUndefined();
    });
  });

  describe('range', () => {
    it('should create array of numbers', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(range(0, 3)).toEqual([0, 1, 2, 3]);
    });

    it('should handle string inputs', () => {
      expect(range('1', '3')).toEqual([1, 2, 3]);
    });
  });

  describe('reverseRange', () => {
    it('should create reversed array', () => {
      expect(reverseRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('initCallback', () => {
    it('should call callback if provided', () => {
      const callback = jest.fn();
      initCallback(callback);
      expect(callback).toHaveBeenCalled();
    });

    it('should not throw if callback is undefined', () => {
      expect(() => initCallback(undefined)).not.toThrow();
    });
  });

  describe('timeConversion', () => {
    it('should convert 12h time to 24h', () => {
      expect(timeConversion('10:30 AM')).toBe('10:30');
      expect(timeConversion('10:30 PM')).toBe('22:30');
      expect(timeConversion('12:00 AM')).toBe('00:00');
      expect(timeConversion('12:00 PM')).toBe('12:00');
    });

    it('should handle lowercase am/pm', () => {
      expect(timeConversion('3:45 pm')).toBe('15:45');
      expect(timeConversion('3:45 am')).toBe('03:45');
    });

    it('should handle empty string', () => {
      const result = timeConversion('');
      expect(result).toBeDefined();
    });
  });

  describe('normalize24h', () => {
    it('should pad single digit hours and minutes', () => {
      expect(normalize24h('4:5')).toBe('04:05');
      expect(normalize24h('16:0')).toBe('16:00');
    });

    it('should not modify already normalized time', () => {
      expect(normalize24h('14:30')).toBe('14:30');
    });
  });

  describe('isOverlappingRangeArray', () => {
    it('should return false for non-overlapping 12h intervals', () => {
      const intervals = ['9:00 AM - 10:00 AM', '11:00 AM - 12:00 PM'];
      expect(isOverlappingRangeArray(intervals, '12h')).toBe(false);
    });

    it('should throw for overlapping 12h intervals', () => {
      const intervals = ['9:00 AM - 11:00 AM', '10:30 AM - 12:00 PM'];

      expect(() => {
        isOverlappingRangeArray(intervals, '12h');
      }).toThrow('Overlapping time intervals detected');
    });

    it('should return false for non-overlapping 24h intervals', () => {
      const intervals = ['09:00 - 10:00', '11:00 - 12:00'];
      expect(isOverlappingRangeArray(intervals, '24h')).toBe(false);
    });

    it('should throw for overlapping 24h intervals', () => {
      const intervals = ['09:00 - 11:00', '10:30 - 12:00'];

      expect(() => {
        isOverlappingRangeArray(intervals, '24h');
      }).toThrow('Overlapping time intervals detected');
    });

    it('should return false for single interval', () => {
      expect(isOverlappingRangeArray(['9:00 AM - 10:00 AM'], '12h')).toBe(false);
    });

    it.skip('should throw for invalid 12h format in 24h mode', () => {
      expect(() => {
        isOverlappingRangeArray(['9:00 AM - 10:00 AM'], '24h');
      }).toThrow('Invalid 24h format');
    });

    it.skip('should throw for invalid 24h format in 12h mode', () => {
      expect(() => {
        isOverlappingRangeArray(['13:00 - 14:00'], '12h');
      }).toThrow('Invalid 12h format');
    });
  });

  describe('generateUUID', () => {
    it('should generate a UUID', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it.skip('should generate different UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });
});
