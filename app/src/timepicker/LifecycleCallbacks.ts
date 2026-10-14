import type { CoreState } from './CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import type { TimepickerOptions } from '../types/options';
import { PluginRegistry } from '../core/PluginRegistry';
import { isWheelMode } from '../utils/options/predicates';

export const CALLBACK_BRIDGE: ReadonlyArray<
  [keyof Required<TimepickerOptions>['callbacks'], keyof TimepickerEventMap]
> = [
  ['onOpen', 'open'],
  ['onShow', 'show'],
  ['onCancel', 'cancel'],
  ['onConfirm', 'confirm'],
  ['onUpdate', 'update'],
  ['onSelectHour', 'select:hour'],
  ['onSelectMinute', 'select:minute'],
  ['onSelectSecond', 'select:second'],
  ['onSelectAM', 'select:am'],
  ['onSelectPM', 'select:pm'],
  ['onSelectPeriod', 'select:period'],
  ['onSwitchView', 'switch:view'],
  ['onSwitchFace', 'switch:face'],
  ['onError', 'error'],
  ['onTimezoneChange', 'timezone:change'],
  ['onRangeConfirm', 'range:confirm'],
  ['onRangeSwitch', 'range:switch'],
  ['onRangeValidation', 'range:validation'],
  ['onWheelScrollStart', 'wheel:scroll:start'],
  ['onWheelScrollEnd', 'wheel:scroll:end'],
  ['onClear', 'clear'],
];

export const PLUGIN_GATES: ReadonlyArray<{
  needed: (opts: Required<TimepickerOptions>) => boolean;
  name: string;
  plugin: string;
}> = [
  { needed: isWheelMode, name: 'wheel', plugin: 'WheelPlugin' },
  { needed: (o) => !!o.range?.enabled, name: 'range', plugin: 'RangePlugin' },
  { needed: (o) => !!o.timezone?.enabled, name: 'timezone', plugin: 'TimezonePlugin' },
];

export function setupCallbackBridge(core: CoreState, emitter: EventEmitter<TimepickerEventMap>): void {
  for (const [callbackName, eventName] of CALLBACK_BRIDGE) {
    emitter.on(eventName, (data: unknown) => {
      const callback = core.options.callbacks[callbackName];
      if (typeof callback === 'function') {
        (callback as (payload: unknown) => void)(data);
      }
    });
  }
}

export function emitMissingPluginErrors(core: CoreState, emitter: EventEmitter<TimepickerEventMap>): void {
  for (const gate of PLUGIN_GATES) {
    if (gate.needed(core.options) && !PluginRegistry.has(gate.name)) {
      emitter.emit('error', {
        error: `${gate.plugin} is not registered. Import and register it: PluginRegistry.register(${gate.plugin})`,
      });
    }
  }
}
