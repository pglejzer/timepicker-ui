import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { WheelRenderer } from './WheelRenderer';
import { WheelScrollHandler } from './WheelScrollHandler';
import { WheelEventHandler } from './WheelEventHandler';
import { WheelDragHandler } from './WheelDragHandler';

export default class WheelManager {
  private readonly renderer: WheelRenderer;
  private readonly dragHandler: WheelDragHandler;
  private readonly scrollHandler: WheelScrollHandler;
  private readonly eventHandler: WheelEventHandler;
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private amPmHandler: (() => void) | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.renderer = new WheelRenderer(core, emitter);
    this.dragHandler = new WheelDragHandler(this.renderer);
    this.scrollHandler = new WheelScrollHandler(this.renderer, core);
    this.scrollHandler.setDragHandler(this.dragHandler);
    this.eventHandler = new WheelEventHandler(emitter, this.scrollHandler, core);
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
    this.deferInitialSync();
  }

  scrollToValue(hour: string, minute: string, _type?: string): void {
    this.scrollHandler.scrollToValue('hours', hour.padStart(2, '0'));
    this.scrollHandler.scrollToValue('minutes', minute.padStart(2, '0'));
  }

  updateDisabledItems(): void {
    this.renderer.updateDisabledItems();
  }

  destroy(): void {
    if (this.amPmHandler) {
      this.emitter.off('select:am', this.amPmHandler);
      this.emitter.off('select:pm', this.amPmHandler);
      this.amPmHandler = null;
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
  }

  private listenForAmPmChanges(): void {
    if (this.core.options.clock.type === '24h') return;

    this.amPmHandler = (): void => {
      this.renderer.updateDisabledItems();
    };

    this.emitter.on('select:am', this.amPmHandler);
    this.emitter.on('select:pm', this.amPmHandler);
  }
}
