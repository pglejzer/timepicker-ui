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

    const clockType = (core.options.clock.type || '12h') as '12h' | '24h';

    this.timeHandler = new ClockTimeHandler(
      () => this.systemInitializer.getClockSystem(),
      this.styleHandler,
      () => this.systemInitializer.getAmPmValue(),
      clockType,
    );

    this.eventHandler = new ClockEventHandler(
      emitter,
      () => this.systemInitializer.getClockSystem(),
      (value) => this.timeHandler.setHoursToClock(value),
      (value) => this.timeHandler.setMinutesToClock(value),
      () => this.timeHandler.updateAmPm(),
      () => this.systemInitializer.convertDisabledTime(),
    );

    this.eventHandler.setup();
  }

  initializeClockSystem(): void {
    this.systemInitializer.initialize();
  }

  destroyClockSystem(): void {
    this.systemInitializer.destroy();
  }

  removeCircleClockClasses24h(): void {
    this.styleHandler.removeCircleClockClasses24h();
  }

  setCircleClockClasses24h(): void {
    this.styleHandler.setCircleClockClasses24h();
  }

  setOnStartCSSClassesIfClockType24h(): void {
    this.styleHandler.setOnStartCSSClassesIfClockType24h();
  }

  setBgColorToCircleWithMinutesTips = (): void => {
    this.styleHandler.setBgColorToCircleWithMinutesTips();
  };

  removeBgColorToCirleWithMinutesTips = (): void => {
    this.styleHandler.removeBgColorToCirleWithMinutesTips();
  };

  setClassActiveToHourOnOpen = (): void => {
    this.styleHandler.setClassActiveToHourOnOpen();
  };

  setMinutesToClock = (value: string | null): void => {
    this.timeHandler.setMinutesToClock(value);
  };

  setHoursToClock = (value: string | null): void => {
    this.timeHandler.setHoursToClock(value);
  };

  setTransformToCircleWithSwitchesHour = (val: string | null): void => {
    this.timeHandler.setTransformToCircleWithSwitchesHour(val);
  };

  setTransformToCircleWithSwitchesMinutes = (val: string | null): void => {
    this.timeHandler.setTransformToCircleWithSwitchesMinutes(val);
  };

  updateAmPm = (): void => {
    this.timeHandler.updateAmPm();
  };

  toggleClassActiveToValueTips = (value: string | number | null): void => {
    const hasClockSystem = this.systemInitializer.getClockSystem() !== null;
    this.styleHandler.toggleClassActiveToValueTips(hasClockSystem, value);
  };

  destroy(): void {
    this.destroyClockSystem();
  }
}
