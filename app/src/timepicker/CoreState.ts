import { isDocument } from '../utils/node';
import type { TimepickerOptions } from '../types/options';

export interface CoreStateData {
  readonly degreesHours: number | null;
  readonly degreesMinutes: number | null;
  readonly options: Required<TimepickerOptions>;
  readonly element: HTMLElement;
  readonly instanceId: string;
  readonly isMobileView: boolean;
  readonly isTouchMouseMove: boolean;
  readonly disabledTime: {
    value?: {
      isInterval?: boolean;
      intervals?: string[];
      clockType?: string;
      hours?: string[];
      minutes?: string[];
    };
  } | null;
  readonly cloned: Node | null;
  readonly isModalRemove: boolean;
  readonly isInitialized: boolean;
  readonly customId?: string;
  readonly eventHandlersRegistered: boolean;
  readonly isDestroyed: boolean;
}

export class CoreState {
  private state: CoreStateData;

  constructor(
    element: HTMLElement,
    options: Required<TimepickerOptions>,
    instanceId: string,
    customId?: string,
  ) {
    this.state = {
      degreesHours: null,
      degreesMinutes: null,
      options,
      element,
      instanceId,
      isMobileView: false,
      isTouchMouseMove: false,
      disabledTime: null,
      cloned: null,
      isModalRemove: true,
      isInitialized: false,
      customId,
      eventHandlersRegistered: false,
      isDestroyed: false,
    };
  }

  get degreesHours(): number | null {
    return this.state.degreesHours;
  }

  get degreesMinutes(): number | null {
    return this.state.degreesMinutes;
  }

  get options(): Required<TimepickerOptions> {
    return this.state.options;
  }

  get element(): HTMLElement {
    return this.state.element;
  }

  get instanceId(): string {
    return this.state.instanceId;
  }

  get isMobileView(): boolean {
    return this.state.isMobileView;
  }

  get isTouchMouseMove(): boolean {
    return this.state.isTouchMouseMove;
  }

  get disabledTime(): CoreStateData['disabledTime'] {
    return this.state.disabledTime;
  }

  get cloned(): Node | null {
    return this.state.cloned;
  }

  get isModalRemove(): boolean {
    return this.state.isModalRemove;
  }

  get isInitialized(): boolean {
    return this.state.isInitialized;
  }

  get customId(): string | undefined {
    return this.state.customId;
  }

  get eventHandlersRegistered(): boolean {
    return this.state.eventHandlersRegistered;
  }

  get isDestroyed(): boolean {
    return this.state.isDestroyed;
  }

  setDegreesHours(value: number | null): void {
    this.state = { ...this.state, degreesHours: value };
  }

  setDegreesMinutes(value: number | null): void {
    this.state = { ...this.state, degreesMinutes: value };
  }

  setOptions(options: Required<TimepickerOptions>): void {
    this.state = { ...this.state, options };
  }

  setIsMobileView(value: boolean): void {
    this.state = { ...this.state, isMobileView: value };
  }

  setIsTouchMouseMove(value: boolean): void {
    this.state = { ...this.state, isTouchMouseMove: value };
  }

  setDisabledTime(value: CoreStateData['disabledTime']): void {
    this.state = { ...this.state, disabledTime: value };
  }

  setCloned(value: Node | null): void {
    this.state = { ...this.state, cloned: value };
  }

  setIsModalRemove(value: boolean): void {
    this.state = { ...this.state, isModalRemove: value };
  }

  setIsInitialized(value: boolean): void {
    this.state = { ...this.state, isInitialized: value };
  }

  setEventHandlersRegistered(value: boolean): void {
    this.state = { ...this.state, eventHandlersRegistered: value };
  }

  setIsDestroyed(value: boolean): void {
    this.state = { ...this.state, isDestroyed: value };
  }

  updateOptions(updates: Partial<TimepickerOptions>): void {
    this.state = {
      ...this.state,
      options: {
        ...this.state.options,
        clock: { ...this.state.options.clock, ...(updates.clock || {}) },
        ui: { ...this.state.options.ui, ...(updates.ui || {}) },
        labels: { ...this.state.options.labels, ...(updates.labels || {}) },
        behavior: { ...this.state.options.behavior, ...(updates.behavior || {}) },
        callbacks: { ...this.state.options.callbacks, ...(updates.callbacks || {}) },
      },
    };
  }

  reset(): void {
    this.state = {
      ...this.state,
      degreesHours: null,
      degreesMinutes: null,
      isTouchMouseMove: false,
      disabledTime: null,
      cloned: null,
      isModalRemove: true,
      isInitialized: false,
      isDestroyed: true,
      eventHandlersRegistered: false,
    };
  }

  getModalElement(): HTMLDivElement | null {
    if (isDocument() === false) return null;
    return document.querySelector(`[data-owner-id="${this.state.instanceId}"]`);
  }

  getInput(): HTMLInputElement | null {
    return this.state.element?.querySelector('input');
  }

  getClockFace(): HTMLDivElement | null {
    const modal = this.getModalElement();
    if (!modal) return null;

    if (this.state.isMobileView) {
      return modal.querySelector('.tp-ui-clock-face.mobile');
    }
    return modal.querySelector('.tp-ui-clock-face:not(.mobile)');
  }

  getClockHand(): HTMLDivElement | null {
    const modal = this.getModalElement();
    if (!modal) return null;

    if (this.state.isMobileView) {
      return modal.querySelector('.tp-ui-mobile-clock-wrapper .tp-ui-clock-hand');
    }
    return modal.querySelector('.tp-ui-clock-hand:not(.mobile)');
  }

  getCircle(): HTMLDivElement | null {
    const modal = this.getModalElement();
    if (!modal) return null;

    if (this.state.isMobileView) {
      return modal.querySelector('.tp-ui-mobile-clock-wrapper .tp-ui-circle-hand');
    }
    return modal.querySelector('.tp-ui-circle-hand:not(.mobile)');
  }

  getTipsWrapper(): HTMLDivElement | null {
    const modal = this.getModalElement();
    if (!modal) return null;

    if (this.state.isMobileView) {
      return modal.querySelector('.tp-ui-mobile-clock-wrapper .tp-ui-tips-wrapper');
    }
    return modal.querySelector('.tp-ui-tips-wrapper:not(.mobile)');
  }

  getTipsWrapperFor24h(): HTMLDivElement | null {
    const modal = this.getModalElement();
    if (!modal) return null;

    if (this.state.isMobileView) {
      return modal.querySelector('.tp-ui-mobile-clock-wrapper .tp-ui-tips-wrapper-24h');
    }
    return modal.querySelector('.tp-ui-tips-wrapper-24h:not(.mobile)');
  }

  getMinutes(): HTMLInputElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-minutes') || null;
  }

  getHour(): HTMLInputElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-hour') || null;
  }

  getAM(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-am') || null;
  }

  getPM(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-pm') || null;
  }

  getHourText(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-hour-text') || null;
  }

  getMinutesText(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-minute-text') || null;
  }

  getHeader(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-header') || null;
  }

  getInputWrappers(): NodeListOf<Element> | null {
    const modal = this.getModalElement();
    return modal?.querySelectorAll('.tp-ui-input-wrapper') || null;
  }

  getDots(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-dots') || null;
  }

  getMinutesTips(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-minutes-time') || null;
  }

  getHourTips(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-hour-time-12') || null;
  }

  getAllValueTips(): Array<HTMLDivElement> {
    const modal = this.getModalElement();
    if (!modal) return [];

    return [
      ...modal.querySelectorAll('.tp-ui-value-tips'),
      ...modal.querySelectorAll('.tp-ui-value-tips-24h'),
    ] as Array<HTMLDivElement>;
  }

  getOpenElementData(): string[] | null {
    const data: NodeListOf<HTMLElement> = this.state.element?.querySelectorAll('[data-open]');

    if (data?.length > 0) {
      const arr: string[] = [];
      data.forEach(({ dataset }) => arr.push(dataset.open ?? ''));
      return [...new Set(arr)];
    }

    return null;
  }

  getOpenElement(): NodeListOf<Element> | readonly [HTMLInputElement] {
    const input = this.getInput();
    const openData = this.getOpenElementData();

    if (openData === null) {
      input?.setAttribute('data-open', 'tp-ui-input');
      return [input as HTMLInputElement] as const;
    }

    return openData.map((open) => this.state.element?.querySelectorAll(`[data-open='${open}']`))[0] ?? '';
  }

  getCancelButton(): HTMLButtonElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-cancel-btn') || null;
  }

  getOkButton(): HTMLButtonElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-ok-btn') || null;
  }

  getActiveTypeMode(): HTMLButtonElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-type-mode.active') || null;
  }

  getKeyboardClockIcon(): HTMLButtonElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-keyboard-icon-wrapper') || null;
  }

  getFooter(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-footer') || null;
  }

  getWrapper(): HTMLDivElement | null {
    const modal = this.getModalElement();
    return modal?.querySelector('.tp-ui-wrapper') || null;
  }
}
