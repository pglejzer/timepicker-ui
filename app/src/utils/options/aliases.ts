import type { ClockOptions, TimepickerOptions } from '../../types/options';
import { localeClockType } from '../time/locale';

type Group = Record<string, unknown>;
type Groups = Record<string, Group | undefined>;
type Alias = readonly [fromGroup: string, from: string, toGroup: string, to: string];
type DefaultTime = ClockOptions['defaultTime'];

const RENAMED: ReadonlyArray<Alias> = [
  ['ui', 'viewSwitch', 'ui', 'enableSwitchIcon'],
  ['ui', 'allowPageScroll', 'ui', 'enableScrollbar'],
  ['ui', 'keyboardIcon', 'ui', 'iconTemplate'],
  ['ui', 'clockIcon', 'ui', 'iconTemplateMobile'],
  ['behavior', 'returnFocus', 'behavior', 'focusInputAfterClose'],
  ['timezone', 'list', 'timezone', 'whitelist'],
  ['labels', 'clockTitle', 'labels', 'time'],
  ['labels', 'keyboardTitle', 'labels', 'mobileTime'],
  ['labels', 'clock', 'labels', 'clockLabel'],
  ['labels', 'period', 'labels', 'periodLabel'],
  ['labels', 'timeFields', 'labels', 'timeLabel'],
  ['labels', 'range', 'labels', 'rangeSelectionLabel'],
  ['labels', 'switchToKeyboard', 'labels', 'switchToKeyboardLabel'],
  ['labels', 'switchToClock', 'labels', 'switchToClockLabel'],
  ['labels', 'rangeFrom', 'range', 'fromLabel'],
  ['labels', 'rangeTo', 'range', 'toLabel'],
  ['labels', 'timezone', 'timezone', 'label'],
];

const FILLED: ReadonlyArray<Alias> = [
  ['labels', 'hour', 'labels', 'mobileHour'],
  ['labels', 'hour', 'labels', 'hourLabel'],
  ['labels', 'hour', 'labels', 'announceHour'],
  ['labels', 'minute', 'labels', 'mobileMinute'],
  ['labels', 'minute', 'labels', 'minuteLabel'],
  ['labels', 'minute', 'labels', 'announceMinute'],
  ['ui', 'appendModalSelector', 'ui', 'appendTo'],
];

const copy = (alias: Alias, groups: Groups, keepTarget: boolean): void => {
  const [fromGroup, from, toGroup, to] = alias;
  const source = groups[fromGroup];
  if (!source || !(from in source)) return;
  const target = (groups[toGroup] ??= {});
  if (keepTarget && to in target) return;
  target[to] = source[from];
};

const toCurrentTime = (value: DefaultTime): ClockOptions['currentTime'] => {
  if (value === 'now') return true;
  if (!value) return undefined;
  return { time: value.time === 'now' ? undefined : value.time, updateInput: value.updateInput };
};

const convertClock = (clock: Group): void => {
  if ('defaultTime' in clock) {
    clock.currentTime = toCurrentTime(clock.defaultTime as DefaultTime);
    delete clock.defaultTime;
  }
  if ('discreteHourJump' in clock) {
    clock.smoothHourSnap = !clock.discreteHourJump;
    delete clock.discreteHourJump;
  }
  if (clock.type === 'auto') clock.type = localeClockType();
  const disabled = clock.disabledTime as Group | undefined;
  if (disabled && 'ranges' in disabled) {
    const { ranges, ...rest } = disabled;
    clock.disabledTime = { ...rest, interval: ranges };
  }
};

const convertUi = (ui: Group, groups: Groups): void => {
  if ('initialView' in ui) {
    ui.mobile = ui.initialView === 'keyboard';
    delete ui.initialView;
  }
  if (!ui.clearButton || typeof ui.clearButton !== 'object') return;
  const { clearInput } = ui.clearButton as { clearInput?: boolean };
  ui.clearButton = true;
  if (clearInput !== undefined) (groups.clearBehavior ??= {}).clearInput = clearInput;
};

export function resolveAliases(options: TimepickerOptions): TimepickerOptions {
  const groups: Groups = {};
  Object.entries(options).forEach(([name, value]) => {
    groups[name] = value ? { ...(value as Group) } : undefined;
  });

  RENAMED.forEach((alias) => copy(alias, groups, false));
  FILLED.forEach((alias) => copy(alias, groups, true));
  [...RENAMED, ...FILLED].forEach(([fromGroup, from]) => delete groups[fromGroup]?.[from]);

  if (groups.clock) convertClock(groups.clock);
  if (groups.ui) convertUi(groups.ui, groups);

  return groups as TimepickerOptions;
}
