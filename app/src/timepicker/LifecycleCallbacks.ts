import type { CoreState } from './CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import type { TimepickerOptions } from '../types/options';
import { PluginRegistry } from '../core/PluginRegistry';

export const CALLBACK_BRIDGE: ReadonlyArray<
  [keyof Required<TimepickerOptions>['callbacks'], keyof TimepickerEventMap]
> = [
  ['onOpen', 'open'],
  ['onCancel', 'cancel'],
  ['onConfirm', 'confirm'],
  ['onUpdate', 'update'],
  ['onSelectHour', 'select:hour'],
  ['onSelectMinute', 'select:minute'],
  ['onSelectAM', 'select:am'],
  ['onSelectPM', 'select:pm'],
  ['onError', 'error'],
  ['onTimezoneChange', 'timezone:change'],
  ['onRangeConfirm', 'range:confirm'],
  ['onRangeSwitch', 'range:switch'],
  ['onRangeValidation', 'range:validation'],
  ['onClear', 'clear'],
];

export const PLUGIN_GATES: ReadonlyArray<{
  needed: (opts: Required<TimepickerOptions>) => boolean;
  name: string;
  message: string;
}> = [
  {
    needed: (o) => o.ui.mode === 'wheel' || o.ui.mode === 'compact-wheel',
    name: 'wheel',
    message: 'WheelPlugin is not registered. Import and register it: PluginRegistry.register(WheelPlugin)',
  },
  {
    needed: (o) => !!o.range?.enabled,
    name: 'range',
    message: 'RangePlugin is not registered. Import and register it: PluginRegistry.register(RangePlugin)',
  },
  {
    needed: (o) => !!o.timezone?.enabled,
    name: 'timezone',
    message:
      'TimezonePlugin is not registered. Import and register it: PluginRegistry.register(TimezonePlugin)',
  },
];

export function setupCallbackBridge(core: CoreState, emitter: EventEmitter<TimepickerEventMap>): void {
  const { callbacks } = core.options;
  for (const [cbName, eventName] of CALLBACK_BRIDGE) {
    const cb = callbacks[cbName];
    if (cb) {
      emitter.on(eventName, cb as (data: unknown) => void);
    }
  }
}

export function emitMissingPluginErrors(core: CoreState, emitter: EventEmitter<TimepickerEventMap>): void {
  for (const gate of PLUGIN_GATES) {
    if (gate.needed(core.options) && !PluginRegistry.has(gate.name)) {
      emitter.emit('error', { error: gate.message });
    }
  }
}
