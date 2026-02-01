import { getInputValue } from '../../utils/input';
import { selectorActive } from '../../utils/variables';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';

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

    const { currentTime, clockType } = {
      currentTime: this.core.options.clock.currentTime,
      clockType: this.core.options.clock.type,
    };
    const { type } = getInputValue(input, clockType, currentTime, true);
    this.core.updateOptions({ clock: { type: type ? '12h' : '24h' } });
  }

  updateInputValueWithCurrentTimeOnStart(): void {
    if (!this.isCurrentTimeEnabled('updateInput')) return;

    const input = this.core.getInput();
    if (!input) return;

    const { hour, minutes, type } = getInputValue(
      input,
      this.core.options.clock.type,
      this.core.options.clock.currentTime,
    );

    input.value = type ? `${hour}:${minutes} ${type}` : `${hour}:${minutes}`;
  }

  getInputValueOnOpenAndSet(): void {
    const input = this.core.getInput();
    if (!input) return;

    const value = getInputValue(input, this.core.options.clock.type, this.core.options.clock.currentTime);
    const hour = this.core.getHour();
    const minutes = this.core.getMinutes();
    const activeTypeMode = this.core.getActiveTypeMode();
    const AM = this.core.getAM();

    if (value === undefined) {
      if (hour) hour.value = '12';
      if (minutes) minutes.value = '00';

      const eventData = {
        hour: hour?.value || '12',
        minutes: minutes?.value || '00',
        type: activeTypeMode?.dataset.type,
        degreesHours: this.core.degreesHours,
        degreesMinutes: this.core.degreesMinutes,
      };

      this.emitter.emit('open', eventData);

      const isRangeMode = this.core.options.range?.enabled === true;
      if (this.core.options.clock.type !== '24h' && AM && !isRangeMode) {
        AM.classList.add(selectorActive);
      }
      return;
    }

    let [hourValue, minutesValue, typeValue] = input.value.split(':').join(' ').split(' ');
    if (input.value.length === 0) {
      hourValue = value.hour as string;
      minutesValue = value.minutes as string;
      typeValue = value.type as string;
    }

    if (hour) hour.value = hourValue.padStart(2, '0');
    if (minutes) minutes.value = minutesValue.padStart(2, '0');

    const modal = this.core.getModalElement();
    const typeMode = modal?.querySelector(`[data-type='${typeValue}']`) as HTMLElement;
    if (this.core.options.clock.type !== '24h' && typeMode) {
      typeMode.classList.add(selectorActive);
    }

    const eventData = {
      ...value,
      type: activeTypeMode?.dataset.type,
      degreesHours: this.core.degreesHours,
      degreesMinutes: this.core.degreesMinutes,
    };

    this.emitter.emit('open', eventData);
  }

  getInputValue(
    el: HTMLInputElement,
    clockType: string,
    currentTime: typeof this.core.options.clock.currentTime,
  ): ReturnType<typeof getInputValue> {
    return getInputValue(el, clockType, currentTime);
  }

  destroy(): void {}
}

