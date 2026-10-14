import { WheelManager } from '../managers/plugins/wheel';
import { getWheelTemplate } from '../utils/template/wheel';
import type { Plugin } from '../core/PluginRegistry';

export const WheelPlugin: Plugin = {
  name: 'wheel',
  factory: (core, emitter) => new WheelManager(core, emitter),
  templateProvider: (options, instanceId) => {
    const { clock, labels } = options;
    const isCompactWheel = options.ui.mode === 'compact-wheel';
    const includeAmPmColumn = isCompactWheel && clock.type === '12h';
    return getWheelTemplate(
      clock.type as '12h' | '24h',
      clock.incrementMinutes ?? 1,
      includeAmPmColumn,
      instanceId,
      labels,
      { show: !!clock.showSeconds, increment: clock.incrementSeconds ?? 1 },
      clock.incrementHours ?? 1,
    );
  },
};

export { WheelManager };
