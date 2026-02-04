import { TimepickerUI, PluginRegistry } from "timepicker-ui";

const picker = new TimepickerUI(document.querySelector("input"), {
  enableSwitchIcon: true,
  theme: "crane",
});

picker.open();

async function loadPlugins() {
  const { RangePlugin } = await import("./plugins/range.js");
  const { TimezonePlugin } = await import("./plugins/timezone.js");

  PluginRegistry.register(RangePlugin);
  PluginRegistry.register(TimezonePlugin);

  console.log("Plugins loaded dynamically");
}

loadPlugins().catch(console.error);

console.log("Core loaded, plugins loading...");
