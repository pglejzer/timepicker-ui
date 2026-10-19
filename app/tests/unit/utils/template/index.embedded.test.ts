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
    const plain = rootOf(
      render({ ui: { theme: 'dark', inline: { enabled: true, containerId: 'host' } } }),
    );

    const attributes = (el: HTMLElement): Record<string, string> =>
      Object.fromEntries(
        Array.from(el.attributes)
          .filter(({ name }) => !['role', 'aria-modal'].includes(name))
          .map(({ name, value }) => [name, value]),
      );

    expect(attributes(embedded)).toEqual(attributes(plain));
    expect(embedded.innerHTML).toBe(plain.innerHTML);
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
    expect(
      render({ ui: { mode: 'compact-wheel', inline: { ...inline, embedded: false } } }),
    ).toBe(render({ ui: { mode: 'compact-wheel', inline } }));
  });
});
