import { HourEngine } from '@/managers/clock/engine/HourEngine';

describe('HourEngine.findNearestValid with incrementHours', () => {
  it('skips an off-grid hour even without disabled time, trying the higher neighbour first', () => {
    expect(HourEngine.findNearestValid(3, '12h', 'AM', null, false, 2)).toBe(4);
  });

  it('skips a disabled grid hour and the off-grid hours around it', () => {
    expect(HourEngine.findNearestValid(4, '12h', 'AM', { hours: ['04'] }, false, 2)).toBe(6);
  });

  it('keeps an enabled grid hour as it is', () => {
    expect(HourEngine.findNearestValid(6, '12h', 'AM', { hours: ['04'] }, false, 2)).toBe(6);
  });

  it('skips off-grid and disabled hours on a 24h face', () => {
    expect(HourEngine.findNearestValid(13, '24h', '', null, false, 2)).toBe(14);
    expect(HourEngine.findNearestValid(15, '24h', '', { hours: ['15'] }, false, 3)).toBe(18);
  });

  it('treats every hour as on the grid when incrementHours is left out', () => {
    expect(HourEngine.findNearestValid(3, '12h', 'AM', null)).toBe(3);
    expect(HourEngine.findNearestValid(5, '12h', 'AM', { hours: ['05'] }, false)).toBe(6);
  });
});
