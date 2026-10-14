import { getInputValue } from '../../utils/input';
import { getTimeFormat } from '../../utils/options/predicates';
import { clockDegrees, convertTime, formatTime, parseTime, type TimeValue } from '../../utils/time/parse';
import { setActivePeriod, setSpinbuttonValue } from '../../utils/accessibility';
import type { TimepickerOptions } from '../../types/options';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';
import { TIME_FIELD_NAMES, getTimeInput } from '../events/timeFields';

const RANGE_SEPARATOR = ' - ';
const MAX_TIME_PARTS = 2;

const isTimeValue = (value: TimeValue | null): value is TimeValue => value !== null;

export class InputValueHandler {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  private isCurrentTimeEnabled(optionKey: 'preventClockType' | 'updateInput'): boolean {
    const currentTime = this.core.options.clock.currentTime;
    if (typeof currentTime === 'boolean') return currentTime;
    return !!currentTime?.[optionKey];
  }

  preventClockTypeByCurrentTime(): void {
    if (!this.isCurrentTimeEnabled('preventClockType')) return;

    const input = this.core.getInput();
    if (!input) return;

    const { currentTime, type: clockType } = this.core.options.clock;
    const { type } = getInputValue(input, clockType, currentTime, true);
    this.core.updateOptions({ clock: { type: type ? '12h' : '24h' } });
  }

  updateInputValueWithCurrentTimeOnStart(): void {
    if (!this.isCurrentTimeEnabled('updateInput')) return;

    const input = this.core.getInput();
    if (!input) return;

    const { clock } = this.core.options;
    const format = getTimeFormat(this.core.options);
    const value = getInputValue(input, clock.type, clock.currentTime, undefined, format.showSeconds);
    input.value = formatTime(value, format);
  }

  syncInputFormat(previousOptions: Required<TimepickerOptions>): void {
    const previous = getTimeFormat(previousOptions);
    const next = getTimeFormat(this.core.options);
    if (previous.clockType === next.clockType && previous.showSeconds === next.showSeconds) return;

    const input = this.core.getInput();
    if (!input) return;

    const values = input.value.split(RANGE_SEPARATOR).map((part) => parseTime(part, previous));
    if (values.length > MAX_TIME_PARTS || !values.every(isTimeValue)) return;

    input.value = values
      .map((value) => formatTime(convertTime(value, previous.clockType, next), next))
      .join(RANGE_SEPARATOR);
  }

  getInputValueOnOpenAndSet(emitOpen = true): void {
    const input = this.core.getInput();
    if (!input) return;

    const { clock } = this.core.options;
    const format = getTimeFormat(this.core.options);
    const currentTime = input.value.trim() ? undefined : clock.currentTime;
    const value = getInputValue(input, clock.type, currentTime, undefined, format.showSeconds);

    TIME_FIELD_NAMES.forEach((field) => {
      const fieldValue = value[field];
      if (fieldValue !== undefined) setSpinbuttonValue(getTimeInput(this.core, field), fieldValue);
    });

    if (format.clockType === '12h') {
      this.activatePeriod(value.type ?? 'AM');
    }

    if (!emitOpen) return;

    this.emitter.emit('open', {
      ...value,
      type: this.core.getActiveType(),
      ...clockDegrees(value),
    });
  }

  private activatePeriod(type: string): void {
    if (type !== 'AM' && type !== 'PM') return;
    const modal = this.core.getModalElement();
    const periodButton = (period: string): HTMLElement | null | undefined =>
      modal?.querySelector<HTMLElement>(`[data-type='${period}']`);
    setActivePeriod(periodButton('AM'), periodButton('PM'), type);
  }

  destroy(): void {}
}
