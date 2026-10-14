import { resolveAliases } from '@/utils/options/aliases';
import { mergeOptions } from '@/utils/options';
import type { TimepickerOptions } from '@/types/options';

const mockLocaleHour12 = (hour12: boolean): void => {
  jest
    .spyOn(Intl, 'DateTimeFormat')
    .mockImplementation(() => ({ resolvedOptions: () => ({ hour12 }) }) as unknown as Intl.DateTimeFormat);
};

describe('resolveAliases', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('writes renamed ui, behavior, timezone and label keys onto the keys the picker reads', () => {
    const out = resolveAliases({
      ui: { viewSwitch: true, allowPageScroll: true, keyboardIcon: '<i>k</i>', clockIcon: '<i>c</i>' },
      behavior: { returnFocus: true },
      timezone: { list: ['UTC'] },
      labels: {
        clockTitle: 'A',
        keyboardTitle: 'B',
        clock: 'C',
        period: 'D',
        timeFields: 'E',
        range: 'F',
        switchToKeyboard: 'G',
        switchToClock: 'H',
      },
    });

    expect(out.ui).toEqual({
      enableSwitchIcon: true,
      enableScrollbar: true,
      iconTemplate: '<i>k</i>',
      iconTemplateMobile: '<i>c</i>',
    });
    expect(out.behavior).toEqual({ focusInputAfterClose: true });
    expect(out.timezone).toEqual({ whitelist: ['UTC'] });
    expect(out.labels).toEqual({
      time: 'A',
      mobileTime: 'B',
      clockLabel: 'C',
      periodLabel: 'D',
      timeLabel: 'E',
      rangeSelectionLabel: 'F',
      switchToKeyboardLabel: 'G',
      switchToClockLabel: 'H',
    });
  });

  it('moves the range and timezone labels into their groups', () => {
    const out = resolveAliases({ labels: { rangeFrom: 'Od', rangeTo: 'Do', timezone: 'Strefa' } });

    expect(out.range).toEqual({ fromLabel: 'Od', toLabel: 'Do' });
    expect(out.timezone).toEqual({ label: 'Strefa' });
    expect(out.labels).toEqual({});
  });

  it.each<[string, TimepickerOptions, TimepickerOptions]>([
    [
      'viewSwitch over enableSwitchIcon',
      { ui: { enableSwitchIcon: false, viewSwitch: true } },
      { ui: { enableSwitchIcon: true } },
    ],
    ['initialView over mobile', { ui: { mobile: true, initialView: 'clock' } }, { ui: { mobile: false } }],
    [
      'defaultTime over currentTime',
      { clock: { currentTime: true, defaultTime: undefined } },
      { clock: { currentTime: undefined } },
    ],
    [
      'discreteHourJump over smoothHourSnap',
      { clock: { smoothHourSnap: true, discreteHourJump: true } },
      { clock: { smoothHourSnap: false } },
    ],
    [
      'disabledTime.ranges over disabledTime.interval',
      { clock: { disabledTime: { interval: '10:00 - 11:00', ranges: '12:00 - 13:00' } } },
      { clock: { disabledTime: { interval: '12:00 - 13:00' } } },
    ],
    [
      'the clearButton object over clearBehavior',
      { ui: { clearButton: { clearInput: true } }, clearBehavior: { clearInput: false } },
      { ui: { clearButton: true }, clearBehavior: { clearInput: true } },
    ],
    [
      'labels.rangeFrom over range.fromLabel',
      { range: { fromLabel: 'A' }, labels: { rangeFrom: 'B' } },
      { range: { fromLabel: 'B' }, labels: {} },
    ],
  ])('lets the new name win when both names are set (%s)', (_name, options, expected) => {
    expect(resolveAliases(options)).toStrictEqual(expected);
  });

  it('fills the three uses of a unit label unless an old key is set', () => {
    const out = resolveAliases({ labels: { hour: 'Godzina', minute: 'Minuta', announceMinute: 'Minuty' } });

    expect(out.labels).toEqual({
      mobileHour: 'Godzina',
      hourLabel: 'Godzina',
      announceHour: 'Godzina',
      mobileMinute: 'Minuta',
      minuteLabel: 'Minuta',
      announceMinute: 'Minuty',
    });
  });

  it('converts defaultTime, discreteHourJump, ranges, initialView and the clearButton object', () => {
    const date = new Date(2026, 0, 1, 9, 30);

    expect(resolveAliases({ clock: { defaultTime: 'now' } }).clock).toEqual({ currentTime: true });
    expect(resolveAliases({ clock: { defaultTime: { time: date, updateInput: false } } }).clock).toEqual({
      currentTime: { time: date, updateInput: false },
    });
    expect(resolveAliases({ clock: { defaultTime: { time: 'now' } } }).clock).toEqual({
      currentTime: { time: undefined, updateInput: undefined },
    });
    expect(resolveAliases({ clock: { discreteHourJump: true } }).clock).toEqual({ smoothHourSnap: false });
    expect(
      resolveAliases({ clock: { disabledTime: { hours: [1], ranges: ['10:00 - 11:00'] } } }).clock,
    ).toEqual({ disabledTime: { hours: [1], interval: ['10:00 - 11:00'] } });
    expect(resolveAliases({ ui: { initialView: 'keyboard' } }).ui).toEqual({ mobile: true });
    expect(resolveAliases({ ui: { clearButton: { clearInput: false } } })).toEqual({
      ui: { clearButton: true },
      clearBehavior: { clearInput: false },
    });
  });

  it('keeps explicit off values so they override earlier options', () => {
    expect(resolveAliases({ clock: { defaultTime: undefined } }).clock).toStrictEqual({
      currentTime: undefined,
    });
    expect(resolveAliases({ ui: { initialView: 'clock' } }).ui).toStrictEqual({ mobile: false });
    expect(resolveAliases({ clock: { discreteHourJump: false } }).clock).toStrictEqual({
      smoothHourSnap: true,
    });
  });

  it('copies appendModalSelector to appendTo unless appendTo is set', () => {
    expect(resolveAliases({ ui: { appendModalSelector: '#a' } }).ui).toEqual({ appendTo: '#a' });
    expect(resolveAliases({ ui: { appendModalSelector: '#a', appendTo: '#b' } }).ui).toEqual({
      appendTo: '#b',
    });
  });

  it.each([
    { hour12: true, type: '12h' },
    { hour12: false, type: '24h' },
  ])('resolves clock.type auto to $type when the locale uses hour12: $hour12', ({ hour12, type }) => {
    mockLocaleHour12(hour12);

    expect(resolveAliases({ clock: { type: 'auto' } }).clock).toEqual({ type });
  });

  it('keeps a fixed clock.type whatever the locale uses', () => {
    mockLocaleHour12(true);

    expect(resolveAliases({ clock: { type: '24h' } }).clock).toEqual({ type: '24h' });
  });

  it('passes a config that uses only old names through unchanged', () => {
    const options: TimepickerOptions = {
      clock: {
        currentTime: { time: new Date(2026, 0, 1, 9, 30), updateInput: true, preventClockType: true },
        smoothHourSnap: false,
        disabledTime: { interval: '10:00 - 11:00' },
      },
      ui: {
        mobile: true,
        enableSwitchIcon: true,
        enableScrollbar: true,
        iconTemplate: '<i>k</i>',
        inline: { enabled: true, containerId: 'host' },
      },
      labels: { time: 'A', hourLabel: 'B', announceMinute: 'C' },
      behavior: { focusInputAfterClose: true },
      timezone: { whitelist: ['UTC'], label: 'Strefa' },
      range: { fromLabel: 'Od' },
      clearBehavior: { clearInput: false },
    };

    const out = resolveAliases(options);

    expect(out).toEqual(options);
    expect(out).not.toBe(options);
  });

  it('does not modify the options it receives', () => {
    const options = Object.freeze({
      clock: Object.freeze({
        defaultTime: 'now' as const,
        disabledTime: Object.freeze({ ranges: ['10:00 - 11:00'] }),
      }),
      ui: Object.freeze({ viewSwitch: true, clearButton: Object.freeze({ clearInput: false }) }),
      labels: Object.freeze({ hour: 'H', rangeFrom: 'Od' }),
      clearBehavior: Object.freeze({ clearInput: true }),
    });

    expect(() => resolveAliases(options)).not.toThrow();
    expect(resolveAliases(options)).toEqual(resolveAliases(options));
    expect(options).toEqual({
      clock: { defaultTime: 'now', disabledTime: { ranges: ['10:00 - 11:00'] } },
      ui: { viewSwitch: true, clearButton: { clearInput: false } },
      labels: { hour: 'H', rangeFrom: 'Od' },
      clearBehavior: { clearInput: true },
    });
  });

  it('keeps the current label defaults when no new name is used', () => {
    const { labels } = mergeOptions({});

    expect(labels.announceMinute).toBe('Minutes');
    expect(labels.second).toBe('Second');
  });
});
