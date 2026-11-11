import type { CoreState } from '../../../timepicker/CoreState';
import type { UpdateEventData } from '../../../types/types';
import type { PluginTimeView } from '../../../core/PluginRegistry';
import { getClockType, isWheelMode } from '../../../utils/options/predicates';
import { neutralTime, resolveCurrentTime } from '../../../utils/input';
import type { RangeState } from './RangeState';
import type { RangeUI } from './RangeUI';
import type { RangeValue } from './types';
import { isValueComplete } from './utils';

const WHEEL_MODE_CLASSES: readonly string[] = ['tp-ui-wheel-mode', 'tp-ui-compact-wheel-mode'];

export class RangeWheelView {
  private readonly core: CoreState;
  private view: PluginTimeView | null = null;

  constructor(core: CoreState) {
    this.core = core;
  }

  setView(view: PluginTimeView): void {
    this.view = view;
  }

  isActive(): boolean {
    const modal = this.core.getModalElement();
    if (!modal || !WHEEL_MODE_CLASSES.some((name) => modal.classList.contains(name))) return false;

    return isWheelMode(this.core.options);
  }

  show(state: RangeState, ui: RangeUI, seedEmpty = true): void {
    if (seedEmpty && !state.getSavedValue()) {
      this.writeActive(state, this.seedFor(state));
    }

    const value = state.getSavedValue();
    if (!value) return;

    ui.writeActivePartValues();
    this.view?.show(value);
  }

  applyUpdate(state: RangeState, data: UpdateEventData | undefined): boolean {
    const value = this.toRangeValue(data ?? {});
    if (!value) return false;

    this.writeActive(state, value);
    state.setPreviewValue(null);
    return true;
  }

  private seedFor(state: RangeState): RangeValue | null {
    const other = state.getActivePart() === 'from' ? state.getToValue() : state.getFromValue();
    if (other) return { ...other };

    const { currentTime, showSeconds } = this.core.options.clock;
    const clockType = getClockType(this.core.options);
    const withSeconds = showSeconds === true;
    const start =
      resolveCurrentTime(currentTime, clockType, false, withSeconds) ?? neutralTime(clockType, withSeconds);
    return this.toRangeValue(start);
  }

  private writeActive(state: RangeState, value: RangeValue | null): void {
    if (state.getActivePart() === 'from') {
      state.setFromValue(value);
    } else {
      state.setToValue(value);
    }
  }

  private toRangeValue({ hour, minutes, seconds, type }: UpdateEventData): RangeValue | null {
    const clockType = getClockType(this.core.options);
    const value: RangeValue = { hour: hour ?? '', minutes: minutes ?? '' };
    if (this.core.options.clock.showSeconds === true) {
      value.seconds = seconds ?? '00';
    }
    if (clockType === '12h') {
      value.type = type;
    }
    return isValueComplete(value, clockType) ? value : null;
  }
}
