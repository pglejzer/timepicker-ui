import { RangeManager } from '../managers/plugins/range';
import type { Plugin } from '../core/PluginRegistry';

export const RangePlugin: Plugin = {
  name: 'range',
  factory: (core, emitter) => new RangeManager(core, emitter),
  clearHandler: (core, emitter) => {
    if (!core.options.range?.enabled) return;

    const modal = core.getModalElement();
    if (!modal) return;

    const fromTab = modal.querySelector<HTMLButtonElement>('.tp-ui-range-from');
    const toTab = modal.querySelector<HTMLButtonElement>('.tp-ui-range-to');
    const fromTime = modal.querySelector<HTMLElement>('.tp-ui-range-from-time');
    const toTime = modal.querySelector<HTMLElement>('.tp-ui-range-to-time');

    if (fromTime) fromTime.textContent = '--:--';
    if (toTime) toTime.textContent = '--:--';

    fromTab?.classList.add('active');
    toTab?.classList.remove('active');

    fromTab?.setAttribute('aria-selected', 'true');
    toTab?.setAttribute('aria-selected', 'false');

    fromTab?.setAttribute('tabindex', '0');
    toTab?.setAttribute('tabindex', '-1');

    toTab?.classList.add('disabled');
    toTab?.setAttribute('aria-disabled', 'true');

    const hourInput = core.getHour();
    if (hourInput) {
      hourInput.focus();
    }

    emitter.emit('range:switch', {
      active: 'from',
      disabledTime: null,
    });
  },
};

export { RangeManager };
