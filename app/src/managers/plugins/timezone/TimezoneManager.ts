import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { clearTimezoneCache } from '../../../utils/timezone';
import { isDocument } from '../../../utils/node';
import { bindEmitter } from '../../../utils/managerHelpers';
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
    this.releaseHandlers();
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
    const combobox = this.dropdown.getCombobox();

    if (!dropdownEl || !menu || !combobox) return;

    const clickOutsideHandler = (e: MouseEvent): void => {
      if (!dropdownEl.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const closeMenu = (): void => {
      this.dropdown.setOpen(false);
      this.keyboard.reset();
      if (isDocument()) {
        document.removeEventListener('click', clickOutsideHandler);
      }
    };

    const toggleHandler = (e: Event): void => {
      e.stopPropagation();
      const isOpen = this.dropdown.isOpen();

      if (!isOpen) {
        this.openMenu(this.dropdown.getOptions(), combobox);
        combobox.focus({ preventScroll: true });
        this.clickOutsideTimerId = window.setTimeout(() => {
          if (isDocument()) {
            document.addEventListener('click', clickOutsideHandler);
          }
          this.clickOutsideTimerId = null;
        }, TIMINGS.DROPDOWN_CLICK_DELAY);
      } else {
        closeMenu();
      }
    };

    const keydownHandler = (e: KeyboardEvent): void => {
      this.handleKeydown(e, closeMenu);
    };

    const optionClickHandler = (e: Event): void => {
      e.stopPropagation();
      const targetElement = e.target;
      if (!(targetElement instanceof HTMLElement)) return;

      const option = targetElement.closest('.tp-ui-timezone-option');
      if (option instanceof HTMLElement) {
        const value = option.getAttribute('data-value');
        if (value) {
          this.selectFromMenu(value, closeMenu);
          combobox.focus();
        }
      }
    };

    dropdownEl.addEventListener('click', toggleHandler);
    combobox.addEventListener('keydown', keydownHandler);
    menu.addEventListener('click', optionClickHandler);

    this.cleanupHandlers.push(
      () => dropdownEl.removeEventListener('click', toggleHandler),
      () => combobox.removeEventListener('keydown', keydownHandler),
      () => menu.removeEventListener('click', optionClickHandler),
      closeMenu,
    );

    bindEmitter(this.emitter, this.cleanupHandlers, 'clear', () => {
      this.dropdown.clearSelection();
      closeMenu();
    });
  }

  private selectFromMenu(value: string, closeMenu: () => void): void {
    if (!this.core.isOpen) return;

    this.dropdown.selectTimezone(value);
    closeMenu();
  }

  private handleKeydown(e: KeyboardEvent, closeMenu: () => void): void {
    const combobox = this.dropdown.getCombobox();
    if (!combobox) return;

    const isOpen = this.dropdown.isOpen();
    const options = this.dropdown.getOptions();

    if (this.isTypeAheadKey(e)) {
      e.preventDefault();
      this.typeAhead(e.key, options, combobox);
      return;
    }

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          this.openMenu(options, combobox);
        } else {
          this.selectFocused(options, closeMenu);
        }
        break;

      case 'Tab':
        if (isOpen) {
          this.selectFocused(options, closeMenu);
          closeMenu();
        }
        break;

      case 'Escape':
        if (!isOpen) break;
        e.preventDefault();
        closeMenu();
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          this.openMenu(options, combobox);
        } else {
          this.keyboard.moveDown(options.length);
          this.keyboard.updateVisualFocus(options, combobox);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          this.keyboard.moveUp();
          this.keyboard.updateVisualFocus(options, combobox);
        }
        break;

      case 'Home':
        if (isOpen) {
          e.preventDefault();
          this.keyboard.moveToFirst();
          this.keyboard.updateVisualFocus(options, combobox);
        }
        break;

      case 'End':
        if (isOpen) {
          e.preventDefault();
          this.keyboard.moveToLast(options.length);
          this.keyboard.updateVisualFocus(options, combobox);
        }
        break;
    }
  }

  private isTypeAheadKey(e: KeyboardEvent): boolean {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return false;
    return e.key !== ' ' || this.keyboard.isTyping();
  }

  private openMenu(options: HTMLElement[], combobox: HTMLElement): void {
    this.dropdown.setOpen(true);
    const selected = this.dropdown.getSelectedIndex();
    this.keyboard.setFocusedIndex(selected >= 0 ? selected : 0);
    this.keyboard.updateVisualFocus(options, combobox);
  }

  private typeAhead(character: string, options: HTMLElement[], combobox: HTMLElement): void {
    if (!this.dropdown.isOpen()) {
      this.openMenu(options, combobox);
    }

    const labels = options.map((option) => option.textContent ?? '');
    if (this.keyboard.matchTypedCharacter(character, labels) >= 0) {
      this.keyboard.updateVisualFocus(options, combobox);
    }
  }

  private selectFocused(options: HTMLElement[], closeMenu: () => void): void {
    const value = options[this.keyboard.getFocusedIndex()]?.getAttribute('data-value');
    if (value) {
      this.selectFromMenu(value, closeMenu);
    }
  }

  destroy(): void {
    this.releaseHandlers();
    this.keyboard.reset();
    this.dropdown.reset();
    clearTimezoneCache();
  }

  private releaseHandlers(): void {
    if (this.clickOutsideTimerId !== null) {
      window.clearTimeout(this.clickOutsideTimerId);
      this.clickOutsideTimerId = null;
    }

    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
  }
}
