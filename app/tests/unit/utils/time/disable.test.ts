import { createDisabledTime, checkDisabledHoursAndMinutes } from '../../../../src/utils/time/disable';
import type { TimepickerOptions } from '../../../../src/types/options';

const createOptions = (overrides: Partial<TimepickerOptions> = {}): Required<TimepickerOptions> => {
  const defaults = {
    clock: {
      type: '12h' as const,
      disabledTime: undefined,
    },
    ui: {
      modal: {},
      wrapper: {},
      theme: 'default',
      clockType: 'default',
      layout: {
        mobileWidth: 300,
      },
      inline: {},
    },
    labels: {},
    behavior: {
      focusTrap: true,
    },
    callbacks: {},
    range: {},
    timezone: {},
  };

  return {
    ...defaults,
    ...overrides,
    clock: { ...defaults.clock, ...overrides.clock },
  } as Required<TimepickerOptions>;
};

describe('disable utils', () => {
  describe('createDisabledTime', () => {
    it('should return undefined when options is null', () => {
      const result = createDisabledTime(null as never);
      expect(result).toBeUndefined();
    });

    it('should return undefined when disabledTime is not set', () => {
      const options = createOptions();
      const result = createDisabledTime(options);
      expect(result).toBeUndefined();
    });

    it('should return undefined when disabledTime is empty object', () => {
      const options = createOptions({
        clock: { type: '12h', disabledTime: {} },
      });
      const result = createDisabledTime(options);
      expect(result).toBeUndefined();
    });

    describe('hours and minutes validation', () => {
      it('should throw error for 12h hours greater than 12', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { hours: [13] } },
        });
        expect(() => createDisabledTime(options)).toThrow('The disabled hours value has to be less than 13');
      });

      it('should throw error for 24h hours greater than 23', () => {
        const options = createOptions({
          clock: { type: '24h', disabledTime: { hours: [24] } },
        });
        expect(() => createDisabledTime(options)).toThrow('The disabled hours value has to be less than 24');
      });

      it('should throw error for minutes greater than 59', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { minutes: [60] } },
        });
        expect(() => createDisabledTime(options)).toThrow(
          'The disabled minutes value has to be less than 60',
        );
      });

      it('should return formatted hours for valid 12h input', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { hours: [1, 2, '00'] } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.hours).toContain('1');
        expect(result?.value.hours).toContain('2');
        expect(result?.value.hours).toContain('00');
      });

      it('should return formatted minutes for valid input', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { minutes: [0, 5, 15, 30] } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.minutes).toContain('00');
        expect(result?.value.minutes).toContain('05');
        expect(result?.value.minutes).toContain('15');
        expect(result?.value.minutes).toContain('30');
      });
    });

    describe('interval mode', () => {
      it('should throw error when clockType is missing for interval', () => {
        const options = createOptions({
          clock: { type: undefined as never, disabledTime: { interval: '09:00 AM - 10:00 AM' } },
        });
        expect(() => createDisabledTime(options)).toThrow('clockType required for interval');
      });

      it.each([
        ['single 12h AM/AM interval', '12h', '09:00 AM - 10:00 AM'],
        ['12h interval with a non-zero start minute', '12h', '09:30 AM - 11:00 AM'],
        ['12h interval with a non-zero end minute', '12h', '09:00 AM - 11:30 AM'],
        ['12h interval with non-zero start and end minutes', '12h', '09:15 AM - 11:45 AM'],
        ['12h interval on whole hours', '12h', '09:00 AM - 11:00 AM'],
        ['12h interval ending on a single-digit hour', '12h', '08:30 AM - 09:30 AM'],
        ['12h interval crossing AM to PM', '12h', '10:00 AM - 02:00 PM'],
        ['12h AM to PM interval with a non-zero start minute', '12h', '10:30 AM - 02:00 PM'],
        ['12h AM to PM interval with a non-zero end minute', '12h', '10:00 AM - 02:30 PM'],
        ['12h AM to PM interval with non-zero start and end minutes', '12h', '10:15 AM - 02:45 PM'],
        ['single 24h interval', '24h', '09:00 - 11:00'],
      ] as const)('should wrap a %s into a one-item intervals list', (_label, clockType, interval) => {
        const options = createOptions({
          clock: { type: clockType, disabledTime: { interval } },
        });
        const result = createDisabledTime(options);
        expect(result?.value).toEqual({ isInterval: true, clockType, intervals: [interval] });
      });

      it('should keep an interval array as given in 12h format', () => {
        const intervals = ['09:00 AM - 10:00 AM', '02:00 PM - 03:00 PM'];
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: intervals } },
        });
        const result = createDisabledTime(options);
        expect(result?.value).toEqual({ isInterval: true, clockType: '12h', intervals });
      });

      it('should keep the user hours/minutes and return only the intervals when interval is set', () => {
        const disabledTime = { interval: '09:00 AM - 10:00 AM', hours: [1], minutes: [15] };
        const options = createOptions({
          clock: { type: '12h', disabledTime },
        });
        const result = createDisabledTime(options);
        expect(result?.value).toEqual({
          isInterval: true,
          clockType: '12h',
          intervals: ['09:00 AM - 10:00 AM'],
        });
        expect(result?.value).not.toHaveProperty('hours');
        expect(result?.value).not.toHaveProperty('minutes');
        expect(options.clock.disabledTime?.hours).toEqual([1]);
        expect(options.clock.disabledTime?.minutes).toEqual([15]);
      });
    });
  });

  describe('checkDisabledHoursAndMinutes', () => {
    it('should return undefined when value is undefined', () => {
      const result = checkDisabledHoursAndMinutes(undefined, 'hour');
      expect(result).toBeUndefined();
    });

    it('should return true for valid array of hours', () => {
      const result = checkDisabledHoursAndMinutes([1, 2, 3], 'hour', '12h');
      expect(result).toBe(true);
    });

    it('should return false if any hour in array is invalid', () => {
      const result = checkDisabledHoursAndMinutes([1, 2, 15], 'hour', '12h');
      expect(result).toBe(false);
    });

    it('should return true for valid array of minutes', () => {
      const result = checkDisabledHoursAndMinutes([0, 15, 30, 45], 'minutes', '12h');
      expect(result).toBe(true);
    });

    it('should return false if any minute in array is invalid', () => {
      const result = checkDisabledHoursAndMinutes([15, 30, 70], 'minutes', '12h');
      expect(result).toBe(false);
    });

    it('should return true for valid single hour string', () => {
      const result = checkDisabledHoursAndMinutes('5', 'hour', '12h');
      expect(result).toBe(true);
    });

    it('should return false for single hour string if in arrValue', () => {
      const result = checkDisabledHoursAndMinutes('5', 'hour', '12h', [5, 6, 7]);
      expect(result).toBe(false);
    });

    it('should return true for valid single hour number not in arrValue', () => {
      const result = checkDisabledHoursAndMinutes(4, 'hour', '12h', [5, 6, 7]);
      expect(result).toBe(true);
    });

    it('should return false for invalid single hour value', () => {
      const result = checkDisabledHoursAndMinutes(15, 'hour', '12h');
      expect(result).toBe(false);
    });
  });
});

