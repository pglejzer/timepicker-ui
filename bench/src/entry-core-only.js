import { TimepickerUI } from "timepicker-ui";

const picker = new TimepickerUI(document.querySelector("input"), {
  enableSwitchIcon: true,
  theme: "crane",
});

picker.open();

console.log("Core only loaded");
