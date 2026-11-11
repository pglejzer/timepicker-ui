import type { TimepickerOptions } from '@/types/options';

const ID = 'inst1';

const render = (options: TimepickerOptions, registerTimezone = true): HTMLElement => {
  let html = '';
  jest.isolateModules(() => {
    const { getModalTemplate } = require('@/utils/template');
    const { mergeOptions } = require('@/utils/options/defaults');
    const { PluginRegistry } = require('@/core/PluginRegistry');
    if (registerTimezone) PluginRegistry.register(require('@/plugins/timezone').TimezonePlugin);
    html = getModalTemplate(mergeOptions(options), ID);
  });
  const host = document.createElement('div');
  host.innerHTML = html;
  return host;
};

describe('modal template with the timezone plugin', () => {
  const timezoneOptions: TimepickerOptions = { timezone: { enabled: true } };
  const ARIA_ON_WRAPPER = [
    'role',
    'tabindex',
    'aria-expanded',
    'aria-haspopup',
    'aria-controls',
    'aria-labelledby',
  ];

  it('keeps the dropdown wrapper free of role, tabindex and aria attributes', () => {
    const dropdown = render(timezoneOptions).querySelector('.tp-ui-timezone-dropdown') as HTMLElement;

    expect(dropdown.getAttribute('data-tz-id')).toBe(ID);
    ARIA_ON_WRAPPER.forEach((name) => expect(dropdown.hasAttribute(name)).toBe(false));
    expect(Array.from(dropdown.attributes).filter(({ name }) => name.startsWith('aria-'))).toEqual([]);
  });

  it('puts the combobox on the selected-display element', () => {
    const combobox = render(timezoneOptions).querySelector('.tp-ui-timezone-selected') as HTMLElement;

    expect(combobox.getAttribute('role')).toBe('combobox');
    expect(combobox.getAttribute('tabindex')).toBe('0');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    expect(combobox.getAttribute('aria-haspopup')).toBe('listbox');
    expect(combobox.getAttribute('aria-labelledby')).toBe(`tp-tz-label-${ID}`);
    expect(combobox.getAttribute('aria-controls')).toBe(`tp-tz-list-${ID}`);
  });

  it('points aria-controls at the menu inside the dropdown and labels both', () => {
    const dom = render(timezoneOptions);
    const combobox = dom.querySelector('.tp-ui-timezone-selected') as HTMLElement;
    const controlled = dom.querySelector(`[id="${combobox.getAttribute('aria-controls')}"]`) as HTMLElement;
    const dropdown = dom.querySelector('.tp-ui-timezone-dropdown') as HTMLElement;

    expect(controlled).toBe(dropdown.querySelector('.tp-ui-timezone-menu'));
    expect(controlled.getAttribute('role')).toBe('listbox');
    expect(dom.querySelector(`[id="tp-tz-label-${ID}"]`)).not.toBeNull();
  });

  it('hides the arrow icon from assistive technology', () => {
    const arrow = render(timezoneOptions).querySelector('.tp-ui-timezone-arrow') as Element;

    expect(arrow.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders no timezone selector without the plugin', () => {
    expect(render(timezoneOptions, false).querySelector('.tp-ui-timezone')).toBeNull();
  });
});
