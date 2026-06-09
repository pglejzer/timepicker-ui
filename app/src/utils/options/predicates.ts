import type { TimepickerOptions } from '../../types/options';

type Opts = Required<TimepickerOptions>;

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
