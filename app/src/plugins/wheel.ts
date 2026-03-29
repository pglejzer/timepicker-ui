import { WheelManager } from '../managers/plugins/wheel';
import { getWheelTemplate } from '../utils/template/wheel';
import type { Plugin } from '../core/PluginRegistry';

export const WheelPlugin: Plugin = {
  name: 'wheel',
  factory: (core, emitter) => new WheelManager(core, emitter),
  templateProvider: (options, instanceId) => {
    const isCompactWheel = options.ui.mode === 'compact-wheel';
    const includeAmPmColumn = isCompactWheel && options.clock.type === '12h';
    return getWheelTemplate(
      options.clock.type as '12h' | '24h',
      options.clock.incrementMinutes ?? 1,
      includeAmPmColumn,
      instanceId,
    );
  },
};

export { WheelManager };
