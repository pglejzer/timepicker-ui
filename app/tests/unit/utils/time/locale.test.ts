import { localeClockType } from '@/utils/time/locale';

const mockLocaleHour12 = (hour12: boolean): void => {
  jest
    .spyOn(Intl, 'DateTimeFormat')
    .mockImplementation(() => ({ resolvedOptions: () => ({ hour12 }) }) as unknown as Intl.DateTimeFormat);
};

describe('localeClockType', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    { hour12: true, expected: '12h' },
    { hour12: false, expected: '24h' },
  ])('returns $expected when the locale formats hours with hour12: $hour12', ({ hour12, expected }) => {
    mockLocaleHour12(hour12);

    expect(localeClockType()).toBe(expected);
  });

  it('reads the locale on every call', () => {
    mockLocaleHour12(true);
    expect(localeClockType()).toBe('12h');

    jest.restoreAllMocks();
    mockLocaleHour12(false);

    expect(localeClockType()).toBe('24h');
  });
});
