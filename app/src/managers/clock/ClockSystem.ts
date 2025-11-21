import type { ClockType, ClockMode, DisabledTimeConfig, ClockState, RenderConfig } from './types';
import { ClockRenderer } from './renderer/ClockRenderer';
import { ClockController, type ClockControllerCallbacks } from './controller/ClockController';
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
  initialAmPm: '' | 'AM' | 'PM';
  theme?: string;
  incrementHours?: number;
  incrementMinutes?: number;
  onHourChange?: (hour: string) => void;
  onMinuteChange?: (minute: string) => void;
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
    };

    this.renderer = new ClockRenderer(renderConfig);

    const initialState: ClockState = {
      hour: config.initialHour,
      minute: config.initialMinute,
      amPm: config.initialAmPm,
      hourAngle: this.calculateInitialAngle('hours', config.initialHour),
      minuteAngle: this.calculateInitialAngle('minutes', config.initialMinute),
      mode: 'hours',
    };

    const callbacks: ClockControllerCallbacks = {
      onHourChange: config.onHourChange,
      onMinuteChange: config.onMinuteChange,
    };

    this.controller = new ClockController(
      this.renderer,
      initialState,
      config.clockType,
      config.disabledTime,
      config.incrementHours || 1,
      config.incrementMinutes || 1,
      callbacks,
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

    const state = this.controller.getState();
    this.renderer.setActiveValue(state.hour);
  }

  switchToMinutes(): void {
    this.controller.switchMode('minutes');

    if (this.tipsWrapperFor24h) {
      this.tipsWrapperFor24h.classList.add('none');
    }

    this.renderMinuteTips();

    const state = this.controller.getState();
    this.renderer.setActiveValue(state.minute);
  }

  setHour(value: string): void {
    this.controller.setValue('hours', value);
  }

  setMinute(value: string): void {
    this.controller.setValue('minutes', value);
  }

  setAmPm(amPm: 'AM' | 'PM'): void {
    this.controller.setAmPm(amPm);
    const state = this.controller.getState();
    if (state.mode === 'hours') {
      this.renderHourTips();
      this.renderer.setHandAngle(state.hourAngle);
      this.renderer.setActiveValue(state.hour);
    } else {
      this.renderMinuteTips();
      this.renderer.setHandAngle(state.minuteAngle);
      this.renderer.setActiveValue(state.minute);
    }
  }

  getHour(): string {
    return this.controller.getHour();
  }

  getMinute(): string {
    return this.controller.getMinute();
  }

  getAmPm(): string {
    return this.controller.getAmPm();
  }

  updateDisabledTime(disabledTime: DisabledTimeConfig | null): void {
    this.controller.updateDisabledTime(disabledTime);
    const state = this.controller.getState();

    if (state.mode === 'hours') {
      this.renderHourTips();
    } else {
      this.renderMinuteTips();
    }
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

  private renderMinuteTips(): void {
    const state = this.controller.getState();
    const amPm = state.amPm;
    const currentHour = state.hour;

    this.renderer.renderTips(
      MINUTES_STEP_5,
      'tp-ui-minutes-time',
      'minutes',
      this.disabledTime,
      this.clockType,
      true,
      undefined,
      amPm,
      currentHour,
    );
  }

  private calculateInitialAngle(mode: ClockMode, value: string): number {
    const numValue = parseInt(value, 10);

    if (mode === 'hours') {
      return (numValue % 12) * 30;
    } else {
      return numValue * 6;
    }
  }

  destroy(): void {
    this.dragHandlers.detach();
    this.controller.destroy();
  }
}
