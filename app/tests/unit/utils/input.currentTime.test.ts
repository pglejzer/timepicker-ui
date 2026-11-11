import { getInputValue, neutralTime, resolveCurrentTime } from '../../../src/utils/input';

describe('neutralTime', () => {
  it('is 12:00 PM in 12h and 12:00 in 24h', () => {
    expect(neutralTime('12h')).toEqual({ hour: '12', minutes: '00', type: 'PM' });
    expect(neutralTime('24h', true)).toEqual({ hour: '12', minutes: '00', seconds: '00', type: undefined });
  });

  it('adds the seconds only when asked and falls back to PM without a clock type', () => {
    expect(neutralTime('12h', true)).toEqual({ hour: '12', minutes: '00', seconds: '00', type: 'PM' });
    expect(neutralTime('24h')).not.toHaveProperty('seconds');
    expect(neutralTime(undefined)).toEqual({ hour: '12', minutes: '00', type: 'PM' });
  });

  it('is what getInputValue returns for an empty input without a current time', () => {
    const input = document.createElement('input');

    expect(getInputValue(input, '12h')).toEqual(neutralTime('12h'));
    expect(getInputValue(input, '24h', undefined, undefined, true)).toEqual(neutralTime('24h', true));
  });
});

describe('resolveCurrentTime', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns null without a current time', () => {
    expect(resolveCurrentTime(undefined, '24h')).toBeNull();
    expect(resolveCurrentTime(false, '24h')).toBeNull();
  });

  it('uses the given date', () => {
    const result = resolveCurrentTime({ time: new Date(2026, 0, 1, 14, 5) }, '24h');
    expect(result).toEqual(expect.objectContaining({ minutes: '05' }));
    expect(Number(result?.hour)).toBe(14);
  });

  it('formats the given date for a 12h clock', () => {
    expect(resolveCurrentTime({ time: new Date(2026, 0, 1, 14, 5) }, '12h')).toEqual({
      hour: '02',
      minutes: '05',
      type: 'PM',
    });
  });

  it('reads the system clock for true and for an object without a time, with seconds on request', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 11, 7, 8, 9));

    expect(resolveCurrentTime(true, '24h', undefined, true)).toEqual({
      hour: '07',
      minutes: '08',
      seconds: '09',
      type: undefined,
    });
    expect(resolveCurrentTime({}, '12h')).toEqual({ hour: '07', minutes: '08', type: 'AM' });
  });
});

describe('getInputValue with currentTime: true (S9/S18)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 11, 14, 5, 9));
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the PM period in 12h regardless of locale formatting', () => {
    expect(getInputValue(document.createElement('input'), '12h', true)).toEqual(
      expect.objectContaining({ hour: '02', minutes: '05', type: 'PM' }),
    );
  });

  it('returns the 24h hour in 24h', () => {
    expect(getInputValue(document.createElement('input'), '24h', true)).toEqual(
      expect.objectContaining({ hour: '14', minutes: '05' }),
    );
  });
});

describe('getInputValue with currentTime at midnight and noon', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  const atTime = (hours: number): HTMLInputElement => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 11, hours, 15, 9));
    return document.createElement('input');
  };

  it.each([
    ['midnight', 0, '12h', { hour: '12', minutes: '15', type: 'AM' }],
    ['noon', 12, '12h', { hour: '12', minutes: '15', type: 'PM' }],
    ['midnight', 0, '24h', { hour: '00', minutes: '15' }],
    ['noon', 12, '24h', { hour: '12', minutes: '15' }],
  ])('returns %s (hour %i) on a %s clock as %o', (_label, hours, clockType, expected) => {
    expect(getInputValue(atTime(hours), clockType, true)).toEqual(expected);
  });

  it('adds the current seconds when showSeconds is on', () => {
    expect(getInputValue(atTime(0), '12h', true, undefined, true)).toEqual({
      hour: '12',
      minutes: '15',
      seconds: '09',
      type: 'AM',
    });
  });
});

describe('getInputValue raw value (S17)', () => {
  it('accepts a 12h value with two spaces before the period', () => {
    const input = document.createElement('input');
    input.value = '02:30  PM';
    expect(getInputValue(input, '12h').error).toBeUndefined();
  });
});
