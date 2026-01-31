import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { getTimezoneList, type TimezoneInfo } from '../../../utils/timezone';

export class TimezoneDropdown {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private selectedTimezone: string | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  getDropdown(): HTMLElement | null {
    return this.core.getModalElement()?.querySelector('.tp-ui-timezone-dropdown') ?? null;
  }

  getMenu(): HTMLElement | null {
    return this.core.getModalElement()?.querySelector('.tp-ui-timezone-menu') ?? null;
  }

  getOptions(): HTMLElement[] {
    const menu = this.getMenu();
    if (!menu) return [];

    const nodeList = menu.querySelectorAll('.tp-ui-timezone-option');
    const options: HTMLElement[] = [];
    nodeList.forEach((node) => {
      if (node instanceof HTMLElement) {
        options.push(node);
      }
    });
    return options;
  }

  populateOptions(): void {
    const { whitelist } = this.core.options.timezone ?? {};
    const timezones = getTimezoneList(whitelist);
    const menu = this.getMenu();

    if (!menu) return;

    const optionsHtml = timezones
      .map(
        (tz: TimezoneInfo) =>
          `<div class="tp-ui-timezone-option" role="option" data-value="${tz.id}" tabindex="-1">${tz.label}</div>`,
      )
      .join('');

    menu.innerHTML = optionsHtml;
  }

  setOpen(isOpen: boolean): void {
    const dropdown = this.getDropdown();
    if (!dropdown) return;

    dropdown.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      const menu = this.getMenu();
      const selectedOption = menu?.querySelector('[data-selected="true"]');
      if (selectedOption instanceof HTMLElement) {
        selectedOption.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  isOpen(): boolean {
    const dropdown = this.getDropdown();
    return dropdown?.getAttribute('aria-expanded') === 'true';
  }

  selectTimezone(timezoneId: string, emitEvent: boolean = true): void {
    this.selectedTimezone = timezoneId;

    const dropdown = this.getDropdown();
    const selectedDisplay = dropdown?.querySelector('.tp-ui-timezone-selected');
    const menu = this.getMenu();

    if (selectedDisplay && menu) {
      const options = menu.querySelectorAll('.tp-ui-timezone-option');
      let selectedLabel = '';

      options.forEach((option) => {
        const isSelected = option.getAttribute('data-value') === timezoneId;
        option.setAttribute('data-selected', String(isSelected));
        if (isSelected) {
          selectedLabel = option.textContent || '';
        }
      });

      selectedDisplay.textContent = selectedLabel;
      selectedDisplay.removeAttribute('data-placeholder');
    }

    if (emitEvent) {
      this.emitter.emit('timezone:change', { timezone: this.selectedTimezone });
    }
  }

  getSelectedTimezone(): string | null {
    return this.selectedTimezone;
  }

  restorePreviousSelection(): void {
    const dropdown = this.getDropdown();
    const selectedDisplay = dropdown?.querySelector('.tp-ui-timezone-selected');

    if (!dropdown || !selectedDisplay) return;

    if (this.selectedTimezone) {
      this.selectTimezone(this.selectedTimezone, false);
    } else {
      const defaultTz = this.core.options.timezone?.default;
      if (defaultTz) {
        this.selectTimezone(defaultTz);
      }
    }
  }

  reset(): void {
    this.selectedTimezone = null;
  }
}

