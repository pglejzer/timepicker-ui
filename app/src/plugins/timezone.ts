import { TimezoneManager } from '../managers/plugins/timezone';
import type { Plugin } from '../core/PluginRegistry';

export const TimezonePlugin: Plugin = {
  name: 'timezone',
  factory: (core, emitter) => new TimezoneManager(core, emitter),
  clearHandler: (core) => {
    if (!core.options.timezone?.enabled) return;

    const modal = core.getModalElement();
    if (!modal) return;

    const dropdown = modal.querySelector<HTMLElement>('.tp-ui-timezone-dropdown');
    const selected = modal.querySelector<HTMLElement>('.tp-ui-timezone-selected');

    if (selected) {
      const placeholder = selected.getAttribute('data-placeholder') || 'Timezone...';
      selected.textContent = placeholder;
    }

    dropdown?.setAttribute('aria-expanded', 'false');
  },
};

export { TimezoneManager };
