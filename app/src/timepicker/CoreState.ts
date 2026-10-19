import { isDocument } from '../utils/node';
import { mergeOptionGroups } from '../utils/options/defaults';
import type { TimepickerOptions } from '../types/options';
import type { TimePredicate } from '../utils/time/predicate';

export interface CoreStateData {
  readonly degreesHours: number | null;
  readonly degreesMinutes: number | null;
  readonly degreesSeconds: number | null;
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
      seconds?: string[];
      predicate?: TimePredicate;
    };
  } | null;
  readonly timePredicate: TimePredicate | null;
  readonly cloned: Node | null;
  readonly isModalRemove: boolean;
  readonly isOpen: boolean;
  readonly isInitialized: boolean;
  readonly customId?: string;
  readonly eventHandlersRegistered: boolean;
  readonly isDestroyed: boolean;
}

/** @remarks This API changes in 5.0.0; see the roadmap. */
export class CoreState {
  private _degreesHours: number | null = null;
  private _degreesMinutes: number | null = null;
  private _degreesSeconds: number | null = null;
  private _options: Required<TimepickerOptions>;
  private _isMobileView = false;
  private _isTouchMouseMove = false;
  private _disabledTime: CoreStateData['disabledTime'] = null;
  private _timePredicate: TimePredicate | null = null;
  private _cloned: Node | null = null;
  private _isModalRemove = true;
  private _isOpen = false;
  private _isInitialized = false;
  private _eventHandlersRegistered = false;
  private _isDestroyed = false;
  private _modalElement: HTMLDivElement | null = null;

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
  get degreesSeconds(): number | null {
    return this._degreesSeconds;
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
  get timePredicate(): TimePredicate | null {
    return this._timePredicate;
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
  setDegreesSeconds(value: number | null): void {
    this._degreesSeconds = value;
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
  setTimePredicate(value: TimePredicate | null): void {
    this._timePredicate = value;
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
    this._options = mergeOptionGroups(this._options, updates);
  }

  reset(): void {
    this._degreesHours = null;
    this._degreesMinutes = null;
    this._degreesSeconds = null;
    this._isTouchMouseMove = false;
    this._disabledTime = null;
    this._timePredicate = null;
    this._cloned = null;
    this._isModalRemove = true;
    this._isOpen = false;
    this._isInitialized = false;
    this._isDestroyed = true;
    this._eventHandlersRegistered = false;
    this._modalElement = null;
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

    const cached = this._modalElement;
    if (cached?.isConnected && cached.dataset.ownerId === this.instanceId) return cached;

    const candidates = document.querySelectorAll<HTMLDivElement>('[data-owner-id]');
    for (let index = 0; index < candidates.length; index++) {
      if (candidates[index].dataset.ownerId === this.instanceId) {
        this._modalElement = candidates[index];
        return this._modalElement;
      }
    }

    this._modalElement = null;
    return null;
  }

  getInput(): HTMLInputElement | null {
    return this.element?.querySelector('input');
  }

  getClockFace(): HTMLDivElement | null {
    return (
      this.qMobile<HTMLDivElement>('.tp-ui-clock-face.mobile', '.tp-ui-clock-face:not(.mobile)') ??
      this.q<HTMLDivElement>('.tp-ui-clock-face')
    );
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

  getSeconds(): HTMLInputElement | null {
    return this.q<HTMLInputElement>('.tp-ui-seconds');
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

  getSecondsText(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-second-text');
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

  getOpenElement(): NodeListOf<Element> | ReadonlyArray<Element> {
    const openers = Array.from(this.element.querySelectorAll<HTMLElement>('[data-open]'));

    if (openers.length === 0) {
      const input = this.getInput();
      input?.setAttribute('data-open', 'tp-ui-input');
      return [input as HTMLInputElement];
    }

    const firstOpen = openers[0].dataset.open;
    return openers.filter((opener) => opener.dataset.open === firstOpen);
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

  getActiveType(): 'AM' | 'PM' | undefined {
    const type = this.getActiveTypeMode()?.dataset.type;
    return type === 'AM' || type === 'PM' ? type : undefined;
  }

  getKeyboardClockIcon(): HTMLButtonElement | null {
    return this.q<HTMLButtonElement>('.tp-ui-keyboard-icon');
  }

  getFooter(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-footer');
  }

  getWrapper(): HTMLDivElement | null {
    return this.q<HTMLDivElement>('.tp-ui-wrapper');
  }
}
