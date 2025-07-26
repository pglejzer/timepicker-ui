import type { OptionTypes, CallbackData } from './types';
import type ClockFaceManagerPool from '../managers/ClockFaceManagerPool';
import type { TimepickerEventMap } from '../utils/EventEmitter';

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
  _disabledTime: {
    value?: {
      isInterval?: boolean;
      intervals?: string[];
      clockType?: string;
      hours?: string[];
      minutes?: string[];
    };
  } | null;
  _cloned: Node | null;
  _inputEvents: string[];
  _isModalRemove?: boolean;
  _isInitialized: boolean;
  _customId?: string;

  clockFacePool: ClockFaceManagerPool;

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
  readonly openElement: NodeListOf<Element> | readonly [HTMLInputElement];
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
  setTheme(themeConfig: {
    primaryColor?: string;
    backgroundColor?: string;
    surfaceColor?: string;
    surfaceHoverColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    disabledTextColor?: string;
    onPrimaryColor?: string;
    borderColor?: string;
    shadow?: string;
    borderRadius?: string;
    fontFamily?: string;
  }): void;

  on<K extends keyof TimepickerEventMap>(event: K, handler: (data: TimepickerEventMap[K]) => void): void;
  once<K extends keyof TimepickerEventMap>(event: K, handler: (data: TimepickerEventMap[K]) => void): void;
  off<K extends keyof TimepickerEventMap>(event: K, handler?: (data: TimepickerEventMap[K]) => void): void;

  eventManager?: import('../managers/EventManager').default;
  modalManager?: import('../managers/ModalManager').default;
  animationManager?: import('../managers/AnimationManager').default;
  clockManager?: import('../managers/ClockManager').default;
  validationManager?: import('../managers/ValidationManager').default;
  themeManager?: import('../managers/ThemeManager').default;
  configManager?: import('../managers/ConfigManager').default;
  domBatcher: import('../utils/DOMUpdateBatcher').DOMUpdateBatcher;
}
