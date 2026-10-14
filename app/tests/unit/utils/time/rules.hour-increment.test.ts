import { isHourOnIncrement } from '@/utils/time/rules';

describe('isHourOnIncrement', () => {
  it.each([
    [12, 2, true],
    [0, 2, true],
    [2, 2, true],
    [3, 2, false],
    [14, 2, true],
    [13, 2, false],
    [5, 5, true],
    [12, 5, true],
    [17, 5, true],
    [15, 5, false],
  ])('hour %i with incrementHours %i is on the grid: %s', (hour, increment, expected) => {
    expect(isHourOnIncrement(hour, increment)).toBe(expected);
  });

  it('accepts every hour of both clocks when incrementHours is 1', () => {
    const hours = Array.from({ length: 24 }, (_, hour) => hour);

    expect(hours.filter((hour) => !isHourOnIncrement(hour, 1))).toEqual([]);
  });
});
