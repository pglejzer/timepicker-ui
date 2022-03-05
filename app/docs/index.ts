import { TimepickerUI } from 'timepicker-ui';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css';
import '../node_modules/prismjs/plugins/line-highlight/prism-line-highlight.css';

Prism.highlightAll();

const basic = document.querySelector('.basic') as HTMLDivElement;

const basicPicker = new TimepickerUI(basic, { enableScrollbar: true });
basicPicker.create();

const mobiles = document.querySelector('.mobile') as HTMLDivElement;

const mobilePicker = new TimepickerUI(mobiles, {
  mobile: true,
});

mobilePicker.create();

const keyboardIcon = document.querySelector('.keyboard-icon-add') as HTMLDivElement;
const keyboardIconInit = new TimepickerUI(keyboardIcon, {
  enableSwitchIcon: true,
});

keyboardIconInit.create();

const themeCrane = document.querySelector('.theme-crane-straight') as HTMLDivElement;
const themeCraneInit = new TimepickerUI(themeCrane, {
  enableSwitchIcon: true,
  theme: 'crane-straight',
});
themeCraneInit.create();

const themeCraneRadius = document.querySelector('.theme-crane-radius') as HTMLDivElement;
const themeCraneRadiusInit = new TimepickerUI(themeCraneRadius, {
  enableSwitchIcon: true,
  theme: 'crane-radius',
});
themeCraneRadiusInit.create();

const acceptEvent = document.querySelector('.accept-event') as HTMLDivElement;
const acceptEventInit = new TimepickerUI(acceptEvent, {
  enableSwitchIcon: true,
});
acceptEventInit.create();

const acceptValue = document.querySelector('#accept-value') as HTMLDivElement;

acceptEvent.addEventListener(
  'accept',
  // @ts-ignore
  ({ detail: { hour, minutes, type } }) => (acceptValue.innerHTML = `${hour}:${minutes} ${type}`)
);

const errorValueDiv = document.querySelector('#error-value') as HTMLDivElement;

const openByButton = document.querySelector('.open-by-button') as HTMLDivElement;

const openByButtonInit = new TimepickerUI(openByButton, {
  clockType: '12h',
  editable: true,
  focusInputAfterCloseModal: true,
});

openByButtonInit.create();

openByButton.addEventListener('geterror', (e) => {
  console.log(e);

  // @ts-ignore
  errorValueDiv.innerHTML = `Error: ${e.detail.error}`;
});

openByButton.addEventListener('update', (e) => {
  console.log(e);
});

const test = document.querySelector('.test') as HTMLDivElement;

const testPicker = new TimepickerUI(test, { enableScrollbar: true, clockType: '24h' });
testPicker.create();

const mobiles24 = document.querySelector('.mobile-24') as HTMLDivElement;

const mobilePicker24 = new TimepickerUI(mobiles24, {
  mobile: true,
  clockType: '24h',
});

mobilePicker24.create();
