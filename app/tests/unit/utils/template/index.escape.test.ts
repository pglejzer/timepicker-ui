import { getModalTemplate } from '../../../../src/utils/template';
import { getWheelTemplate } from '../../../../src/utils/template/wheel';
import { mergeOptions } from '../../../../src/utils/options/defaults';
import { escapeHtml } from '../../../../src/utils/template/escape';
import { PluginRegistry } from '../../../../src/core/PluginRegistry';
import { RangePlugin } from '../../../../src/plugins/range';
import { TimezonePlugin } from '../../../../src/plugins/timezone';

const PAYLOAD = '<img src=x onerror="window.__xss=1">';

describe('labels are rendered as text, never as markup (bug #15)', () => {
  beforeAll(() => {
    PluginRegistry.register(RangePlugin);
    PluginRegistry.register(TimezonePlugin);
  });

  it('escapeHtml neutralizes markup characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });

  it('modal template injects no element from any label', () => {
    const labels = Object.fromEntries(Object.keys(mergeOptions({}).labels).map((key) => [key, PAYLOAD]));
    const host = document.createElement('div');
    host.innerHTML = getModalTemplate(
      mergeOptions({
        labels,
        ui: { clearButton: true, enableSwitchIcon: true },
        range: { enabled: true, fromLabel: PAYLOAD, toLabel: PAYLOAD },
        timezone: { enabled: true, label: PAYLOAD },
      }),
      'xss',
    );
    expect(host.querySelector('img')).toBeNull();
    expect(host.querySelector('.tp-ui-ok-btn')?.textContent).toBe(PAYLOAD);
    expect(host.querySelector('.tp-ui-am')?.getAttribute('aria-label')).toBe(PAYLOAD);
  });

  it('wheel template injects no element from labels', () => {
    const host = document.createElement('div');
    host.innerHTML = getWheelTemplate('12h', 1, true, 'xss', {
      hourLabel: PAYLOAD,
      minuteLabel: PAYLOAD,
      periodLabel: PAYLOAD,
      am: PAYLOAD,
      pm: PAYLOAD,
    });
    expect(host.querySelector('img')).toBeNull();
    expect(host.querySelector('.tp-ui-wheel-ampm .tp-ui-wheel-item')?.textContent).toBe(PAYLOAD);
  });

  it('default labels render exactly as before (parity)', () => {
    const html = getModalTemplate(mergeOptions({}), 'p');
    expect(html).toContain('>Select time<');
    expect(html).toContain('aria-label="Hour"');
  });
});
