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

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.renderer = new WheelRenderer(core, emitter);
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

    if (hourInput?.value) {
      this.scrollHandler.scrollToValue('hours', hourInput.value.padStart(2, '0'));
    }

    if (minutesInput?.value) {
      this.scrollHandler.scrollToValue('minutes', minutesInput.value.padStart(2, '0'));
    }

    if (this.isCompactWheelMode()) {
      const am = this.core.getAM();
      const initialPeriod = am?.classList.contains('active') ? 'AM' : 'PM';
      this.scrollHandler.scrollToValue('ampm', initialPeriod);
    }
  }

  private isCompactWheelMode(): boolean {
    return this.core.options.ui.mode === 'compact-wheel';
  }

  private listenForAmPmChanges(): void {
    if (this.core.options.clock.type === '24h') return;

    this.amPmHandler = (): void => {
      this.renderer.updateDisabledItems();
    };

    this.emitter.on('select:am', this.amPmHandler);
    this.emitter.on('select:pm', this.amPmHandler);
  }

  private listenForHourChanges(): void {
    const disabled = this.core.disabledTime;
    if (!disabled?.value?.isInterval) return;

    this.hourChangeHandler = (): void => {
      this.renderer.updateDisabledItems();
    };

    this.emitter.on('select:hour', this.hourChangeHandler);
  }
}
