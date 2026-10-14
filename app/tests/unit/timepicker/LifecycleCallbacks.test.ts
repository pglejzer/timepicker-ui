import TimepickerUI from '@/timepicker/TimepickerUI';
import { CoreState } from '@/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { mergeOptions } from '@/utils/options/defaults';
import { WheelPlugin } from '@/plugins/wheel';
import { RangePlugin } from '@/plugins/range';
import { TimezonePlugin } from '@/plugins/timezone';
import type { Plugin } from '@/core/PluginRegistry';
import type { TimepickerOptions } from '@/types/options';

type Registry = (typeof import('@/core/PluginRegistry'))['PluginRegistry'];
type EmitMissingPluginErrors = (typeof import('@/timepicker/LifecycleCallbacks'))['emitMissingPluginErrors'];

interface GateScenario {
  feature: string;
  plugin: Plugin;
  pluginName: string;
  on: TimepickerOptions;
  off: TimepickerOptions;
}

const missingMessage = (pluginName: string): string =>
  `${pluginName} is not registered. Import and register it: PluginRegistry.register(${pluginName})`;

const GATES: GateScenario[] = [
  {
    feature: 'wheel mode',
    plugin: WheelPlugin,
    pluginName: 'WheelPlugin',
    on: { ui: { mode: 'wheel' } },
    off: { ui: { mode: 'clock' } },
  },
  {
    feature: 'compact-wheel mode',
    plugin: WheelPlugin,
    pluginName: 'WheelPlugin',
    on: { ui: { mode: 'compact-wheel' } },
    off: { ui: { mode: 'clock' } },
  },
  {
    feature: 'range',
    plugin: RangePlugin,
    pluginName: 'RangePlugin',
    on: { range: { enabled: true } },
    off: { range: { enabled: false } },
  },
  {
    feature: 'timezone',
    plugin: TimezonePlugin,
    pluginName: 'TimezonePlugin',
    on: { timezone: { enabled: true } },
    off: { timezone: { enabled: false } },
  },
];

describe('emitMissingPluginErrors', () => {
  let registry: Registry;
  let emitMissingPluginErrors: EmitMissingPluginErrors;

  const run = (options: TimepickerOptions): jest.Mock => {
    const element = document.createElement('div');
    const core = new CoreState(element, mergeOptions(options), 'missing-plugin-test');
    const emitter = new EventEmitter<TimepickerEventMap>();
    const onError = jest.fn();
    emitter.on('error', onError);
    emitMissingPluginErrors(core, emitter);
    return onError;
  };

  beforeEach(() => {
    jest.isolateModules(() => {
      registry = require('@/core/PluginRegistry').PluginRegistry;
      emitMissingPluginErrors = require('@/timepicker/LifecycleCallbacks').emitMissingPluginErrors;
    });
  });

  it.each(GATES)(
    'emits the exact $pluginName message when $feature is on and the plugin is missing',
    (gate) => {
      const onError = run(gate.on);

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith({ error: missingMessage(gate.pluginName) });
    },
  );

  it.each(GATES)('emits no error when $feature is on and $pluginName is registered', (gate) => {
    registry.register(gate.plugin);

    expect(run(gate.on)).not.toHaveBeenCalled();
  });

  it.each(GATES)('emits no error when $feature is off and $pluginName is missing', (gate) => {
    expect(run(gate.off)).not.toHaveBeenCalled();
  });

  it('emits one message per missing plugin, in wheel, range, timezone order', () => {
    const onError = run({ ui: { mode: 'wheel' }, range: { enabled: true }, timezone: { enabled: true } });

    expect(onError.mock.calls.map(([payload]) => payload.error)).toEqual([
      missingMessage('WheelPlugin'),
      missingMessage('RangePlugin'),
      missingMessage('TimezonePlugin'),
    ]);
  });

  it('reports only the plugins that are still missing', () => {
    registry.register(RangePlugin);

    const onError = run({ range: { enabled: true }, timezone: { enabled: true } });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith({ error: missingMessage('TimezonePlugin') });
  });
});

describe('missing plugin error on open', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('reports a missing TimezonePlugin to on("error") and callbacks.onError when opened', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    const onError = jest.fn();
    const listener = jest.fn();
    const picker = new TimepickerUI(input, {
      ui: { animation: false },
      timezone: { enabled: true },
      callbacks: { onError },
    });
    picker.on('error', listener);
    picker.create();

    picker.open();

    const expected = { error: missingMessage('TimezonePlugin') };
    expect(listener).toHaveBeenCalledWith(expected);
    expect(onError).toHaveBeenCalledWith(expected);
  });
});
