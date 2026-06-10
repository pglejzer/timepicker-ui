import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { WheelRenderer } from './WheelRenderer';
import { WheelScrollHandler } from './WheelScrollHandler';
import { WheelEventHandler } from './WheelEventHandler';
import { WheelDragHandler } from './WheelDragHandler';
import PopoverManager from './PopoverManager';
import { bindEmitter } from '../../../utils/managerHelpers';
import { isCompactWheelMode } from '../../../utils/options/predicates';

export default class WheelManager {
  private readonly renderer: WheelRenderer;
  private readonly dragHandler: WheelDragHandler;
  private readonly scrollHandler: WheelScrollHandler;
  private readonly eventHandler: WheelEventHandler;
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private readonly popover: PopoverManager;
  private cleanupHandlers: Array<() => void> = [];

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
    if (type && isCompactWheelMode(this.core.options)) {
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
    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
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
    const isCompact = isCompactWheelMode(this.core.options);

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

  private listenForAmPmChanges(): void {
    if (this.core.options.clock.type === '24h') return;

    const handler = (): void => {
      const currentHour = this.scrollHandler.getSelectedValue('hours');
      const currentMinute = this.scrollHandler.getSelectedValue('minutes');
      this.renderer.updateDisabledItems();
      this.scrollToFirstAvailable('hours', currentHour);
      this.scrollToFirstAvailable('minutes', currentMinute);
    };

    bindEmitter(this.emitter, this.cleanupHandlers, 'select:am', handler);
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:pm', handler);
  }

  private listenForClear(): void {
    bindEmitter(this.emitter, this.cleanupHandlers, 'clear', () => {
      this.deferInitialSync();
    });
  }

  private listenForHourChanges(): void {
    const disabled = this.core.disabledTime;
    if (!disabled?.value?.isInterval) return;

    bindEmitter(this.emitter, this.cleanupHandlers, 'select:hour', () => {
      const currentMinute = this.scrollHandler.getSelectedValue('minutes');
      this.renderer.updateDisabledItems();
      this.scrollToFirstAvailable('minutes', currentMinute);
    });
  }

  private scrollToFirstAvailable(columnType: 'hours' | 'minutes', preferredValue: string | null): void {
    const target = this.scrollHandler.findFirstAvailable(columnType, preferredValue);
    if (target !== null) {
      this.scrollHandler.scrollToValue(columnType, target);
    }
  }
}
