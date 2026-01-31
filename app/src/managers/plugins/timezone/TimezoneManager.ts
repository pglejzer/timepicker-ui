import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { clearTimezoneCache } from '../../../utils/timezone';
import { isDocument, isNode } from '../../../utils/node';
import { TIMINGS } from '../../../constants/timings';
import { TimezoneDropdown } from './TimezoneDropdown';
import { TimezoneKeyboard } from './TimezoneKeyboard';

export default class TimezoneManager {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private readonly dropdown: TimezoneDropdown;
  private readonly keyboard: TimezoneKeyboard;
  private cleanupHandlers: Array<() => void> = [];
  private clickOutsideTimerId: number | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.dropdown = new TimezoneDropdown(core, emitter);
    this.keyboard = new TimezoneKeyboard();
  }

  private get isEnabled(): boolean {
    return this.core.options.timezone?.enabled === true;
  }

  init(): void {
    if (!this.isEnabled || !isDocument()) return;

    const dropdownEl = this.dropdown.getDropdown();
    if (!dropdownEl) return;

    this.dropdown.populateOptions();
    this.dropdown.restorePreviousSelection();
    this.bindEvents();
  }

  getSelectedTimezone(): string | null {
    return this.dropdown.getSelectedTimezone();
  }

  setTimezone(timezoneId: string): void {
    if (!this.isEnabled) return;
    this.dropdown.selectTimezone(timezoneId);
  }

  private bindEvents(): void {
    const dropdownEl = this.dropdown.getDropdown();
    const menu = this.dropdown.getMenu();

    if (!dropdownEl || !menu) return;

    const clickOutsideHandler = (e: MouseEvent): void => {
      if (!dropdownEl.contains(e.target as Node)) {
        this.dropdown.setOpen(false);
        this.keyboard.reset();
        if (isDocument()) {
          document.removeEventListener('click', clickOutsideHandler);
        }
      }
    };

    const toggleHandler = (e: Event): void => {
      e.stopPropagation();
      const isOpen = this.dropdown.isOpen();

      if (!isOpen) {
        this.dropdown.setOpen(true);
        if (!isNode()) {
          this.clickOutsideTimerId = window.setTimeout(() => {
            if (isDocument()) {
              document.addEventListener('click', clickOutsideHandler);
            }
            this.clickOutsideTimerId = null;
          }, TIMINGS.DROPDOWN_CLICK_DELAY);
        }
      } else {
        this.dropdown.setOpen(false);
        this.keyboard.reset();
      }
    };

    const keydownHandler = (e: KeyboardEvent): void => {
      this.handleKeydown(e, clickOutsideHandler);
    };

    const optionClickHandler = (e: Event): void => {
      e.stopPropagation();
      const targetElement = e.target;
      if (!(targetElement instanceof HTMLElement)) return;

      const option = targetElement.closest('.tp-ui-timezone-option');
      if (option instanceof HTMLElement) {
        const value = option.getAttribute('data-value');
        if (value) {
          this.dropdown.selectTimezone(value);
          this.dropdown.setOpen(false);
          this.keyboard.reset();

          if (isDocument()) {
            document.removeEventListener('click', clickOutsideHandler);
          }
          dropdownEl.focus();
        }
      }
    };

    dropdownEl.addEventListener('click', toggleHandler);
    dropdownEl.addEventListener('keydown', keydownHandler);
    menu.addEventListener('click', optionClickHandler);

    this.cleanupHandlers.push(
      () => dropdownEl.removeEventListener('click', toggleHandler),
      () => dropdownEl.removeEventListener('keydown', keydownHandler),
      () => menu.removeEventListener('click', optionClickHandler),
      () => {
        if (isDocument()) {
          document.removeEventListener('click', clickOutsideHandler);
        }
      },
    );
  }

  private handleKeydown(e: KeyboardEvent, clickOutsideHandler: (e: MouseEvent) => void): void {
    const dropdownEl = this.dropdown.getDropdown();
    if (!dropdownEl) return;

    const isOpen = this.dropdown.isOpen();
    const options = this.dropdown.getOptions();

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          this.dropdown.setOpen(true);
        } else {
          const focusedIndex = this.keyboard.getFocusedIndex();
          if (focusedIndex >= 0) {
            const value = options[focusedIndex]?.getAttribute('data-value');
            if (value) {
              this.dropdown.selectTimezone(value);
              this.dropdown.setOpen(false);
              this.keyboard.reset();
            }
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.dropdown.setOpen(false);
        this.keyboard.reset();
        if (isDocument()) {
          document.removeEventListener('click', clickOutsideHandler);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          this.dropdown.setOpen(true);
        } else {
          this.keyboard.moveDown(options.length);
          this.keyboard.updateVisualFocus(options);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          this.keyboard.moveUp();
          this.keyboard.updateVisualFocus(options);
        }
        break;

      case 'Home':
        if (isOpen) {
          e.preventDefault();
          this.keyboard.moveToFirst();
          this.keyboard.updateVisualFocus(options);
        }
        break;

      case 'End':
        if (isOpen) {
          e.preventDefault();
          this.keyboard.moveToLast(options.length);
          this.keyboard.updateVisualFocus(options);
        }
        break;
    }
  }

  destroy(): void {
    if (this.clickOutsideTimerId !== null) {
      window.clearTimeout(this.clickOutsideTimerId);
      this.clickOutsideTimerId = null;
    }

    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
    this.keyboard.reset();
    this.dropdown.reset();
    clearTimezoneCache();
  }
}
