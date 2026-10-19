import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import {
  ClockEventHandler,
  ClockSystemInitializer,
  ClockStyleHandler,
  ClockTimeHandler,
} from './clock/handlers';

export default class ClockManager {
  private systemInitializer: ClockSystemInitializer;
  private styleHandler: ClockStyleHandler;
  private timeHandler: ClockTimeHandler;
  private eventHandler: ClockEventHandler;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.systemInitializer = new ClockSystemInitializer(core, emitter);
    this.styleHandler = new ClockStyleHandler(core);

    this.timeHandler = new ClockTimeHandler(
      () => this.systemInitializer.getClockSystem(),
      () => this.systemInitializer.getAmPmValue(),
      () => (core.options.clock.type || '12h') as '12h' | '24h',
    );

    this.eventHandler = new ClockEventHandler(
      emitter,
      () => this.systemInitializer.getClockSystem(),
      (value) => this.timeHandler.setHoursToClock(value),
      (value) => this.timeHandler.setMinutesToClock(value),
      () => this.timeHandler.updateAmPm(),
      () => this.systemInitializer.convertDisabledTime(),
      (value) => this.timeHandler.setSecondsToClock(value),
    );

    this.eventHandler.setup();
  }

  initializeClockSystem(): void {
    this.systemInitializer.initialize();
  }

  destroyClockSystem(): void {
    this.systemInitializer.destroy();
  }

  setOnStartCSSClassesIfClockType24h(): void {
    this.styleHandler.setOnStartCSSClassesIfClockType24h();
  }

  setClassActiveToHourOnOpen = (): void => {
    this.styleHandler.setClassActiveToHourOnOpen();
  };

  syncClockValue(hour: string, minutes: string, type?: string, seconds?: string): boolean {
    const clockSystem = this.systemInitializer.getClockSystem();
    if (!clockSystem) return false;

    const amPm = type === 'AM' || type === 'PM' ? type : '';
    clockSystem.syncValue({ hour, minute: minutes, second: seconds, amPm });
    return true;
  }

  refreshDisabledTime(): void {
    this.systemInitializer.getClockSystem()?.refreshDisabledTime();
  }

  destroy(): void {
    this.destroyClockSystem();
  }
}
