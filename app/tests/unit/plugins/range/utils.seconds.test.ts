import {
  calculateDuration,
  calculateDurationSeconds,
  formatDisplayTime,
  parseRangeInput,
} from '@/managers/plugins/range/utils';

describe('range utils with seconds', () => {
  it('parses a 12h and a 24h range with seconds when seconds are shown', () => {
    expect(parseRangeInput('02:30:15 PM - 05:45:00 PM', true)).toEqual({
      from: { hour: '02', minutes: '30', seconds: '15', type: 'PM' },
      to: { hour: '05', minutes: '45', seconds: '00', type: 'PM' },
    });
    expect(parseRangeInput('14:30:15 - 17:45:09', true)).toEqual({
      from: { hour: '14', minutes: '30', seconds: '15' },
      to: { hour: '17', minutes: '45', seconds: '09' },
    });
  });

  it('reads an HH:MM edge as :00 when seconds are shown', () => {
    expect(parseRangeInput('14:30 - 15:00:30', true)).toEqual({
      from: { hour: '14', minutes: '30', seconds: '00' },
      to: { hour: '15', minutes: '00', seconds: '30' },
    });
  });

  it('formats a value with seconds when seconds are shown', () => {
    const afternoon = { hour: '02', minutes: '30', seconds: '15', type: 'PM' };

    expect(formatDisplayTime(afternoon, true)).toBe('02:30:15 PM');
    expect(formatDisplayTime({ hour: '14', minutes: '05', seconds: '09' }, true)).toBe('14:05:09');
  });

  it('keeps duration in whole minutes (floor) and reports the exact seconds', () => {
    const from = { hour: '14', minutes: '30', seconds: '15' };
    const nextMinute = { hour: '14', minutes: '31', seconds: '00' };
    const later = { hour: '14', minutes: '33', seconds: '14' };

    expect(calculateDuration(from, nextMinute, '24h')).toBe(0);
    expect(calculateDurationSeconds(from, nextMinute, '24h')).toBe(45);
    expect(calculateDuration(from, later, '24h')).toBe(2);
    expect(calculateDurationSeconds(from, later, '24h')).toBe(179);
    expect(calculateDurationSeconds(null, later, '24h')).toBe(0);
  });

  it('counts seconds across noon on a 12h clock', () => {
    const from = { hour: '11', minutes: '59', seconds: '30', type: 'AM' };
    const to = { hour: '12', minutes: '00', seconds: '15', type: 'PM' };

    expect(calculateDurationSeconds(from, to, '12h')).toBe(45);
    expect(calculateDuration(from, to, '12h')).toBe(0);
  });

  it('keeps parsing, formatting and durations minute-based when seconds are not shown', () => {
    expect(parseRangeInput('02:30:15 PM - 05:45:00 PM')).toEqual({
      from: { hour: '02', minutes: '30', type: 'PM' },
      to: { hour: '05', minutes: '45', type: 'PM' },
    });
    expect(formatDisplayTime({ hour: '02', minutes: '30', seconds: '15', type: 'PM' })).toBe('02:30 PM');
    expect(calculateDuration({ hour: '14', minutes: '30' }, { hour: '14', minutes: '31' }, '24h')).toBe(1);
  });
});
