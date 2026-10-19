import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import type { TimepickerOptions } from '../types/options';
import { InputValueHandler } from './config/InputValueHandler';
import { MobileViewHandler } from './config/MobileViewHandler';
import { DisabledTimeHandler } from './config/DisabledTimeHandler';

export default class ConfigManager {
  private readonly inputValueHandler: InputValueHandler;
  private readonly mobileViewHandler: MobileViewHandler;
  private readonly disabledTimeHandler: DisabledTimeHandler;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
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

  getInputValueOnOpenAndSet(emitOpen = true): void {
    this.inputValueHandler.getInputValueOnOpenAndSet(emitOpen);
  }

  syncInputFormat(previousOptions: Required<TimepickerOptions>): void {
    this.inputValueHandler.syncInputFormat(previousOptions);
  }

  checkMobileOption(): void {
    this.mobileViewHandler.checkMobileOption();
  }

  updateClockFaceAccessibility(isHidden: boolean): void {
    this.mobileViewHandler.updateClockFaceAccessibility(isHidden);
  }

  getDisableTime(): void {
    this.disabledTimeHandler.getDisableTime();
  }

  clearPredicateCache(): void {
    this.disabledTimeHandler.clearPredicateCache();
  }

  destroy(): void {
    this.inputValueHandler.destroy();
    this.mobileViewHandler.destroy();
    this.disabledTimeHandler.destroy();
  }
}
