import { WheelManager } from '../managers/plugins/wheel';
import type { Plugin } from '../core/PluginRegistry';

export const WheelPlugin: Plugin = {
  name: 'wheel',
  factory: (core, emitter) => new WheelManager(core, emitter),
};

export { WheelManager };

