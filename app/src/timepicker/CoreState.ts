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
  readonly isOpen: boolean;
  readonly isInitialized: boolean;
  readonly customId?: string;
  readonly eventHandlersRegistered: boolean;
  readonly isDestroyed: boolean;
}

export class CoreState {
  private _degreesHours: number | null = null;
  private _degreesMinutes: number | null = null;
  private _options: Required<TimepickerOptions>;
  private _isMobileView = false;
  private _isTouchMouseMove = false;
  private _disabledTime: CoreStateData['disabledTime'] = null;
  private _cloned: Node | null = null;
  private _isModalRemove = true;
  private _isOpen = false;
  private _isInitialized = false;
  private _eventHandlersRegistered = false;
  private _isDestroyed = false;

  public readonly element: HTMLElement;
  public readonly instanceId: string;
  public readonly customId?: string;

  constructor(
    element: HTMLElement,
    options: Required<TimepickerOptions>,
    instanceId: string,
    customId?: string,
  ) {
    this.element = element;
    this.instanceId = instanceId;
    this.customId = customId;
    this._options = options;
  }

  get degreesHours(): number | null {
    return this._degreesHours;
  }
  get degreesMinutes(): number | null {
    return this._degreesMinutes;
  }
  get options(): Required<TimepickerOptions> {
    return this._options;
  }
  get isMobileView(): boolean {
    return this._isMobileView;
  }
  get isTouchMouseMove(): boolean {
    return this._isTouchMouseMove;
  }
  get disabledTime(): CoreStateData['disabledTime'] {
    return this._disabledTime;
  }
  get cloned(): Node | null {
    return this._cloned;
  }
  get isModalRemove(): boolean {
    return this._isModalRemove;
  }
  get isOpen(): boolean {
    return this._isOpen;
  }
  get isInitialized(): boolean {
    return this._isInitialized;
  }
  get eventHandlersRegistered(): boolean {
    return this._eventHandlersRegistered;
  }
  get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  setDegreesHours(value: number | null): void {
    this._degreesHours = value;
  }
  setDegreesMinutes(value: number | null): void {
    this._degreesMinutes = value;
  }
  setOptions(options: Required<TimepickerOptions>): void {
    this._options = options;
  }
  setIsMobileView(value: boolean): void {
    this._isMobileView = value;
  }
  setIsTouchMouseMove(value: boolean): void {
    this._isTouchMouseMove = value;
  }
  setDisabledTime(value: CoreStateData['disabledTime']): void {
    this._disabledTime = value;
  }
  setCloned(value: Node | null): void {
    this._cloned = value;
  }
  setIsModalRemove(value: boolean): void {
    this._isModalRemove = value;
  }
  setIsOpen(value: boolean): void {
    this._isOpen = value;
  }
  setIsInitialized(value: boolean): void {
    this._isInitialized = value;
  }
  setEventHandlersRegistered(value: boolean): void {
    this._eventHandlersRegistered = value;
  }
  setIsDestroyed(value: boolean): void {
    this._isDestroyed = value;
  }

  updateOptions(updates: Partial<TimepickerOptions>): void {
    this._options = {
      ...this._options,
      clock: { ...this._options.clock, ...(updates.clock || {}) },
      ui: { ...this._options.ui, ...(updates.ui || {}) },
      labels: { ...this._options.labels, ...(updates.labels || {}) },
      behavior: { ...this._options.behavior, ...(updates.behavior || {}) },
      callbacks: { ...this._options.callbacks, ...(updates.callbacks || {}) },
    };
  }

  reset(): void {
    this._degreesHours = null;
    this._degreesMinutes = null;
    this._isTouchMouseMove = false;
    this._disabledTime = null;
    this._cloned = null;
    this._isModalRemove = true;
    this._isOpen = false;
    this._isInitialized = false;
    this._isDestroyed = true;
    this._eventHandlersRegistered = false;
  }

  private q<T extends Element = HTMLElement>(selector: string): T | null {
    const modal = this.getModalElement();
    return (modal?.querySelector(selector) as T | null) ?? null;
  }

  private qMobile<T extends Element = HTMLElement>(mobileSel: string, desktopSel: string): T | null {
    return this._isMobileView ? this.q<T>(mobileSel) : this.q<T>(desktopSel);
  }

  getModalElement(): HTMLDivElement | null {
    if (isDocument() === false) return null;
    return document.querySelector(`[data-owner-id="${this.instanceId}"]`);
  }

  getInput(): HTMLInputElement | null {
    return this.element?.querySelector('input');
  }

  getClockFace(): HTMLDivElement | null {
    return this.qMobile<HTMLDivElement>('.tp-ui-clock-face.mobile', '.tp-ui-clock-face:not(.mobile)');
  }

  getClockHand(): HTMLDivElement | null {
    return this.qMobile<HTMLDivElement>(
      '.tp-ui-mobile-clock-wrapper .tp-ui-clock-hand',
      '.tp-ui-clock-hand:not(.mobile)',
    );
  }

  getCircle(): HTMLDivElement | null {
    return this.qMobile<HTMLDivElement>(
      '.tp-ui-mobile-clock-wrapper .tp-ui-circle-hand',
      '.tp-ui-circle-hand:not(.mobile)',
    );
  }

  getTipsWrapper(): HTMLDivElement | null {
    return this.qMobile<HTMLDivElement>(
      '.tp-ui-mobile-clock-wrapper .tp-ui-tips-wrapper',
      '.tp-ui-tips-wrapper:not(.mobile)',
    );
  }

  getTipsWrapperFor24h(): HTMLDivElement | null {
    return this.qMobile<HTMLDivElement>(
      '.tp-ui-mobile-clock-wrapper .tp-ui-tips-wrapper-24h',
      '.tp-ui-tips-wrapper-24h:not(.mobile)',
    );
  }

  getMinutes(): HTMLInputElement | null {
    return this.q<HTMLInputElement>('.tp-ui-minutes');
  }

  getHour(): HTMLInputElement | null {
    return this.q<HTMLInputElement>('.tp-ui-hour');
  }

  getAM(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-am');
  }

  getPM(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-pm');
  }

  getHourText(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-hour-text');
  }

  getMinutesText(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-minute-text');
  }

  getHeader(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-header');
  }

  getInputWrappers(): NodeListOf<Element> | null {
    const modal = this.getModalElement();
    return modal?.querySelectorAll('.tp-ui-input-wrapper') || null;
  }

  getDots(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-dots');
  }

  getMinutesTips(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-minutes-time');
  }

  getHourTips(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-hour-time-12');
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
    const data: NodeListOf<HTMLElement> = this.element?.querySelectorAll('[data-open]');

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

    return openData.map((open) => this.element?.querySelectorAll(`[data-open='${open}']`))[0] ?? '';
  }

  getCancelButton(): HTMLButtonElement | null {
    return this.q<HTMLButtonElement>('.tp-ui-cancel-btn');
  }

  getOkButton(): HTMLButtonElement | null {
    return this.q<HTMLButtonElement>('.tp-ui-ok-btn');
  }

  getActiveTypeMode(): HTMLButtonElement | null {
    return this.q<HTMLButtonElement>('.tp-ui-type-mode.active');
  }

  getKeyboardClockIcon(): HTMLButtonElement | null {
    return this.q<HTMLButtonElement>('.tp-ui-keyboard-icon-wrapper');
  }

  getFooter(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-footer');
  }

  getWrapper(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-wrapper');
  }
}
