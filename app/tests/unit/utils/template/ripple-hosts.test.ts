import { getModalTemplate } from '@/utils/template';
import { mergeOptions } from '@/utils/options/defaults';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import { TimezonePlugin } from '@/plugins/timezone';
import { WheelPlugin } from '@/plugins/wheel';
import type { TimepickerOptions } from '@/types/options';

PluginRegistry.register(WheelPlugin);
PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);

const render = (options: TimepickerOptions): HTMLElement => {
  const container = document.createElement('div');
  container.innerHTML = getModalTemplate(mergeOptions(options), 'tp-ripple');
  return container;
};

const isRippleHost = (element: Element | null): boolean => !!element?.hasAttribute('data-md3-ripple');

describe('ripple hosts in the modal template', () => {
  it('should mark both range tabs as ripple hosts', () => {
    const tabs = [...render({ range: { enabled: true } }).querySelectorAll('.tp-ui-range-tab')];

    expect(tabs).toHaveLength(2);
    expect(tabs.map(isRippleHost)).toEqual([true, true]);
  });

  it.each([
    { view: 'desktop', ui: { enableSwitchIcon: true } },
    { view: 'mobile', ui: { enableSwitchIcon: true, mobile: true } },
  ])('should mark the switch-view icon wrapper as a ripple host ($view)', ({ ui }) => {
    const wrapper = render({ ui }).querySelector('.tp-ui-keyboard-icon-wrapper');

    expect(wrapper).not.toBeNull();
    expect(isRippleHost(wrapper)).toBe(true);
  });

  it('should mark the visible timezone trigger as a ripple host', () => {
    const trigger = render({ timezone: { enabled: true } }).querySelector('.tp-ui-timezone-selected');

    expect(trigger).not.toBeNull();
    expect(isRippleHost(trigger)).toBe(true);
  });

  it('should keep the timezone dropdown, which holds the option menu, out of the ripple hosts', () => {
    const dropdown = render({ timezone: { enabled: true } }).querySelector(
      '.tp-ui-timezone-dropdown[role="combobox"]',
    );

    expect(dropdown).not.toBeNull();
    expect(isRippleHost(dropdown)).toBe(false);
  });

  it.each([
    '.tp-ui-am',
    '.tp-ui-pm',
    '.tp-ui-clear-btn',
    '.tp-ui-cancel-btn',
    '.tp-ui-ok-btn',
    '.tp-ui-input-ripple-wrapper',
  ])('should keep %s as a ripple host', (selector) => {
    const element = render({ ui: { clearButton: true } }).querySelector(selector);

    expect(element).not.toBeNull();
    expect(isRippleHost(element)).toBe(true);
  });

  it.each<[string, TimepickerOptions]>([
    ['clock 12h', {}],
    ['mobile 12h', { ui: { mobile: true } }],
    ['wheel 12h', { ui: { mode: 'wheel' } }],
    ['range 12h', { range: { enabled: true } }],
    [
      'every ripple host',
      {
        ui: { clearButton: true, enableSwitchIcon: true },
        range: { enabled: true },
        timezone: { enabled: true },
      },
    ],
  ])('should render no element with the tp-ui-ripple class (%s)', (_name, options) => {
    expect(render(options).querySelector('.tp-ui-ripple')).toBeNull();
  });
});
