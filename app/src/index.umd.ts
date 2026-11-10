import TimepickerUI from './timepicker';
import { PluginRegistry } from './core/PluginRegistry';

const TimepickerUIGlobal: typeof TimepickerUI & { PluginRegistry: typeof PluginRegistry } = Object.assign(
  TimepickerUI,
  { PluginRegistry },
);

export default TimepickerUIGlobal;
