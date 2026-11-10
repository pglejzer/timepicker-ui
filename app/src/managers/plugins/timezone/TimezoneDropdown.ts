import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { getLocalTimezone, getTimezoneList, type TimezoneInfo } from '../../../utils/timezone';
import { escapeHtml } from '../../../utils/template/escape';

const OPEN_CLASS = 'tp-ui-timezone-dropdown--open';

export class TimezoneDropdown {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private selectedTimezone: string | null = null;
  private placeholder = '';
  private reportedKey: string | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  getDropdown(): HTMLElement | null {
    return this.core.getModalElement()?.querySelector('.tp-ui-timezone-dropdown') ?? null;
  }

  getCombobox(): HTMLElement | null {
    return this.getDropdown()?.querySelector<HTMLElement>('.tp-ui-timezone-selected') ?? null;
  }

  getSelectedIndex(): number {
    if (!this.selectedTimezone) return -1;
    return this.getOptions().findIndex(
      (option) => option.getAttribute('data-value') === this.selectedTimezone,
    );
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

  private getInstanceId(): string {
    const dropdown = this.getDropdown();
    return dropdown?.getAttribute('data-tz-id') ?? 'tp';
  }

  getOptionId(index: number): string {
    return `tp-tz-opt-${this.getInstanceId()}-${index}`;
  }

  populateOptions(): void {
    const { whitelist } = this.core.options.timezone ?? {};
    const timezones = getTimezoneList(whitelist);
    const menu = this.getMenu();

    if (!menu) return;

    const optionsHtml = timezones
      .map(
        (tz: TimezoneInfo, index: number) =>
          `<div class="tp-ui-timezone-option" role="option" id="${escapeHtml(this.getOptionId(index))}" data-value="${escapeHtml(tz.id)}" aria-selected="false" tabindex="-1">${escapeHtml(tz.label)}</div>`,
      )
      .join('');

    menu.innerHTML = optionsHtml;
  }

  setOpen(isOpen: boolean): void {
    const dropdown = this.getDropdown();
    const combobox = this.getCombobox();
    if (!dropdown || !combobox) return;

    combobox.setAttribute('aria-expanded', String(isOpen));
    dropdown.classList.toggle(OPEN_CLASS, isOpen);

    if (isOpen) {
      const selectedOption = this.getMenu()?.querySelector('[data-selected="true"]');
      if (selectedOption instanceof HTMLElement) {
        selectedOption.scrollIntoView({ block: 'nearest' });
      }
    } else {
      combobox.removeAttribute('aria-activedescendant');
    }
  }

  isOpen(): boolean {
    return this.getDropdown()?.classList.contains(OPEN_CLASS) === true;
  }

  selectTimezone(timezoneId: string, emitEvent: boolean = true): void {
    this.selectedTimezone = timezoneId;
    this.renderSelection();

    if (emitEvent) {
      this.emitter.emit('timezone:change', { timezone: timezoneId });
    }
  }

  clearSelection(): void {
    this.selectedTimezone = null;
    this.renderSelection();
  }

  getSelectedTimezone(): string | null {
    return this.selectedTimezone;
  }

  restorePreviousSelection(): void {
    const selectedDisplay = this.getCombobox();
    if (!selectedDisplay) return;

    this.placeholder = selectedDisplay.getAttribute('data-placeholder') ?? this.placeholder;

    if (this.selectedTimezone) {
      this.renderSelection();
      return;
    }

    const defaultTz = this.core.options.timezone?.default;
    if (defaultTz) {
      this.selectTimezone(this.resolveListedTimezone(defaultTz));
    }
  }

  private renderSelection(): void {
    const selectedDisplay = this.getCombobox();
    if (!selectedDisplay) return;

    let selectedLabel = '';
    this.getOptions().forEach((option) => {
      const isSelected = option.getAttribute('data-value') === this.selectedTimezone;
      option.setAttribute('data-selected', String(isSelected));
      option.setAttribute('aria-selected', String(isSelected));
      if (isSelected) {
        selectedLabel = option.textContent || '';
      }
    });

    if (this.selectedTimezone) {
      selectedDisplay.textContent = selectedLabel;
      selectedDisplay.removeAttribute('data-placeholder');
    } else {
      selectedDisplay.textContent = this.placeholder;
      selectedDisplay.setAttribute('data-placeholder', this.placeholder);
    }
  }

  private resolveListedTimezone(preferred: string): string {
    const listed = this.getOptions().map((option) => option.getAttribute('data-value'));
    if (listed.includes(preferred)) return preferred;

    const local = getLocalTimezone();
    const fallback = listed.includes(local) ? local : (listed[0] ?? preferred);
    if (fallback !== preferred) {
      this.reportUnlisted(preferred, fallback, listed);
    }
    return fallback;
  }

  private reportUnlisted(preferred: string, fallback: string, listed: Array<string | null>): void {
    const key = `${preferred}|${listed.join(',')}`;
    if (this.reportedKey === key) return;

    this.reportedKey = key;
    this.emitter.emit('error', {
      error: `timezone.default "${preferred}" is not in the timezone list, using "${fallback}"`,
    });
  }

  reset(): void {
    this.selectedTimezone = null;
  }
}
