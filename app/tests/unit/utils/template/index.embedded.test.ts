import { getModalTemplate } from '@/utils/template';
import { mergeOptions } from '@/utils/options/defaults';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import type { TimepickerOptions } from '@/types/options';

PluginRegistry.register(WheelPlugin);

const ID = 'tp-embedded';

const embeddedUi = (ui: NonNullable<TimepickerOptions['ui']> = {}): TimepickerOptions => ({
  ui: { ...ui, inline: { enabled: true, containerId: 'host', embedded: true } },
});

const render = (options: TimepickerOptions): string => getModalTemplate(mergeOptions(options), ID);

const rootOf = (html: string): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = html;
  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) throw new Error('modal root is not rendered');
  document.body.replaceChildren(host);
  return root;
};

const wrapperOf = (root: HTMLElement): HTMLElement => {
  const wrapper = root.querySelector<HTMLElement>('.tp-ui-wrapper');
  if (!wrapper) throw new Error('.tp-ui-wrapper is not rendered');
  return wrapper;
};

describe('modal template for an embedded inline picker', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render a labelled group instead of a modal dialog', () => {
    const root = rootOf(render(embeddedUi()));

    expect(root).toHaveClass('tp-ui-modal');
    expect(root).toHaveAttribute('role', 'group');
    expect(root).not.toHaveAttribute('aria-modal');
    expect(root).not.toHaveAttribute('aria-label');
    expect(root).toHaveAttribute('aria-labelledby', `tp-ui-label-${ID}`);
    expect(document.getElementById(`tp-ui-label-${ID}`)).not.toBeNull();
  });

  it('should keep every other root attribute of the inline markup', () => {
    const embedded = rootOf(render(embeddedUi({ theme: 'dark' })));
    const plain = rootOf(render({ ui: { theme: 'dark', inline: { enabled: true, containerId: 'host' } } }));

    const attributes = (el: HTMLElement): Record<string, string> =>
      Object.fromEntries(
        Array.from(el.attributes)
          .filter(({ name }) => !['role', 'aria-modal'].includes(name))
          .map(({ name, value }) => [name, value]),
      );

    expect(attributes(embedded)).toEqual(attributes(plain));
    expect(plain.querySelectorAll('input[name]').length).toBeGreaterThan(0);
    expect(embedded.querySelectorAll('[name]')).toHaveLength(0);
    plain.querySelectorAll('[name]').forEach((field) => field.removeAttribute('name'));
    wrapperOf(embedded).setAttribute('tabindex', '0');
    expect(embedded.innerHTML).toBe(plain.innerHTML);
  });

  describe('wrapper tab stop', () => {
    const inline = { enabled: true, containerId: 'host' };
    const cases: Array<{ name: string; options: TimepickerOptions; tabindex: string }> = [
      { name: 'an embedded inline picker', options: embeddedUi(), tabindex: '-1' },
      {
        name: 'an embedded compact-wheel picker',
        options: embeddedUi({ mode: 'compact-wheel' }),
        tabindex: '-1',
      },
      { name: 'a plain inline picker', options: { ui: { inline } }, tabindex: '0' },
      {
        name: 'an inline picker with embedded switched off',
        options: { ui: { inline: { ...inline, embedded: false } } },
        tabindex: '0',
      },
      { name: 'a modal picker', options: {}, tabindex: '0' },
      { name: 'a modal compact-wheel picker', options: { ui: { mode: 'compact-wheel' } }, tabindex: '0' },
    ];

    it.each(cases)('should render the wrapper of $name with tabindex $tabindex', ({ options, tabindex }) => {
      expect(wrapperOf(rootOf(render(options)))).toHaveAttribute('tabindex', tabindex);
    });
  });

  describe('compact-wheel without a header', () => {
    it.each([
      ['the default time label', undefined, 'Select time'],
      ['a custom time label', 'Pick a time', 'Pick a time'],
    ])('should name the group with %s', (_name, custom, expected) => {
      const options = embeddedUi({ mode: 'compact-wheel' });
      const root = rootOf(render(custom ? { ...options, labels: { time: custom } } : options));

      expect(root).toHaveAttribute('role', 'group');
      expect(root).not.toHaveAttribute('aria-modal');
      expect(root).not.toHaveAttribute('aria-labelledby');
      expect(root).toHaveAttribute('aria-label', expected);
      expect(root.querySelector('.tp-ui-select-time')).toBeNull();
    });

    it('should match labels.time from the merged options', () => {
      const merged = mergeOptions(embeddedUi({ mode: 'compact-wheel' }));
      const root = rootOf(getModalTemplate(merged, ID));

      expect(root.getAttribute('aria-label')).toBe(merged.labels.time);
    });

    it.each<[string, TimepickerOptions]>([
      ['a modal', { ui: { mode: 'compact-wheel' } }],
      ['an inline', { ui: { mode: 'compact-wheel', inline: { enabled: true, containerId: 'host' } } }],
      ['a popover', { ui: { mode: 'compact-wheel' }, wheel: { placement: 'auto' } }],
    ])('should name %s compact-wheel dialog with labels.time', (_name, options) => {
      const root = rootOf(render(options));

      expect(root).toHaveAttribute('role', 'dialog');
      expect(root).toHaveAttribute('aria-label', 'Select time');
      expect(root).not.toHaveAttribute('aria-labelledby');
    });

    it('should keep a wheel dialog labelled by its header', () => {
      const root = rootOf(render({ ui: { mode: 'wheel' } }));
      const labelledBy = root.getAttribute('aria-labelledby');

      expect(labelledBy).not.toBeNull();
      expect(document.getElementById(labelledBy ?? '')).not.toBeNull();
    });
  });

  describe('time field names', () => {
    const inline = { enabled: true, containerId: 'host' };
    const namesIn = (options: TimepickerOptions): string[] =>
      Array.from(rootOf(render(options)).querySelectorAll('input[name]')).map(
        (input) => input.getAttribute('name') ?? '',
      );

    it('should render no [name] inside an embedded card', () => {
      const root = rootOf(render(embeddedUi({ mode: 'clock' })));

      expect(root.querySelectorAll('[name]')).toHaveLength(0);
      expect(root.querySelectorAll('.tp-ui-hour, .tp-ui-minutes')).toHaveLength(2);
    });

    it('should render no [name] on the seconds field of an embedded card', () => {
      const root = rootOf(render({ ...embeddedUi(), clock: { showSeconds: true } }));

      expect(root.querySelector('.tp-ui-seconds')).not.toBeNull();
      expect(root.querySelectorAll('[name]')).toHaveLength(0);
    });

    it.each([
      ['plain inline', { ui: { inline } }],
      ['modal', {}],
    ] as Array<[string, TimepickerOptions]>)('should keep the names in a %s picker', (_name, options) => {
      expect(namesIn({ ...options, clock: { showSeconds: true } })).toEqual(['hour', 'minutes', 'seconds']);
    });
  });

  describe('ui.inline.showTitle', () => {
    it('should keep the title element and the dialog name when the title is hidden', () => {
      const root = rootOf(
        render({ ui: { inline: { enabled: true, containerId: 'host', embedded: true, showTitle: false } } }),
      );

      expect(root.querySelector('.tp-ui-select-time')).not.toBeNull();
      expect(root).toHaveAttribute('aria-labelledby', `tp-ui-label-${ID}`);
      expect(document.getElementById(`tp-ui-label-${ID}`)).not.toBeNull();
    });
  });

  it('should render the normal modal markup when inline is not enabled', () => {
    const unset = render({});
    const withEmbeddedOnly = render({ ui: { inline: { enabled: false, embedded: true } } });

    expect(withEmbeddedOnly).toBe(unset);
    expect(rootOf(withEmbeddedOnly)).toHaveAttribute('role', 'dialog');
  });

  it('should render markup identical to an unset embedded option when it is false', () => {
    const inline = { enabled: true, containerId: 'host' };

    expect(render({ ui: { inline: { ...inline, embedded: false } } })).toBe(render({ ui: { inline } }));
    expect(render({ ui: { mode: 'compact-wheel', inline: { ...inline, embedded: false } } })).toBe(
      render({ ui: { mode: 'compact-wheel', inline } }),
    );
  });
});
