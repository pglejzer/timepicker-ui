import TimepickerUI from 'timepicker-ui';

const basic = document.querySelector('.basic');

const basicPicker = new TimepickerUI(basic, { enableScrollbar: true });
basicPicker.create();

const mobiles = document.querySelector('.mobile');
const mobilePicker = new TimepickerUI(mobiles, {
  mobile: true,
});

mobilePicker.create();

const keyboardIcon = document.querySelector('.keyboard-icon-add');
const keyboardIconInit = new TimepickerUI(keyboardIcon, {
  enableSwitchIcon: true,
});

keyboardIconInit.create();

const themeCrane = document.querySelector('.theme-crane-straight');
const themeCraneInit = new TimepickerUI(themeCrane, {
  enableSwitchIcon: true,
  theme: 'crane-straight',
});
themeCraneInit.create();

const themeCraneRadius = document.querySelector('.theme-crane-radius');
const themeCraneRadiusInit = new TimepickerUI(themeCraneRadius, {
  enableSwitchIcon: true,
  theme: 'crane-radius',
});
themeCraneRadiusInit.create();

const acceptEvent = document.querySelector('.accept-event');
const acceptEventInit = new TimepickerUI(acceptEvent, {
  enableSwitchIcon: true,
});
acceptEventInit.create();

const acceptValue = document.querySelector('#accept-value');

acceptEvent.addEventListener(
  'accept',
  ({ detail: { hour, minutes, type } }) => (acceptValue.innerHTML = `${hour}:${minutes} ${type}`)
);

const openByButton = document.querySelector('.open-by-button');

const openByButtonInit = new TimepickerUI(openByButton);

openByButtonInit.create();
