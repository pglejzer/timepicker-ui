import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { WheelRenderer } from './WheelRenderer';
import { WheelScrollHandler } from './WheelScrollHandler';
import { WheelEventHandler } from './WheelEventHandler';
import { WheelDragHandler } from './WheelDragHandler';
import PopoverManager from './PopoverManager';

export default class WheelManager {
  private readonly renderer: WheelRenderer;
  private readonly dragHandler: WheelDragHandler;
  private readonly scrollHandler: WheelScrollHandler;
  private readonly eventHandler: WheelEventHandler;
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private readonly popover: PopoverManager;
  private amPmHandler: (() => void) | null = null;
  private hourChangeHandler: (() => void) | null = null;
  private clearHandler: (() => void) | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.renderer = new WheelRenderer(core);
    this.dragHandler = new WheelDragHandler(this.renderer);
    this.scrollHandler = new WheelScrollHandler(this.renderer, core);
    this.scrollHandler.setDragHandler(this.dragHandler);
    this.eventHandler = new WheelEventHandler(emitter, this.scrollHandler, core);
    this.popover = new PopoverManager(core, emitter);
  }

  init(): void {
    this.renderer.init();
    this.dragHandler.init();
    this.scrollHandler.init();
    this.eventHandler.init();

    this.dragHandler.setVisualUpdateCallback((columnType): void => {
      this.scrollHandler.updateVisualClasses(columnType);
    });

    this.listenForAmPmChanges();
    this.listenForHourChanges();
    this.listenForClear();
    this.deferInitialSync();
  }

  scrollToValue(hour: string, minute: string, type?: string): void {
    this.scrollHandler.scrollToValue('hours', hour.padStart(2, '0'));
    this.scrollHandler.scrollToValue('minutes', minute.padStart(2, '0'));
    if (type && this.isCompactWheelMode()) {
      this.scrollHandler.scrollToValue('ampm', type.toUpperCase());
    }
  }

  updateDisabledItems(): void {
    this.renderer.updateDisabledItems();
  }

  attachPopover(): void {
    this.popover.attach();
  }

  detachPopover(): void {
    this.popover.detach();
  }

  destroy(): void {
    this.popover.destroy();
    if (this.amPmHandler) {
      this.emitter.off('select:am', this.amPmHandler);
      this.emitter.off('select:pm', this.amPmHandler);
      this.amPmHandler = null;
    }
    if (this.hourChangeHandler) {
      this.emitter.off('select:hour', this.hourChangeHandler);
      this.hourChangeHandler = null;
    }
    if (this.clearHandler) {
      this.emitter.off('clear', this.clearHandler);
      this.clearHandler = null;
    }
    this.eventHandler.destroy();
    this.scrollHandler.destroy();
    this.dragHandler.destroy();
    this.renderer.destroy();
  }

  private deferInitialSync(): void {
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        this.syncInitialValues();
      });
    } else {
      this.syncInitialValues();
    }
  }

  private syncInitialValues(): void {
    const hourInput = this.core.getHour();
    const minutesInput = this.core.getMinutes();
    const isCompact = this.isCompactWheelMode();

    let hourValue = hourInput?.value ?? '';
    let minuteValue = minutesInput?.value ?? '';

    if (isCompact && (!hourValue || !minuteValue)) {
      const parsed = this.parseMainInputValue();
      if (!hourValue) hourValue = parsed.hour;
      if (!minuteValue) minuteValue = parsed.minutes;
    }

    if (hourValue) {
      this.scrollHandler.scrollToValue('hours', hourValue.padStart(2, '0'));
    }

    if (minuteValue) {
      this.scrollHandler.scrollToValue('minutes', minuteValue.padStart(2, '0'));
    }

    if (isCompact) {
      const am = this.core.getAM();
      const initialPeriod = am?.classList.contains('active') ? 'AM' : 'PM';
      this.scrollHandler.scrollToValue('ampm', initialPeriod);
    }
  }

  private parseMainInputValue(): { hour: string; minutes: string; type?: string } {
    const input = this.core.getInput();
    if (!input?.value) return { hour: '', minutes: '' };

    const value = input.value.trim();
    const [timePart, typePart] = value.split(' ');
    const [hStr = '', mStr = ''] = (timePart ?? '').split(':');

    const hour = hStr.replace(/\D/g, '').padStart(2, '0');
    const minutes = mStr.replace(/\D/g, '').padStart(2, '0');

    return {
      hour,
      minutes,
      type: this.core.options.clock.type === '12h' ? typePart : undefined,
    };
  }

  private isCompactWheelMode(): boolean {
    return this.core.options.ui.mode === 'compact-wheel';
  }

  private listenForAmPmChanges(): void {
    if (this.core.options.clock.type === '24h') return;

    this.amPmHandler = (): void => {
      const currentHour = this.scrollHandler.getSelectedValue('hours');
      const currentMinute = this.scrollHandler.getSelectedValue('minutes');
      this.renderer.updateDisabledItems();
      this.scrollToFirstAvailable('hours', currentHour);
      this.scrollToFirstAvailable('minutes', currentMinute);
    };

    this.emitter.on('select:am', this.amPmHandler);
    this.emitter.on('select:pm', this.amPmHandler);
  }

  private listenForClear(): void {
    this.clearHandler = (): void => {
      this.deferInitialSync();
    };
    this.emitter.on('clear', this.clearHandler);
  }

  private listenForHourChanges(): void {
    const disabled = this.core.disabledTime;
    if (!disabled?.value?.isInterval) return;

    this.hourChangeHandler = (): void => {
      const currentMinute = this.scrollHandler.getSelectedValue('minutes');
      this.renderer.updateDisabledItems();
      this.scrollToFirstAvailable('minutes', currentMinute);
    };

    this.emitter.on('select:hour', this.hourChangeHandler);
  }

  /**
   * Find item by data-value (not scroll position) and scroll to it.
   * If preferred value no longer exists in DOM, scroll to first available.
   */
  private scrollToFirstAvailable(columnType: 'hours' | 'minutes', preferredValue: string | null): void {
    const items = this.renderer.getItems(columnType);
    if (!items || items.length === 0) return;

    if (preferredValue !== null) {
      for (let i = 0; i < items.length; i++) {
        if (
          items[i].getAttribute('data-value') === preferredValue &&
          !items[i].classList.contains('is-disabled')
        ) {
          this.scrollHandler.scrollToValue(columnType, preferredValue);
          return;
        }
      }
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].classList.contains('is-disabled')) {
        const val = items[i].getAttribute('data-value');
        if (val !== null) {
          this.scrollHandler.scrollToValue(columnType, val);
          return;
        }
      }
    }
  }
}
