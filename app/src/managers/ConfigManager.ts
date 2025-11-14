import { debounce } from '../utils/debounce';
import { getInputValue } from '../utils/input';
import type { ITimepickerUI } from '../types/ITimepickerUI';
import { TimeoutManager } from './configmanager/TimeoutManager';
import { ViewSwitcher } from './configmanager/ViewSwitcher';
import { MobileClockFaceToggler } from './configmanager/MobileClockFaceToggler';
import { InitializationManager } from './configmanager/InitializationManager';

export default class ConfigManager {
  private timepicker: ITimepickerUI;
  private debouncedHandler?: ReturnType<typeof debounce>;
  private timeoutManager: TimeoutManager;
  private viewSwitcher: ViewSwitcher;
  private mobileToggler: MobileClockFaceToggler;
  private initManager: InitializationManager;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
    this.timeoutManager = new TimeoutManager();
    this.viewSwitcher = new ViewSwitcher(timepicker);
    this.mobileToggler = new MobileClockFaceToggler(timepicker, this.timeoutManager, this.viewSwitcher);
    this.initManager = new InitializationManager(timepicker);
  }

  preventClockTypeByCurrentTime = () => {
    this.initManager.preventClockTypeByCurrentTime();
  };

  updateInputValueWithCurrentTimeOnStart = () => {
    this.initManager.updateInputValueWithCurrentTimeOnStart();
  };

  checkMobileOption() {
    this.initManager.checkMobileOption();
  }

  getDisableTime() {
    this.initManager.getDisableTime();
  }

  getInputValueOnOpenAndSet = (): void => {
    this.initManager.getInputValueOnOpenAndSet();
  };

  toggleMobileClockFace = () => {
    this.mobileToggler.toggle();
  };

  getInputValue = getInputValue;

  destroy() {
    this.timeoutManager.clearAll();
    if (this.debouncedHandler && 'cancel' in this.debouncedHandler) {
      (this.debouncedHandler as any).cancel?.();
    }
  }
}
