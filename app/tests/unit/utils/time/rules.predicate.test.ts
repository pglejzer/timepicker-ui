import {
  isHourDisabled,
  isMinuteDisabled,
  isSecondDisabled,
  isUnitDisabled,
  type DisabledRules,
} from '@/utils/time/rules';

const rules24 = (extra: Partial<DisabledRules> = {}): DisabledRules => ({ clockType: '24h', ...extra });

describe('rules without a predicate keep today\'s results', () => {
  const rules = rules24({ hours: ['3'], minutes: ['15'], intervals: ['10:00 - 10:59'] });

  it.each([
    ['03', '00', true],
    ['04', '15', true],
    ['10', '30', true],
    ['11', '30', false],
    ['09', '59', false],
  ])('isSecondDisabled %s:%s -> %p', (hour, minutes, expected) => {
    expect(isSecondDisabled(rules, { hour, minutes, seconds: '00' })).toBe(expected);
  });

  it('treats an undefined predicate like a missing key', () => {
    const withKey = rules24({ intervals: ['10:00 - 10:59'], predicate: undefined });
    const without = rules24({ intervals: ['10:00 - 10:59'] });

    for (let hour = 0; hour < 24; hour++) {
      const time = { hour: String(hour), minutes: '00' };
      expect(isHourDisabled(withKey, time, false)).toBe(isHourDisabled(without, time, false));
      expect(isMinuteDisabled(withKey, time, false)).toBe(isMinuteDisabled(without, time, false));
    }
  });
});

describe('rules with a predicate', () => {
  it('the predicate alone disables a second, a minute and an hour', () => {
    const rules = rules24({ predicate: (second) => second >= 9 * 3600 && second < 10 * 3600 });

    expect(isSecondDisabled(rules, { hour: '09', minutes: '30', seconds: '10' })).toBe(true);
    expect(isSecondDisabled(rules, { hour: '10', minutes: '00', seconds: '00' })).toBe(false);
    expect(isMinuteDisabled(rules, { hour: '09', minutes: '30' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '09' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '10' }, false)).toBe(false);
  });

  it('is a union with disabled lists', () => {
    const rules = rules24({ hours: ['5'], predicate: (second) => Math.floor(second / 3600) === 9 });

    expect(isHourDisabled(rules, { hour: '05' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '09' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '07' }, false)).toBe(false);
  });

  it('is a union with intervals: an hour is disabled when interval and predicate cover it together', () => {
    const rules = rules24({
      intervals: ['08:00 - 08:29'],
      predicate: (second) => Math.floor(second / 3600) === 8 && second % 3600 >= 1800,
    });

    expect(isHourDisabled(rules, { hour: '08' }, false)).toBe(true);
    expect(isMinuteDisabled(rules, { hour: '08', minutes: '10' }, false)).toBe(true);
    expect(isMinuteDisabled(rules, { hour: '08', minutes: '45' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '09' }, false)).toBe(false);
  });

  it('an hour stays enabled while one minute inside it is free', () => {
    const rules = rules24({ predicate: (second) => second !== 14 * 3600 + 20 * 60 });

    expect(isHourDisabled(rules, { hour: '14' }, false)).toBe(false);
    expect(isMinuteDisabled(rules, { hour: '14', minutes: '20' }, false)).toBe(false);
    expect(isMinuteDisabled(rules, { hour: '14', minutes: '21' }, false)).toBe(true);
  });

  it('without showSeconds a minute is judged by second 0 of that minute', () => {
    const rules = rules24({ predicate: (second) => second === 10 * 3600 + 30 * 60 });

    expect(isMinuteDisabled(rules, { hour: '10', minutes: '30' }, false)).toBe(true);
    expect(isMinuteDisabled(rules, { hour: '10', minutes: '30' }, true)).toBe(false);
  });

  it('with showSeconds a minute is disabled only when all 60 seconds are', () => {
    const allButOne = rules24({ predicate: (second) => second !== 10 * 3600 + 30 * 60 + 17 });
    const all = rules24({ predicate: () => true });

    expect(isMinuteDisabled(allButOne, { hour: '10', minutes: '30' }, true)).toBe(false);
    expect(isMinuteDisabled(all, { hour: '10', minutes: '30' }, true)).toBe(true);
    expect(isHourDisabled(allButOne, { hour: '10' }, true)).toBe(false);
    expect(isHourDisabled(all, { hour: '10' }, true)).toBe(true);
  });

  it('with showSeconds, listed seconds count as disabled inside a minute', () => {
    const rules = rules24({
      seconds: ['0', '1'],
      predicate: (second) => second % 60 >= 2,
    });

    expect(isMinuteDisabled(rules, { hour: '10', minutes: '30' }, true)).toBe(true);
  });

  it('isUnitDisabled routes each unit to the predicate', () => {
    const rules = rules24({ predicate: (second) => Math.floor(second / 3600) === 9 });
    const time = { hour: '09', minutes: '10', seconds: '10' };

    expect(isUnitDisabled(rules, 'hour', time, false)).toBe(true);
    expect(isUnitDisabled(rules, 'minutes', time, false)).toBe(true);
    expect(isUnitDisabled(rules, 'seconds', time, true)).toBe(true);
  });

  it('hands the predicate a 24h second of day in 12h', () => {
    const seen: number[] = [];
    const rules: DisabledRules = {
      clockType: '12h',
      predicate: (second) => {
        seen.push(second);
        return false;
      },
    };

    isSecondDisabled(rules, { hour: '01', minutes: '05', seconds: '00', type: 'PM' });
    isSecondDisabled(rules, { hour: '12', minutes: '00', seconds: '00', type: 'AM' });
    isSecondDisabled(rules, { hour: '12', minutes: '00', seconds: '00', type: 'PM' });

    expect(seen).toEqual([13 * 3600 + 5 * 60, 0, 12 * 3600]);
  });

  it('a 12h hour is disabled through its 24h equivalent', () => {
    const rules: DisabledRules = { clockType: '12h', predicate: (second) => Math.floor(second / 3600) === 13 };

    expect(isHourDisabled(rules, { hour: '01', type: 'PM' }, false)).toBe(true);
    expect(isHourDisabled(rules, { hour: '01', type: 'AM' }, false)).toBe(false);
  });
});
