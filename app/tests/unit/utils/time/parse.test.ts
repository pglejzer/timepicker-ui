import { parseTime12, parseTime24, timeToMinutes, parseIntervalEdge } from '@/utils/time/parse';

describe('parseTime12', () => {
  it('parses HH:MM AM', () => {
    expect(parseTime12('9:30 AM')).toEqual({ hour: '9', minutes: '30', type: 'AM' });
  });
  it('parses HH:MM PM with lowercase', () => {
    expect(parseTime12('12:00 pm')).toEqual({ hour: '12', minutes: '00', type: 'PM' });
  });
  it('rejects 13:00 AM', () => {
    expect(parseTime12('13:00 AM')).toBeNull();
  });
  it('rejects missing period', () => {
    expect(parseTime12('9:30')).toBeNull();
  });
  it('rejects leading zero hour', () => {
    expect(parseTime12('09:30 AM')).toBeNull();
  });
});

describe('parseTime24', () => {
  it('parses HH:MM', () => {
    expect(parseTime24('14:30')).toEqual({ hour: '14', minutes: '30' });
  });
  it('parses single-digit hour', () => {
    expect(parseTime24('9:30')).toEqual({ hour: '9', minutes: '30' });
  });
  it('rejects 24:00', () => {
    expect(parseTime24('24:00')).toBeNull();
  });
  it('rejects 12:60', () => {
    expect(parseTime24('12:60')).toBeNull();
  });
});

describe('timeToMinutes', () => {
  it('converts 24h time', () => {
    expect(timeToMinutes({ hour: '14', minutes: '30' }, '24h')).toBe(870);
  });
  it('converts 12h AM (non-12)', () => {
    expect(timeToMinutes({ hour: '9', minutes: '15', type: 'AM' }, '12h')).toBe(555);
  });
  it('converts 12h 12 AM as midnight', () => {
    expect(timeToMinutes({ hour: '12', minutes: '00', type: 'AM' }, '12h')).toBe(0);
  });
  it('converts 12h 12 PM as noon', () => {
    expect(timeToMinutes({ hour: '12', minutes: '00', type: 'PM' }, '12h')).toBe(720);
  });
  it('converts 12h PM (non-12)', () => {
    expect(timeToMinutes({ hour: '3', minutes: '45', type: 'PM' }, '12h')).toBe(945);
  });
});

describe('parseIntervalEdge', () => {
  it('parses 12h edge', () => {
    expect(parseIntervalEdge('9:00 AM', '12h')).toBe(540);
  });
  it('parses 24h edge', () => {
    expect(parseIntervalEdge('14:30', '24h')).toBe(870);
  });
  it('returns 0 for invalid 12h', () => {
    expect(parseIntervalEdge('xx', '12h')).toBe(0);
  });
});
