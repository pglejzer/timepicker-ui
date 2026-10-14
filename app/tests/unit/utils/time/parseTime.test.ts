import { parseTime, formatTime, hasSeconds, timeToSeconds } from '@/utils/time/parse';

type Clock = '12h' | '24h';

describe('parseTime', () => {
  it.each([
    ['14:30', '24h', false, { hour: '14', minutes: '30' }],
    ['9:05', '24h', false, { hour: '09', minutes: '05' }],
    ['9:5', '24h', false, { hour: '09', minutes: '05' }],
    ['14:30:15', '24h', false, { hour: '14', minutes: '30' }],
    ['14:30', '24h', true, { hour: '14', minutes: '30', seconds: '00' }],
    ['14:30:15', '24h', true, { hour: '14', minutes: '30', seconds: '15' }],
    ['2:30 PM', '12h', false, { hour: '02', minutes: '30', type: 'PM' }],
    ['02:30 pm', '12h', false, { hour: '02', minutes: '30', type: 'PM' }],
    ['02:30  PM', '12h', false, { hour: '02', minutes: '30', type: 'PM' }],
    ['02:30:15 AM', '12h', true, { hour: '02', minutes: '30', seconds: '15', type: 'AM' }],
    ['12:00PM', '12h', true, { hour: '12', minutes: '00', seconds: '00', type: 'PM' }],
  ])('parses %s (%s, showSeconds=%s)', (text, clockType, showSeconds, expected) => {
    expect(
      parseTime(text as string, { clockType: clockType as Clock, showSeconds: showSeconds as boolean }),
    ).toEqual(expected);
  });

  it.each([
    ['24:00', '24h'],
    ['12:60', '24h'],
    ['14:30:60', '24h'],
    ['14:30 PM', '24h'],
    ['13:00 AM', '12h'],
    ['00:30 AM', '12h'],
    ['2:30', '12h'],
    ['10:00:30 AMX', '12h'],
    ['', '24h'],
  ])('rejects %s (%s)', (text, clockType) => {
    expect(parseTime(text, { clockType: clockType as Clock, showSeconds: true })).toBeNull();
  });
});

describe('formatTime', () => {
  it('formats 24h without seconds as HH:MM', () => {
    expect(formatTime({ hour: '9', minutes: '5' }, { clockType: '24h' })).toBe('09:05');
  });
  it('formats 12h without seconds as HH:MM AM', () => {
    expect(formatTime({ hour: '2', minutes: '30', type: 'PM' }, { clockType: '12h' })).toBe('02:30 PM');
  });
  it('formats 24h with seconds', () => {
    expect(
      formatTime({ hour: '14', minutes: '30', seconds: '5' }, { clockType: '24h', showSeconds: true }),
    ).toBe('14:30:05');
  });
  it('formats 12h with seconds', () => {
    expect(
      formatTime(
        { hour: '02', minutes: '30', seconds: '15', type: 'PM' },
        { clockType: '12h', showSeconds: true },
      ),
    ).toBe('02:30:15 PM');
  });
  it('adds :00 when showSeconds is on and seconds are missing', () => {
    expect(formatTime({ hour: '14', minutes: '30' }, { clockType: '24h', showSeconds: true })).toBe(
      '14:30:00',
    );
  });
  it('drops seconds when showSeconds is off', () => {
    expect(formatTime({ hour: '14', minutes: '30', seconds: '15' }, { clockType: '24h' })).toBe('14:30');
  });
  it('round-trips through parseTime', () => {
    const opts = { clockType: '12h' as const, showSeconds: true };
    expect(formatTime(parseTime('7:08:09 am', opts)!, opts)).toBe('07:08:09 AM');
  });
});

describe('hasSeconds', () => {
  it.each([
    ['14:30:15', true],
    ['2:30:15 PM', true],
    ['14:30', false],
    ['2:30 PM', false],
  ])('%s → %s', (text, expected) => {
    expect(hasSeconds(text)).toBe(expected);
  });
});

describe('timeToSeconds', () => {
  it('converts 24h', () => {
    expect(timeToSeconds({ hour: '14', minutes: '30', seconds: '15' }, '24h')).toBe(52215);
  });
  it('treats 12 AM as midnight', () => {
    expect(timeToSeconds({ hour: '12', minutes: '00', seconds: '05', type: 'AM' }, '12h')).toBe(5);
  });
  it('treats 12 PM as noon', () => {
    expect(timeToSeconds({ hour: '12', minutes: '00', type: 'PM' }, '12h')).toBe(43200);
  });
  it('converts 1:02:03 PM', () => {
    expect(timeToSeconds({ hour: '01', minutes: '02', seconds: '03', type: 'PM' }, '12h')).toBe(46923);
  });
});
