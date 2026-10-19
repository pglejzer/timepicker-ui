import type {
  ClockType,
  ClockMode,
  AmPmType,
  DisabledTimeConfig,
  ClockState,
  RenderConfig,
  SixtyMode,
} from './types';
import { ClockRenderer } from './renderer/ClockRenderer';
import { ClockController, type ClockControllerCallbacks } from './controller/ClockController';
import { ClockEngine } from './engine/ClockEngine';
import { DragHandlers, type DragHandlersConfig } from './handlers/DragHandlers';
import { HOURS_12, HOURS_24, MINUTES_STEP_5 } from '../../utils/template';

export interface ClockSystemConfig {
  clockFace: HTMLElement;
  tipsWrapper: HTMLElement;
  tipsWrapperFor24h?: HTMLElement;
  clockHand: HTMLElement;
  circle: HTMLElement;
  clockType: ClockType;
  disabledTime: DisabledTimeConfig | null;
  initialHour: string;
  initialMinute: string;
  initialSecond?: string;
  initialAmPm: '' | 'AM' | 'PM';
  theme?: string;
  incrementHours?: number;
  incrementMinutes?: number;
  incrementSeconds?: number;
  smoothHourSnap?: boolean;
  showSeconds?: boolean;
  onHourChange?: (hour: string) => void;
  onMinuteChange?: (minute: string) => void;
  onSecondChange?: (second: string) => void;
  timepicker: unknown;
  dragConfig?: DragHandlersConfig;
}

export class ClockSystem {
  private renderer: ClockRenderer;
  private controller: ClockController;
  private dragHandlers: DragHandlers;
  private clockType: ClockType;
  private disabledTime: DisabledTimeConfig | null;
  private tipsWrapper: HTMLElement;
  private tipsWrapperFor24h?: HTMLElement;

  constructor(config: ClockSystemConfig) {
    this.clockType = config.clockType;
    this.disabledTime = config.disabledTime;
    this.tipsWrapper = config.tipsWrapper;
    this.tipsWrapperFor24h = config.tipsWrapperFor24h;

    const renderConfig: RenderConfig = {
      clockFace: config.clockFace,
      tipsWrapper: config.tipsWrapper,
      tipsWrapperFor24h: config.tipsWrapperFor24h,
      clockHand: config.clockHand,
      circle: config.circle,
      theme: config.theme,
      showSeconds: config.showSeconds,
    };

    this.renderer = new ClockRenderer(renderConfig);

    const initialSecond = config.initialSecond || '00';
    const initialState: ClockState = {
      hour: config.initialHour,
      minute: config.initialMinute,
      second: initialSecond,
      amPm: config.initialAmPm,
      hourAngle: ClockEngine.valueToAngle(config.initialHour, 'hours', config.clockType),
      minuteAngle: ClockEngine.valueToAngle(config.initialMinute, 'minutes', config.clockType),
      secondAngle: ClockEngine.valueToAngle(initialSecond, 'seconds', config.clockType),
      mode: 'hours',
    };

    const callbacks: ClockControllerCallbacks = {
      onHourChange: config.onHourChange,
      onMinuteChange: config.onMinuteChange,
      onSecondChange: config.onSecondChange,
    };

    this.controller = new ClockController(
      this.renderer,
      initialState,
      config.clockType,
      config.disabledTime,
      config.incrementHours || 1,
      config.incrementMinutes || 1,
      config.smoothHourSnap ?? true,
      callbacks,
      config.incrementSeconds || 1,
      config.showSeconds ?? false,
    );

    this.dragHandlers = new DragHandlers(this.controller, config.clockFace, config.dragConfig || {});
  }

  initialize(): void {
    this.dragHandlers.attach();
    this.switchToHours();
  }

  switchToHours(): void {
    this.controller.switchMode('hours');

    if (this.clockType === '24h' && this.tipsWrapperFor24h) {
      this.tipsWrapperFor24h.classList.remove('none');
    }

    this.renderHourTips();
    this.controller.followHand('hours');
  }

  switchToMinutes(): void {
    this.switchToSixty('minutes');
  }

  switchToSeconds(): void {
    this.switchToSixty('seconds');
  }

  setHour(value: string): void {
    this.controller.setValue('hours', value);
  }

  setMinute(value: string): void {
    this.controller.setValue('minutes', value);
  }

  setSecond(value: string): void {
    this.controller.setValue('seconds', value);
  }

  setValueIfShown(mode: ClockMode, value: string): boolean {
    const isShown = this.controller.getState().mode === mode;
    if (isShown) {
      this.controller.setValue(mode, value);
    }
    return isShown;
  }

  setAmPm(amPm: 'AM' | 'PM'): void {
    this.controller.setAmPm(amPm);
    this.refreshFace();
  }

  syncValue(value: { hour: string; minute: string; second?: string; amPm: AmPmType }): void {
    this.controller.setValue('hours', value.hour);
    this.controller.setValue('minutes', value.minute);
    if (value.second) {
      this.controller.setValue('seconds', value.second);
    }
    if (value.amPm && this.clockType === '12h') {
      this.controller.setAmPm(value.amPm);
    }
    this.refreshFace();
  }

  private refreshFace(): void {
    const { mode } = this.controller.getState();

    if (mode === 'hours') {
      this.switchToHours();
    } else {
      this.switchToSixty(mode);
    }
  }

  getHour(): string {
    return this.controller.getHour();
  }

  getMinute(): string {
    return this.controller.getMinute();
  }

  getSecond(): string {
    return this.controller.getSecond();
  }

  getAmPm(): string {
    return this.controller.getAmPm();
  }

  updateDisabledTime(disabledTime: DisabledTimeConfig | null): void {
    this.disabledTime = disabledTime;
    this.controller.updateDisabledTime(disabledTime);
    this.renderCurrentTips();
  }

  refreshDisabledTime(): void {
    this.controller.followHand(this.renderCurrentTips());
  }

  private renderCurrentTips(): ClockMode {
    const { mode } = this.controller.getState();

    if (mode === 'hours') {
      this.renderHourTips();
    } else {
      this.renderSixtyTips(mode);
    }
    return mode;
  }

  private switchToSixty(unit: SixtyMode): void {
    this.controller.switchMode(unit);

    if (this.tipsWrapperFor24h) {
      this.tipsWrapperFor24h.classList.add('none');
    }

    this.renderSixtyTips(unit);
    this.controller.followHand(unit);
  }

  private renderHourTips(): void {
    const state = this.controller.getState();
    const amPm = state.amPm;

    if (this.clockType === '24h') {
      this.renderer.renderTips(
        HOURS_12,
        'tp-ui-hour-time-12',
        'hours',
        this.disabledTime,
        this.clockType,
        true,
        this.tipsWrapper,
        amPm,
      );

      if (this.tipsWrapperFor24h) {
        this.renderer.renderTips(
          HOURS_24,
          'tp-ui-hour-time-24',
          'hours',
          this.disabledTime,
          this.clockType,
          true,
          this.tipsWrapperFor24h,
          amPm,
        );
      }
    } else {
      this.renderer.renderTips(
        HOURS_12,
        'tp-ui-hour-time-12',
        'hours',
        this.disabledTime,
        this.clockType,
        true,
        undefined,
        amPm,
      );
    }
  }

  private renderSixtyTips(unit: SixtyMode): void {
    const { amPm, hour, minute } = this.controller.getState();

    this.renderer.renderTips(
      MINUTES_STEP_5,
      'tp-ui-minutes-time',
      unit,
      this.disabledTime,
      this.clockType,
      true,
      undefined,
      amPm,
      hour,
      minute,
    );
  }

  destroy(): void {
    this.dragHandlers.detach();
    this.controller.destroy();
  }

  blockInteractions(): void {
    this.dragHandlers.block();
  }

  unblockInteractions(): void {
    this.dragHandlers.unblock();
  }
}
