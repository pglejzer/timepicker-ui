import { getInputValue } from '../../../src/utils/input';

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
