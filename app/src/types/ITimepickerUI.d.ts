import type { OptionTypes } from './types';

export interface ITimepickerUI {
  _degreesHours: number | null;
  _degreesMinutes: number | null;
  _eventsBundle: () => void;
  _options: OptionTypes;
  _eventsClickMobile: (event: Event) => Promise<void>;
  _eventsClickMobileHandler: EventListenerOrEventListenerObject;
  _mutliEventsMove: (event: Event) => void;
  _mutliEventsMoveHandler: EventListenerOrEventListenerObject;
  _clickTouchEvents: string[];
  _element: HTMLElement;
  _instanceId: string;
  _isMobileView: boolean | null;
  _isTouchMouseMove: boolean | null;
  _disabledTime: any;
  _cloned: Node | null;
  _inputEvents: string[];
  _isModalRemove?: boolean;
  _isInitialized: boolean;
  _customId?: string;

  readonly modalTemplate: string;
  readonly modalElement: HTMLDivElement;
  readonly clockFace: HTMLDivElement;
  readonly input: HTMLInputElement;
  readonly clockHand: HTMLDivElement;
  readonly circle: HTMLDivElement;
  readonly tipsWrapper: HTMLDivElement;
  readonly tipsWrapperFor24h: HTMLDivElement;
  readonly minutes: HTMLInputElement;
  readonly hour: HTMLInputElement;
  readonly AM: HTMLDivElement;
  readonly PM: HTMLDivElement;
  readonly minutesTips: HTMLDivElement;
  readonly hourTips: HTMLDivElement;
  readonly allValueTips: readonly HTMLDivElement[];
  readonly openElementData: string[] | null;
  readonly openElement: any;
  readonly cancelButton: HTMLButtonElement;
  readonly okButton: HTMLButtonElement;
  readonly activeTypeMode: HTMLButtonElement;
  readonly keyboardClockIcon: HTMLButtonElement;
  readonly footer: HTMLDivElement;
  readonly wrapper: HTMLDivElement;

  create(): void;
  open(callback?: () => void): void;
  close(): (...args: (boolean | (() => void))[]) => void;
  destroy(options?: { keepInputValue?: boolean; callback?: () => void } | (() => void)): void;
  update(value: { options: OptionTypes; create?: boolean }, callback?: () => void): void;
  getElement(): HTMLElement;
  getValue(): {
    hour: string;
    minutes: string;
    type?: string;
    time: string;
    degreesHours: number | null;
    degreesMinutes: number | null;
  };
  setValue(time: string, updateInput?: boolean): void;

  eventManager?: any;
  modalManager?: any;
  animationManager?: any;
  clockManager?: any;
  validationManager?: any;
  themeManager?: any;
  configManager?: any;
}
