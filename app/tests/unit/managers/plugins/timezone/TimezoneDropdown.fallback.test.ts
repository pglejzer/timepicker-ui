import TimepickerUI from '../../../../../src/timepicker/TimepickerUI';
import { PluginRegistry } from '../../../../../src/core/PluginRegistry';
import { TimezonePlugin } from '../../../../../src/plugins/timezone';

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
