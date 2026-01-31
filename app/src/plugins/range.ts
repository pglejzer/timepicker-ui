import { RangeManager } from '../managers/plugins/range';
import type { Plugin } from '../core/PluginRegistry';

export const RangePlugin: Plugin = {
  name: 'range',
  factory: (core, emitter) => new RangeManager(core, emitter),
};

export { RangeManager };

