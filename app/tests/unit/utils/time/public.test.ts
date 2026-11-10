/**
 * @jest-environment node
 */
import { parseTime, formatTime, createDisabledTimeCheck } from '@/utils/time/public';

describe('parseTime', () => {
  it.each([
    ['14:30', { clockType: '24h' }, { hour: '14', minutes: '30' }],
    [' 9:05 ', { clockType: '24h' }, { hour: '09', minutes: '05' }],
    ['2:30 PM', { clockType: '24h' }, { hour: '14', minutes: '30' }],
    ['12:00 AM', { clockType: '24h' }, { hour: '00', minutes: '00' }],
    ['2:30 pm', undefined, { hour: '02', minutes: '30', type: 'PM' }],
    ['14:30', undefined, { hour: '02', minutes: '30', type: 'PM' }],
    ['14:30:05', { clockType: '24h', showSeconds: true }, { hour: '14', minutes: '30', seconds: '05' }],
    ['14:30', { clockType: '24h', showSeconds: true }, { hour: '14', minutes: '30', seconds: '00' }],
  ] as const)('parses %p with %p', (text, options, expected) => {
    expect(parseTime(text, options)).toEqual(expected);
  });

  it.each(['25:00', '12:60', 'abc', '', '13:00 PM'])('returns null for %p', (text) => {
    expect(parseTime(text, { clockType: '24h' })).toBeNull();
  });

  it('returns null for a non-string', () => {
    expect(parseTime(42 as unknown as string)).toBeNull();
  });

  it('leaves out parts that are not set', () => {
    expect(Object.keys(parseTime('14:30', { clockType: '24h' }) ?? {})).toEqual(['hour', 'minutes']);
  });
});

describe('formatTime', () => {
  it.each([
    [{ hour: '2', minutes: '30', type: 'PM' }, undefined, '02:30 PM'],
    [{ hour: '14', minutes: '5' }, { clockType: '24h' }, '14:05'],
    [{ hour: '14', minutes: '30', seconds: '5' }, { clockType: '24h', showSeconds: true }, '14:30:05'],
  ] as const)('formats %p', (value, options, expected) => {
    expect(formatTime(value, options)).toBe(expected);
  });

  it.each(['2:30 PM', '14:30', '12:00 AM', '9:05 AM'])('round-trips %p through parseTime', (text) => {
    const value = parseTime(text);
    expect(value).not.toBeNull();
    expect(parseTime(formatTime(value!))).toEqual(value);
  });
});

describe('createDisabledTimeCheck', () => {
  it('checks 24h ranges, edges included', () => {
    const isDisabled = createDisabledTimeCheck({ type: '24h', disabledTime: { ranges: ['12:00 - 13:00'] } });
    expect(isDisabled('12:30')).toBe(true);
    expect(isDisabled('13:00')).toBe(true);
    expect(isDisabled('13:01')).toBe(false);
    expect(isDisabled({ hour: 9, minutes: 0, seconds: 0 })).toBe(false);
    expect(isDisabled({ hour: 12, minutes: 59, seconds: 0 })).toBe(true);
  });

  it('checks 12h ranges with 12h edges', () => {
    const isDisabled = createDisabledTimeCheck({
      type: '12h',
      disabledTime: { ranges: ['10:00 AM - 12:00 PM'] },
    });
    expect(isDisabled('11:00 AM')).toBe(true);
    expect(isDisabled('12:00 PM')).toBe(true);
    expect(isDisabled('12:01 PM')).toBe(false);
    expect(isDisabled({ hour: 10, minutes: 30, seconds: 0 })).toBe(true);
  });

  it('reads 12h hour lists as clock numbers', () => {
    const isDisabled = createDisabledTimeCheck({ type: '12h', disabledTime: { hours: [12], minutes: [15] } });
    expect(isDisabled('12:30 AM')).toBe(true);
    expect(isDisabled('12:30 PM')).toBe(true);
    expect(isDisabled('1:15 PM')).toBe(true);
    expect(isDisabled('1:30 PM')).toBe(false);
    expect(isDisabled({ hour: 0, minutes: 30, seconds: 0 })).toBe(true);
    expect(isDisabled({ hour: 13, minutes: 30, seconds: 0 })).toBe(false);
  });

  it('uses isTimeDisabled with a 0-23 hour', () => {
    const isTimeDisabled = jest.fn(({ hour }: { hour: number }) => hour < 9);
    const isDisabled = createDisabledTimeCheck({ type: '12h', isTimeDisabled });
    expect(isDisabled('8:59 AM')).toBe(true);
    expect(isDisabled('9:00 AM')).toBe(false);
    expect(isTimeDisabled).toHaveBeenCalledWith({ hour: 8, minutes: 59, seconds: 0 });
  });

  it('checks seconds with showSeconds', () => {
    const isDisabled = createDisabledTimeCheck({
      type: '24h',
      showSeconds: true,
      disabledTime: { seconds: [30] },
    });
    expect(isDisabled('10:00:30')).toBe(true);
    expect(isDisabled('10:00:31')).toBe(false);
  });

  it('treats text and objects that are not times as disabled', () => {
    const isDisabled = createDisabledTimeCheck({ type: '24h' });
    expect(isDisabled('abc')).toBe(true);
    expect(isDisabled({ hour: 24, minutes: 0, seconds: 0 })).toBe(true);
    expect(isDisabled({ hour: 9.5, minutes: 0, seconds: 0 })).toBe(true);
    expect(isDisabled('09:00')).toBe(false);
  });

  it.each([
    [{ type: '24h', disabledTime: { ranges: ['bad'] } }, /Invalid disabledTime\.interval/],
    [{ type: '24h', disabledTime: { ranges: ['10:00 - 11:00', '10:30 - 12:00'] } }, /Overlapping intervals/],
    [{ type: '12h', disabledTime: { hours: [13] } }, /Invalid hours or minutes in disabledTime option/],
    [{ isTimeDisabled: 'nope' }, /clock\.isTimeDisabled must be a function/],
  ] as const)('throws for invalid options %#', (options, message) => {
    expect(() => createDisabledTimeCheck(options as never)).toThrow(message);
  });

  it('runs without a DOM', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });
});
