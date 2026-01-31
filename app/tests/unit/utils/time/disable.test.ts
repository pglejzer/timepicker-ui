import {
  createDisabledTime,
  checkDisabledHoursAndMinutes,
  checkedDisabledValuesInterval,
} from '../../../../src/utils/time/disable';
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

      it('should process single interval in 12h format - same type AM/AM', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '09:00 AM - 10:00 AM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
        expect(result?.value.clockType).toBe('12h');
      });

      it('should process interval array in 12h format', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: ['09:00 AM - 10:00 AM', '02:00 PM - 03:00 PM'] } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
        expect(result?.value.intervals).toHaveLength(2);
      });

      it('should process interval in 24h format', () => {
        const options = createOptions({
          clock: { type: '24h', disabledTime: { interval: '09:00 - 11:00' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
        expect(result?.value.clockType).toBe('24h');
      });

      it('should handle interval crossing AM to PM', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '10:00 AM - 02:00 PM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
        expect(result?.value.startType).toBe('AM');
        expect(result?.value.endType).toBe('PM');
      });

      it('should handle interval with startMinutes > 0 and endMinutes <= 0', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '09:30 AM - 11:00 AM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
        expect(result?.value.startMinutes).toBeDefined();
      });

      it('should handle interval with endMinutes > 0 and startMinutes <= 0', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '09:00 AM - 11:30 AM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
        expect(result?.value.endMinutes).toBeDefined();
      });

      it('should handle interval with both startMinutes and endMinutes > 0', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '09:15 AM - 11:45 AM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
      });

      it('should handle interval with both startMinutes and endMinutes = 0', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '09:00 AM - 11:00 AM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
      });

      it('should handle cross-type interval with startMinutes > 0 and endMinutes <= 0', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '10:30 AM - 02:00 PM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
        expect(result?.value.amHours).toBeDefined();
        expect(result?.value.pmHours).toBeDefined();
      });

      it('should handle cross-type interval with endMinutes > 0 and startMinutes <= 0', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '10:00 AM - 02:30 PM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
      });

      it('should handle cross-type interval with both minutes > 0', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '10:15 AM - 02:45 PM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
      });

      it('should handle cross-type interval with both minutes = 0', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '10:00 AM - 02:00 PM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
      });

      it('should format removedStartedHour with leading zero when <= 9', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '09:30 AM - 11:30 AM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.removedStartedHour).toBe('09');
      });

      it('should format removedEndHour with leading zero when <= 9', () => {
        const options = createOptions({
          clock: { type: '12h', disabledTime: { interval: '08:30 AM - 09:30 AM' } },
        });
        const result = createDisabledTime(options);
        expect(result?.value.removedEndHour).toBe('09');
      });

      it('should delete hours and minutes when interval is set', () => {
        const options = createOptions({
          clock: {
            type: '12h',
            disabledTime: { interval: '09:00 AM - 10:00 AM', hours: [1], minutes: [15] },
          },
        });
        const result = createDisabledTime(options);
        expect(result?.value.isInterval).toBe(true);
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

  describe('checkedDisabledValuesInterval', () => {
    it('should return false when hour is missing', () => {
      const result = checkedDisabledValuesInterval(undefined, '30', 'AM', '09:00 AM - 10:00 AM', '12h');
      expect(result).toBe(false);
    });

    it('should return false when minutes is missing', () => {
      const result = checkedDisabledValuesInterval('09', undefined, 'AM', '09:00 AM - 10:00 AM', '12h');
      expect(result).toBe(false);
    });

    it('should return false when interval is missing', () => {
      const result = checkedDisabledValuesInterval('09', '30', 'AM', undefined, '12h');
      expect(result).toBe(false);
    });

    it('should return false when clockType is missing', () => {
      const result = checkedDisabledValuesInterval('09', '30', 'AM', '09:00 AM - 10:00 AM', undefined);
      expect(result).toBe(false);
    });

    it('should return false for time within 12h interval', () => {
      const result = checkedDisabledValuesInterval('09', '30', 'AM', '09:00 AM - 10:00 AM', '12h');
      expect(result).toBe(false);
    });

    it('should return true for time outside 12h interval', () => {
      const result = checkedDisabledValuesInterval('08', '30', 'AM', '09:00 AM - 10:00 AM', '12h');
      expect(result).toBe(true);
    });

    it('should return false for time within 24h interval', () => {
      const result = checkedDisabledValuesInterval('09', '30', undefined, '09:00 - 10:00', '24h');
      expect(result).toBe(false);
    });

    it('should return true for time outside 24h interval', () => {
      const result = checkedDisabledValuesInterval('08', '30', undefined, '09:00 - 10:00', '24h');
      expect(result).toBe(true);
    });

    it('should handle interval array in 12h format', () => {
      const intervals = ['09:00 AM - 10:00 AM', '02:00 PM - 03:00 PM'];
      const result = checkedDisabledValuesInterval('09', '30', 'AM', intervals, '12h');
      expect(result).toBe(false);
    });

    it('should return true when time is between intervals', () => {
      const intervals = ['09:00 AM - 10:00 AM', '02:00 PM - 03:00 PM'];
      const result = checkedDisabledValuesInterval('11', '00', 'AM', intervals, '12h');
      expect(result).toBe(true);
    });

    it('should skip 12h intervals missing AM/PM suffix', () => {
      const result = checkedDisabledValuesInterval('09', '30', 'AM', '09:00 - 10:00', '12h');
      expect(result).toBe(true);
    });

    it('should skip 24h intervals with AM/PM suffix', () => {
      const result = checkedDisabledValuesInterval('09', '30', undefined, '09:00 AM - 10:00 AM', '24h');
      expect(result).toBe(true);
    });

    it('should handle time at interval start boundary', () => {
      const result = checkedDisabledValuesInterval('09', '00', 'AM', '09:00 AM - 10:00 AM', '12h');
      expect(result).toBe(false);
    });

    it('should handle time at interval end boundary', () => {
      const result = checkedDisabledValuesInterval('10', '00', 'AM', '09:00 AM - 10:00 AM', '12h');
      expect(result).toBe(false);
    });

    it('should handle PM time in 12h interval', () => {
      const result = checkedDisabledValuesInterval('02', '30', 'PM', '02:00 PM - 03:00 PM', '12h');
      expect(result).toBe(false);
    });

    it('should handle 24h afternoon time', () => {
      const result = checkedDisabledValuesInterval('14', '30', undefined, '14:00 - 15:00', '24h');
      expect(result).toBe(false);
    });

    it('should handle type as empty string', () => {
      const result = checkedDisabledValuesInterval('09', '30', '', '09:00 - 10:00', '24h');
      expect(result).toBe(false);
    });
  });
});

