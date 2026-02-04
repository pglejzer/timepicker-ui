import {
  TimepickerUI,
  EventEmitter, // imported but not used
  PluginRegistry, // imported but not used
} from "timepicker-ui";

const picker = new TimepickerUI(document.querySelector("input"), {
  enableSwitchIcon: true,
});

picker.open();

console.log("Selective import - unused should be tree-shaken");
