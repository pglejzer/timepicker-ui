import { clockDegrees, convertTime, fromHours24, pad, timeToMinutes } from '@/utils/time/parse';

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

describe('clockDegrees', () => {
  it.each([
    { hour: '03', minutes: '00', degreesHours: 90, degreesMinutes: 0 },
    { hour: '15', minutes: '45', degreesHours: 450, degreesMinutes: 270 },
    { hour: '12', minutes: '00', degreesHours: 360, degreesMinutes: 0 },
  ])(
    'turns $hour:$minutes into $degreesHours/$degreesMinutes',
    ({ hour, minutes, degreesHours, degreesMinutes }) => {
      expect(clockDegrees({ hour, minutes })).toEqual({ degreesHours, degreesMinutes });
    },
  );
});

describe('fromHours24', () => {
  it.each([
    [0, { hour: '12', minutes: '15', type: 'AM' }],
    [1, { hour: '01', minutes: '15', type: 'AM' }],
    [11, { hour: '11', minutes: '15', type: 'AM' }],
    [12, { hour: '12', minutes: '15', type: 'PM' }],
    [13, { hour: '01', minutes: '15', type: 'PM' }],
    [23, { hour: '11', minutes: '15', type: 'PM' }],
  ])('turns hour %i into %o on a 12h clock', (hours24, expected) => {
    expect(fromHours24(hours24, { minutes: '15' }, '12h')).toEqual(expected);
  });

  it.each([
    [0, '00'],
    [9, '09'],
    [12, '12'],
    [23, '23'],
  ])('turns hour %i into %s with no period on a 24h clock', (hours24, hour) => {
    const value = fromHours24(hours24, { minutes: '15' }, '24h');

    expect(value).toEqual({ hour, minutes: '15' });
    expect(value.type).toBeUndefined();
  });

  it('passes minutes and seconds through unchanged', () => {
    expect(fromHours24(14, { minutes: '30', seconds: '45' }, '12h')).toEqual({
      hour: '02',
      minutes: '30',
      seconds: '45',
      type: 'PM',
    });
  });
});

describe('convertTime', () => {
  it.each([
    ['12', 'AM', '00'],
    ['01', 'AM', '01'],
    ['11', 'AM', '11'],
    ['12', 'PM', '12'],
    ['01', 'PM', '13'],
    ['02', 'PM', '14'],
    ['11', 'PM', '23'],
  ])('turns %s %s into %s on a 24h clock', (hour, type, expectedHour) => {
    expect(convertTime({ hour, minutes: '59', type }, '12h', { clockType: '24h' })).toEqual({
      hour: expectedHour,
      minutes: '59',
    });
  });

  it.each([
    ['00', '12', 'AM'],
    ['01', '01', 'AM'],
    ['11', '11', 'AM'],
    ['12', '12', 'PM'],
    ['13', '01', 'PM'],
    ['14', '02', 'PM'],
    ['23', '11', 'PM'],
  ])('turns %s into %s %s on a 12h clock', (hour, expectedHour, expectedType) => {
    expect(convertTime({ hour, minutes: '05' }, '24h', { clockType: '12h' })).toEqual({
      hour: expectedHour,
      minutes: '05',
      type: expectedType,
    });
  });

  it('round-trips every hour of the day through the 12h clock', () => {
    for (let hours24 = 0; hours24 < 24; hours24++) {
      const twelveHour = fromHours24(hours24, { minutes: '00' }, '12h');

      expect(convertTime(twelveHour, '12h', { clockType: '24h' }).hour).toBe(pad(hours24));
    }
  });

  it('keeps the seconds when the target shows seconds', () => {
    const value = convertTime({ hour: '14', minutes: '30', seconds: '45' }, '24h', {
      clockType: '12h',
      showSeconds: true,
    });

    expect(value).toEqual({ hour: '02', minutes: '30', seconds: '45', type: 'PM' });
  });

  it('drops the seconds when the target hides seconds', () => {
    const value = convertTime({ hour: '02', minutes: '30', seconds: '15', type: 'PM' }, '12h', {
      clockType: '24h',
      showSeconds: false,
    });

    expect(value).toEqual({ hour: '14', minutes: '30' });
    expect(value.seconds).toBeUndefined();
  });

  it('adds :00 seconds when the target shows seconds and the value has none', () => {
    const value = convertTime({ hour: '03', minutes: '45', type: 'PM' }, '12h', {
      clockType: '24h',
      showSeconds: true,
    });

    expect(value).toEqual({ hour: '15', minutes: '45', seconds: '00' });
  });

  it('only changes the seconds when the clock type stays the same', () => {
    const withoutSeconds = convertTime({ hour: '02', minutes: '30', seconds: '15', type: 'PM' }, '12h', {
      clockType: '12h',
    });
    const withSeconds = convertTime({ hour: '14', minutes: '30' }, '24h', {
      clockType: '24h',
      showSeconds: true,
    });

    expect(withoutSeconds).toEqual({ hour: '02', minutes: '30', type: 'PM' });
    expect(withSeconds).toEqual({ hour: '14', minutes: '30', seconds: '00' });
  });
});
