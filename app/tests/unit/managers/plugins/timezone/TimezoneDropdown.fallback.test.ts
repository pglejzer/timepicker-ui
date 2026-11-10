import TimepickerUI from '../../../../../src/timepicker/TimepickerUI';
import { PluginRegistry } from '../../../../../src/core/PluginRegistry';
import { TimezonePlugin } from '../../../../../src/plugins/timezone';
import { TimezoneDropdown } from '@/managers/plugins/timezone/TimezoneDropdown';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { TIMINGS } from '@/constants/timings';

describe('timezone default outside the whitelist (S6)', () => {
  beforeAll(() => PluginRegistry.register(TimezonePlugin));
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  const openWith = (defaultZone: string): HTMLElement => {
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false },
      timezone: { enabled: true, default: defaultZone, whitelist: ['Europe/Warsaw', 'Europe/London'] },
    });
    picker.create();
    picker.open();
    return document.querySelector('.tp-ui-modal .tp-ui-timezone-selected') as HTMLElement;
  };

  it('falls back to the browser zone when it is listed', () => {
    jest
      .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({ timeZone: 'Europe/London' } as Intl.ResolvedDateTimeFormatOptions);
    expect(openWith('Asia/Tokyo').textContent).toContain('London');
  });

  it('falls back to the first listed zone otherwise', () => {
    jest
      .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({ timeZone: 'America/Denver' } as Intl.ResolvedDateTimeFormatOptions);
    const selected = openWith('Asia/Tokyo');
    const first = document.querySelector('.tp-ui-modal .tp-ui-timezone-option') as HTMLElement;
    expect(selected.textContent?.trim()).not.toBe('');
    expect(selected.textContent).toBe(first.textContent);
  });
});

describe('timezone.default outside the list reports an error (P4)', () => {
  const UNLISTED = 'Europe/Warsaw';
  const WHITELIST = ['Europe/London', 'Asia/Tokyo'];
  const OTHER_WHITELIST = ['Europe/Paris', 'Asia/Tokyo'];

  const unlistedMessage = (fallback: string, zone: string = UNLISTED): string =>
    `timezone.default "${zone}" is not in the timezone list, using "${fallback}"`;

  const browserZone = (zone: string): void => {
    jest
      .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({ timeZone: zone } as Intl.ResolvedDateTimeFormatOptions);
  };

  const mount = (
    defaultZone: string,
  ): {
    dropdown: TimezoneDropdown;
    timezone: { enabled: boolean; default: string; whitelist: string[] };
    onError: jest.Mock;
  } => {
    const modal = document.createElement('div');
    modal.innerHTML =
      '<div class="tp-ui-timezone-dropdown" data-tz-id="fallback">' +
      '<div class="tp-ui-timezone-selected" data-placeholder="Timezone...">Timezone...</div>' +
      '<div class="tp-ui-timezone-menu"></div>' +
      '</div>';
    document.body.appendChild(modal);

    const timezone = { enabled: true, default: defaultZone, whitelist: WHITELIST };
    const core = { getModalElement: () => modal, options: { timezone } };
    const emitter = new EventEmitter<TimepickerEventMap>();
    const onError = jest.fn();
    emitter.on('error', onError);

    const dropdown = new TimezoneDropdown(core as never, emitter);
    dropdown.populateOptions();
    return { dropdown, timezone, onError };
  };

  beforeEach(() => {
    browserZone('America/Denver');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('emits one error naming the default and the zone it fell back to', () => {
    const { dropdown, onError } = mount(UNLISTED);

    dropdown.restorePreviousSelection();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith({ error: unlistedMessage('Europe/London') });
    expect(dropdown.getSelectedTimezone()).toBe('Europe/London');
  });

  it('names the browser zone as the fallback when it is listed', () => {
    browserZone('Asia/Tokyo');
    const { dropdown, onError } = mount(UNLISTED);

    dropdown.restorePreviousSelection();

    expect(onError).toHaveBeenCalledWith({ error: unlistedMessage('Asia/Tokyo') });
    expect(dropdown.getSelectedTimezone()).toBe('Asia/Tokyo');
  });

  it('emits nothing for a default that is listed', () => {
    const { dropdown, onError } = mount('Asia/Tokyo');

    dropdown.restorePreviousSelection();

    expect(onError).not.toHaveBeenCalled();
    expect(dropdown.getSelectedTimezone()).toBe('Asia/Tokyo');
  });

  it('emits nothing new when restorePreviousSelection() runs again after reset()', () => {
    const { dropdown, onError } = mount(UNLISTED);
    dropdown.restorePreviousSelection();

    dropdown.reset();
    dropdown.restorePreviousSelection();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(dropdown.getSelectedTimezone()).toBe('Europe/London');
  });

  it('emits again for a different whitelist', () => {
    const { dropdown, timezone, onError } = mount(UNLISTED);
    dropdown.restorePreviousSelection();

    timezone.whitelist = OTHER_WHITELIST;
    dropdown.populateOptions();
    dropdown.reset();
    dropdown.restorePreviousSelection();

    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenLastCalledWith({ error: unlistedMessage('Europe/Paris') });
  });

  it('emits again for a different unlisted default', () => {
    const { dropdown, timezone, onError } = mount(UNLISTED);
    dropdown.restorePreviousSelection();

    timezone.default = 'Asia/Seoul';
    dropdown.reset();
    dropdown.restorePreviousSelection();

    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenLastCalledWith({ error: unlistedMessage('Europe/London', 'Asia/Seoul') });
  });
});

describe('timezone.default outside the list through a picker (P4)', () => {
  beforeAll(() => PluginRegistry.register(TimezonePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('reports through callbacks.onError once, also after Clear and a reopen', () => {
    jest
      .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({ timeZone: 'America/Denver' } as Intl.ResolvedDateTimeFormatOptions);
    const onError = jest.fn();
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false, clearButton: true },
      callbacks: { onError },
      timezone: { enabled: true, default: 'Asia/Tokyo', whitelist: ['Europe/Warsaw', 'Europe/London'] },
    });
    picker.create();
    picker.open();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith({
      error: 'timezone.default "Asia/Tokyo" is not in the timezone list, using "Europe/Warsaw"',
    });

    document.querySelector<HTMLElement>('.tp-ui-timezone-option[data-value="Europe/London"]')?.click();
    document.querySelector<HTMLElement>('.tp-ui-clear-btn')?.click();
    picker.close();
    jest.advanceTimersByTime(TIMINGS.MODAL_EXIT);
    picker.open();

    expect(onError).toHaveBeenCalledTimes(1);
  });
});
