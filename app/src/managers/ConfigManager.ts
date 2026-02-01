import { getInputValue } from '../utils/input';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { InputValueHandler } from './config/InputValueHandler';
import { MobileViewHandler } from './config/MobileViewHandler';
import { DisabledTimeHandler } from './config/DisabledTimeHandler';

export default class ConfigManager {
  private readonly inputValueHandler: InputValueHandler;
  private readonly mobileViewHandler: MobileViewHandler;
  private readonly disabledTimeHandler: DisabledTimeHandler;
  private readonly core: CoreState;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.inputValueHandler = new InputValueHandler(core, emitter);
    this.mobileViewHandler = new MobileViewHandler(core, emitter);
    this.disabledTimeHandler = new DisabledTimeHandler(core);
  }

  preventClockTypeByCurrentTime(): void {
    this.inputValueHandler.preventClockTypeByCurrentTime();
  }

  updateInputValueWithCurrentTimeOnStart(): void {
    this.inputValueHandler.updateInputValueWithCurrentTimeOnStart();
  }

  getInputValueOnOpenAndSet(): void {
    this.inputValueHandler.getInputValueOnOpenAndSet();
  }

  getInputValue(
    el: HTMLInputElement,
    clockType: string,
    currentTime: typeof this.core.options.clock.currentTime,
  ): ReturnType<typeof getInputValue> {
    return this.inputValueHandler.getInputValue(el, clockType, currentTime);
  }

  checkMobileOption(): void {
    this.mobileViewHandler.checkMobileOption();
  }

  toggleMobileClockFace(): void {
    this.mobileViewHandler.toggleMobileClockFace();
  }

  updateClockFaceAccessibility(isHidden: boolean): void {
    this.mobileViewHandler.updateClockFaceAccessibility(isHidden);
  }

  getDisableTime(): void {
    this.disabledTimeHandler.getDisableTime();
  }

  destroy(): void {
    this.inputValueHandler.destroy();
    this.mobileViewHandler.destroy();
    this.disabledTimeHandler.destroy();
  }
}
