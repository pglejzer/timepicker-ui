import { getModalTemplate } from '../../../../src/utils/template';
import { mergeOptions } from '../../../../src/utils/options/defaults';
import { PluginRegistry } from '../../../../src/core/PluginRegistry';
import { WheelPlugin } from '../../../../src/plugins/wheel';
import { RangePlugin } from '../../../../src/plugins/range';
import { TimezonePlugin } from '../../../../src/plugins/timezone';
import type { TimepickerOptions } from '../../../../src/types/options';

PluginRegistry.register(WheelPlugin);
PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);

const CASES: Array<[string, TimepickerOptions]> = [
  ['clock 12h', {}],
  ['clock 24h', { clock: { type: '24h' } }],
  ['mobile 12h', { ui: { mobile: true } }],
  [
    'editable 24h + clear + switch icon',
    { clock: { type: '24h' }, ui: { editable: true, clearButton: true, enableSwitchIcon: true } },
  ],
  ['wheel 12h step 5', { ui: { mode: 'wheel' }, clock: { incrementMinutes: 5 } }],
  ['compact-wheel 12h', { ui: { mode: 'compact-wheel' } }],
  ['compact-wheel 24h', { ui: { mode: 'compact-wheel' }, clock: { type: '24h' } }],
  ['range 12h', { range: { enabled: true } }],
  ['timezone 24h', { clock: { type: '24h' }, timezone: { enabled: true } }],
];

describe('modal template without seconds', () => {
  it.each(CASES)('%s', (_name, options) => {
    expect(getModalTemplate(mergeOptions(options), 'tp-test')).toMatchSnapshot();
  });
});
