import {
  parseInterval,
  findOverlappingIntervals,
  isSecondDisabled,
  isMinuteDisabled,
  isHourDisabled,
  isUnitDisabled,
  findNearestEnabled,
  type DisabledRules,
} from '@/utils/time/rules';

const r24 = (over: Partial<DisabledRules> = {}): DisabledRules => ({ clockType: '24h', ...over });

describe('parseInterval', () => {
  it('expands an end edge without seconds to the whole minute', () => {
    expect(parseInterval('10:00 - 12:30', '24h')).toEqual({
      start: 36000,
      end: 45059,
      source: '10:00 - 12:30',
    });
  });
  it('keeps edges with seconds exact', () => {
    expect(parseInterval('10:00:30 - 10:05:00', '24h')).toEqual({
      start: 36030,
      end: 36300,
      source: '10:00:30 - 10:05:00',
    });
  });
  it('parses 12h edges with AM/PM and mixed precision', () => {
    expect(parseInterval('10:00 AM - 10:05:30 AM', '12h')).toEqual({
      start: 36000,
      end: 36330,
      source: '10:00 AM - 10:05:30 AM',
    });
  });
  it('is anchored: a 12h edge with seconds is not read as minutes (S19)', () => {
    expect(parseInterval('10:00:30 AM - 11:00 AM', '12h')?.start).toBe(36030);
  });
  it('returns null for a 24h edge with AM/PM or garbage', () => {
    expect(parseInterval('10:00 AM - 11:00 AM', '24h')).toBeNull();
    expect(parseInterval('nonsense', '24h')).toBeNull();
  });
});

describe('findOverlappingIntervals', () => {
  it('accepts intervals that only touch at second resolution', () => {
    expect(findOverlappingIntervals(['10:00:00 - 10:00:30', '10:00:31 - 10:01:00'], '24h')).toBeNull();
  });
  it('returns the overlapping pair', () => {
    expect(findOverlappingIntervals(['10:00 - 11:00', '10:30 - 12:00'], '24h')).toEqual([
      '10:00 - 11:00',
      '10:30 - 12:00',
    ]);
  });
  it('treats a minute-precision end as covering its whole minute', () => {
    expect(findOverlappingIntervals(['10:00 - 11:00', '11:00 - 12:00'], '24h')).not.toBeNull();
  });
});

describe('isSecondDisabled', () => {
  it('disables listed seconds in every minute', () => {
    const rules = r24({ seconds: ['15', 30] });
    expect(isSecondDisabled(rules, { hour: '09', minutes: '41', seconds: '15' })).toBe(true);
    expect(isSecondDisabled(rules, { hour: '09', minutes: '41', seconds: '16' })).toBe(false);
  });
  it('uses interval edges inclusively at second resolution', () => {
    const rules = r24({ intervals: ['10:00:30 - 10:05:00'] });
    expect(isSecondDisabled(rules, { hour: '10', minutes: '00', seconds: '29' })).toBe(false);
    expect(isSecondDisabled(rules, { hour: '10', minutes: '00', seconds: '30' })).toBe(true);
    expect(isSecondDisabled(rules, { hour: '10', minutes: '05', seconds: '00' })).toBe(true);
    expect(isSecondDisabled(rules, { hour: '10', minutes: '05', seconds: '01' })).toBe(false);
  });
  it('handles a 12h interval crossing noon (review focus 1)', () => {
    const rules: DisabledRules = { clockType: '12h', intervals: ['11:59:30 AM - 12:00:30 PM'] };
    expect(isSecondDisabled(rules, { hour: '11', minutes: '59', seconds: '45', type: 'AM' })).toBe(true);
    expect(isSecondDisabled(rules, { hour: '12', minutes: '00', seconds: '30', type: 'PM' })).toBe(true);
    expect(isSecondDisabled(rules, { hour: '12', minutes: '00', seconds: '31', type: 'PM' })).toBe(false);
    expect(isSecondDisabled(rules, { hour: '12', minutes: '00', seconds: '10', type: 'AM' })).toBe(false);
  });
  it('returns false without rules', () => {
    expect(isSecondDisabled(null, { hour: '10', minutes: '00', seconds: '00' })).toBe(false);
  });
});

describe('isMinuteDisabled', () => {
  it('without seconds: a minute is disabled when its :00 is inside an interval', () => {
    const rules = r24({ intervals: ['10:00 - 12:30'] });
    expect(isMinuteDisabled(rules, { hour: '12', minutes: '30' }, false)).toBe(true);
    expect(isMinuteDisabled(rules, { hour: '12', minutes: '31' }, false)).toBe(false);
    expect(isMinuteDisabled(rules, { hour: '09', minutes: '59' }, false)).toBe(false);
  });
  it('with seconds: a minute is disabled only when all 60 seconds are disabled', () => {
    const rules = r24({ intervals: ['10:00:30 - 10:05:00'] });
    expect(isMinuteDisabled(rules, { hour: '10', minutes: '00' }, true)).toBe(false);
    expect(isMinuteDisabled(rules, { hour: '10', minutes: '01' }, true)).toBe(true);
    expect(isMinuteDisabled(rules, { hour: '10', minutes: '05' }, true)).toBe(false);
  });
  it('ignores the seconds list when seconds are not shown', () => {
    const rules = r24({ seconds: Array.from({ length: 60 }, (_, i) => i) });
    expect(isMinuteDisabled(rules, { hour: '10', minutes: '00' }, false)).toBe(false);
    expect(isMinuteDisabled(rules, { hour: '10', minutes: '00' }, true)).toBe(true);
  });
  it('disables listed minutes', () => {
    expect(isMinuteDisabled(r24({ minutes: ['05'] }), { hour: '10', minutes: '05' }, false)).toBe(true);
  });
});

describe('isHourDisabled', () => {
  it('disables listed hours', () => {
    expect(isHourDisabled(r24({ hours: ['3'] }), { hour: '03' }, false)).toBe(true);
  });
  it('disables an hour fully covered by an interval', () => {
    const rules = r24({ intervals: ['10:00 - 11:59'] });
    expect(isHourDisabled(rules, { hour: '10' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '11' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '12' }, false)).toBe(false);
  });
  it('with seconds: an hour with one free second is not disabled', () => {
    const rules = r24({ intervals: ['10:00:00 - 10:59:58'] });
    expect(isHourDisabled(rules, { hour: '10' }, true)).toBe(false);
    expect(isHourDisabled(rules, { hour: '10' }, false)).toBe(true);
  });
  it('12h: the same hour number is evaluated per period', () => {
    const rules: DisabledRules = { clockType: '12h', intervals: ['1:00 PM - 1:59 PM'] };
    expect(isHourDisabled(rules, { hour: '01', type: 'PM' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '01', type: 'AM' }, false)).toBe(false);
  });
});

describe('isUnitDisabled', () => {
  const time = { hour: '10', minutes: '30', seconds: '15' };
  const units = ['hour', 'minutes', 'seconds'] as const;
  const perUnit = (rules: DisabledRules | null, showSeconds: boolean): Record<string, boolean> =>
    Object.fromEntries(units.map((unit) => [unit, isUnitDisabled(rules, unit, time, showSeconds)]));

  it.each([
    ['a listed hour', r24({ hours: ['10'] }), { hour: true, minutes: true, seconds: true }],
    ['a listed minute', r24({ minutes: ['30'] }), { hour: false, minutes: true, seconds: true }],
    ['a listed second', r24({ seconds: ['15'] }), { hour: false, minutes: false, seconds: true }],
  ])('checks each unit against %s', (_, rules, expected) => {
    expect(perUnit(rules, false)).toEqual(expected);
  });

  it('applies an interval at the precision of each unit', () => {
    const rules = r24({ intervals: ['10:30:15 - 10:30:45'] });

    expect(perUnit(rules, true)).toEqual({ hour: false, minutes: false, seconds: true });
    expect(isUnitDisabled(rules, 'seconds', { ...time, seconds: '50' }, true)).toBe(false);
  });

  it('disables the hour unit when an interval covers the whole hour', () => {
    expect(perUnit(r24({ intervals: ['10:00 - 10:59'] }), false)).toEqual({
      hour: true,
      minutes: true,
      seconds: true,
    });
  });

  it('returns false for every unit without rules', () => {
    expect(perUnit(null, true)).toEqual({ hour: false, minutes: false, seconds: false });
  });
});

describe('findNearestEnabled', () => {
  const disabledSet =
    (...values: number[]) =>
    (candidate: number): boolean =>
      values.includes(candidate);

  it('returns the value itself when it is enabled', () => {
    expect(findNearestEnabled(5, 0, 59, disabledSet())).toBe(5);
  });

  it('prefers the higher neighbour when both neighbours are enabled', () => {
    expect(findNearestEnabled(5, 0, 59, disabledSet(5))).toBe(6);
  });

  it('takes the lower neighbour when it is nearer than the next enabled higher value', () => {
    expect(findNearestEnabled(5, 0, 59, disabledSet(5, 6, 7))).toBe(4);
  });

  it('wraps above the maximum to the minimum', () => {
    expect(findNearestEnabled(12, 1, 12, disabledSet(11, 12))).toBe(1);
  });

  it('wraps below the minimum to the maximum', () => {
    expect(findNearestEnabled(0, 0, 23, disabledSet(0, 1))).toBe(23);
  });

  it('reaches a value half the range away', () => {
    expect(findNearestEnabled(0, 0, 59, (candidate) => candidate !== 30)).toBe(30);
  });

  it('returns the input when every value is disabled', () => {
    expect(findNearestEnabled(7, 1, 12, () => true)).toBe(7);
  });
});
