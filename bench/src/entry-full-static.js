import { TimepickerUI, PluginRegistry } from "timepicker-ui";
import { RangePlugin } from "timepicker-ui/plugins/range";
import { TimezonePlugin } from "timepicker-ui/plugins/timezone";

PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);

const picker = new TimepickerUI(document.querySelector("input"), {
  enableSwitchIcon: true,
  theme: "crane",
  plugins: {
    range: { enabled: true },
    timezone: { enabled: true, timezone: "UTC" },
  },
});

picker.open();

console.log("Core + all plugins loaded");
