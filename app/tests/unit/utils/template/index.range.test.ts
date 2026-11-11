import type { TimepickerOptions } from '@/types/options';

const ID = 'inst1';

const render = (options: TimepickerOptions, plugins: ReadonlyArray<'range' | 'timezone'>): HTMLElement => {
  let html = '';
  jest.isolateModules(() => {
    const { getModalTemplate } = require('@/utils/template');
    const { mergeOptions } = require('@/utils/options/defaults');
    const { PluginRegistry } = require('@/core/PluginRegistry');
    if (plugins.includes('range')) PluginRegistry.register(require('@/plugins/range').RangePlugin);
    if (plugins.includes('timezone')) PluginRegistry.register(require('@/plugins/timezone').TimezonePlugin);
    html = getModalTemplate(mergeOptions(options), ID);
  });
  const host = document.createElement('div');
  host.innerHTML = html;
  return host;
};

describe('modal template with the range plugin', () => {
  const rangeOptions: TimepickerOptions = { range: { enabled: true } };

  it('names the tabs by instance and points both at the panel', () => {
    const dom = render(rangeOptions, ['range']);
    const from = dom.querySelector('.tp-ui-range-from') as HTMLElement;
    const to = dom.querySelector('.tp-ui-range-to') as HTMLElement;

    expect(from.id).toBe(`tp-ui-range-from-${ID}`);
    expect(to.id).toBe(`tp-ui-range-to-${ID}`);
    expect(from.getAttribute('aria-controls')).toBe(`tp-ui-range-panel-${ID}`);
    expect(to.getAttribute('aria-controls')).toBe(`tp-ui-range-panel-${ID}`);
    expect(from.getAttribute('role')).toBe('tab');
    expect(to.getAttribute('role')).toBe('tab');
  });

  it('renders one tabpanel labelled by the From tab that wraps the header and the clock', () => {
    const dom = render(rangeOptions, ['range']);
    const panels = dom.querySelectorAll('.tp-ui-range-panel');
    const panel = panels[0] as HTMLElement;

    expect(panels).toHaveLength(1);
    expect(panel.getAttribute('role')).toBe('tabpanel');
    expect(panel.id).toBe(`tp-ui-range-panel-${ID}`);
    expect(panel.getAttribute('aria-labelledby')).toBe(`tp-ui-range-from-${ID}`);
    expect(panel.querySelector('.tp-ui-header')).not.toBeNull();
    expect(panel.querySelector('.tp-ui-mobile-clock-wrapper')).not.toBeNull();
    expect(panel.querySelector('.tp-ui-range-header')).toBeNull();
    expect(panel.querySelector('.tp-ui-footer')).toBeNull();
    expect(dom.querySelector('.tp-ui-range-header')).not.toBeNull();
  });

  it('also wraps the timezone selector when the timezone plugin is on', () => {
    const dom = render({ range: { enabled: true }, timezone: { enabled: true } }, ['range', 'timezone']);
    const panel = dom.querySelector('.tp-ui-range-panel') as HTMLElement;

    expect(panel.querySelector('.tp-ui-timezone')).not.toBeNull();
  });

  it('renders no panel when range is not enabled', () => {
    expect(render({}, ['range']).querySelector('.tp-ui-range-panel')).toBeNull();
  });

  it('renders no panel without the range plugin', () => {
    const dom = render(rangeOptions, []);

    expect(dom.querySelector('.tp-ui-range-panel')).toBeNull();
    expect(dom.querySelector('.tp-ui-range-header')).toBeNull();
    expect(dom.querySelector('.tp-ui-header')).not.toBeNull();
  });
});
