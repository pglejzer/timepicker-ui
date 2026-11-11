import { TimezoneManager } from '../managers/plugins/timezone';
import type { Plugin } from '../core/PluginRegistry';

export const TimezonePlugin: Plugin = {
  name: 'timezone',
  factory: (core, emitter) => new TimezoneManager(core, emitter),
};

export { TimezoneManager };
export { getTimezoneList, DEFAULT_TIMEZONES, type TimezoneInfo } from '../utils/timezone';
