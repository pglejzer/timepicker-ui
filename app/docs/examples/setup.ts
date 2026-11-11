import { TimepickerUI, PluginRegistry } from '../../src/index';
import { RangePlugin } from '../../src/plugins/range';
import { TimezonePlugin } from '../../src/plugins/timezone';
import { WheelPlugin } from '../../src/plugins/wheel';

PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);
PluginRegistry.register(WheelPlugin);

export { TimepickerUI };

console.log(
  `%c
████████╗██╗███╗   ███╗███████╗██████╗ ██╗ ██████╗██╗  ██╗███████╗██████╗
╚══██╔══╝██║████╗ ████║██╔════╝██╔══██╗██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗
   ██║   ██║██╔████╔██║█████╗  ██████╔╝██║██║     █████╔╝ █████╗  ██████╔╝
   ██║   ██║██║╚██╔╝██║██╔══╝  ██╔═══╝ ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
   ██║   ██║██║ ╚═╝ ██║███████╗██║     ██║╚██████╗██║  ██╗███████╗██║  ██║
   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                    T I M E P I C K E R - U I                  

Because native <input type="time"> is illegal.
Shh... it just wraps <input>. But damn it looks good.
github.com/pglejzer/timepicker-ui
`,
  'color: #00BCD4; font-weight: bold; font-family: monospace; font-size: 11px;',
);
