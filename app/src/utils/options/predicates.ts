import type { TimepickerOptions } from '../../types/options';
import type { ClockType, TimeFormatOptions } from '../time/parse';

type Opts = Required<TimepickerOptions>;

export function getClockType(options: Opts): ClockType {
  return options.clock.type === '24h' ? '24h' : '12h';
}

export function getTimeFormat(options: Opts): Required<TimeFormatOptions> {
  return { clockType: getClockType(options), showSeconds: !!options.clock.showSeconds };
}

export function isWheelMode(options: Opts): boolean {
  const mode = options.ui.mode;
  return mode === 'wheel' || mode === 'compact-wheel';
}

export function isCompactWheelMode(options: Opts): boolean {
  return options.ui.mode === 'compact-wheel';
}

export function isPopoverMode(options: Opts): boolean {
  return isCompactWheelMode(options) && !!options.wheel?.placement;
}

export function isInlineMode(options: Opts): boolean {
  return !!options.ui.inline?.enabled;
}
