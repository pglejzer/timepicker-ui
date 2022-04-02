/* eslint-disable import/no-extraneous-dependencies */

import { TimepickerUI } from 'timepicker-ui';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

Prism.highlightAll();

// let basic = document.querySelector('.basic') as HTMLDivElement;

// const basicPicker = new TimepickerUI(basic, {
//   disabledTime: {
//     minutes: {
//       value: ['12', 5, '10', '3', '13', 44, '55', 33],
//     },
//     hours: {
//       value: [1, 9, '3', 4, 5, '12'],
//     },
//     interval: '6:00 AM - 10:00 PM',
//   },
// });

// basicPicker.create();

const currentDate = new Date();
currentDate.setMinutes(0);

const test = document.querySelector('.test') as HTMLDivElement;
const testPicker = new TimepickerUI(test, {
  currentTime: {
    time: currentDate,
    preventClockType: true,
  },
  focusTrap: true,
});

// const inputElement = test.querySelector('input') as HTMLInputElement;

// inputElement.value = new Date().toLocaleTimeString('en-us', { timeStyle: 'short' });

testPicker.create();

const test1 = document.querySelector('.test1') as HTMLDivElement;

// good
const testPicker1 = new TimepickerUI(test1, {
  currentTime: {
    time: new Date(),
    updateInput: true,
  },
});
testPicker1.create();

const test2 = document.querySelector('.test2') as HTMLDivElement;

// good
const testPicker2 = new TimepickerUI(test2, {
  currentTime: true,
});
testPicker2.create();

const test3 = document.querySelector('.test3') as HTMLDivElement;
// goood
const testPicker3 = new TimepickerUI(test3, {
  enableScrollbar: true,
  clockType: '24h',
  disabledTime: {
    minutes: [1, 2, 4, 55, '25'],
  },
});
testPicker3.create();

const test4 = document.querySelector('.test4') as HTMLDivElement;
// goood
const testPicker4 = new TimepickerUI(test4, {
  enableScrollbar: true,
  clockType: '24h',
  disabledTime: {
    interval: '5:30 - 21:30',
  },
});
testPicker4.create();

const test20 = document.querySelector('.test20') as HTMLDivElement;
// good
const testPicker20 = new TimepickerUI(test20, {
  disabledTime: {
    interval: '5:30 AM - 10:30 AM',
  },
});
testPicker20.create();

const test21 = document.querySelector('.test21') as HTMLDivElement;

// good
const testPicker21 = new TimepickerUI(test21, {
  disabledTime: {
    interval: '5:30 PM - 10:30 PM',
  },
});
testPicker21.create();

const test22 = document.querySelector('.test22') as HTMLDivElement;

// good

const testPicker22 = new TimepickerUI(test22, {
  disabledTime: {
    interval: '4:00 PM - 11:00 PM',
  },
});
testPicker22.create();

/// ///////////////////////////////////

const test23 = document.querySelector('.test23') as HTMLDivElement;
// good
const testPicker23 = new TimepickerUI(test23, {
  enableScrollbar: true,

  disabledTime: {
    interval: '4:00 AM - 5:00 PM',
  },
});
testPicker23.create();

const test24 = document.querySelector('.test24') as HTMLDivElement;

const testPicker24 = new TimepickerUI(test24, {
  enableScrollbar: true,

  disabledTime: {
    interval: '4:30 AM - 5:30 PM',
  },
});
testPicker24.create();

const test25 = document.querySelector('.test25') as HTMLDivElement;

const testPicker25 = new TimepickerUI(test25, {
  enableScrollbar: true,

  disabledTime: {
    interval: '4:00 AM - 5:50 PM',
  },
});
testPicker25.create();

const test26 = document.querySelector('.test26') as HTMLDivElement;

const testPicker26 = new TimepickerUI(test26, {
  enableScrollbar: true,

  disabledTime: {
    interval: '4:25 AM - 4:55 PM',
  },
});
testPicker26.create();

const test27 = document.querySelector('.test27') as HTMLDivElement;

const testPicker27 = new TimepickerUI(test27, {
  enableScrollbar: true,

  disabledTime: {
    interval: '4:25 AM - 4:00 PM',
  },
});
testPicker27.create();

// const arr: OptionTypes[] = [
//   { mobile: true, backdrop: true, amLabel: 'Test' },
//   { mobile: false, amLabel: 'Not Test', pmLabel: 'test' },
//   { mobile: false, backdrop: false, pmLabel: 'OMG' },
// ];

// document.querySelector('#test-button')?.addEventListener('click', () => {
//   basicPicker.destroy(() => {
//     console.log('destroyed');
//   });

//   const randomIndex = Math.floor(Math.random() * arr.length);

//   basicPicker.update({
//     options: arr[randomIndex],
//     create: true,
//   });

//   basicPicker.close(true, () => {
//     console.log('lo');
//   });
// });

const mobiles = document.querySelector('.mobile') as HTMLDivElement;

const mobilePicker = new TimepickerUI(mobiles, {
  mobile: true,
});

mobilePicker.create();

const keyboardIcon = document.querySelector('.keyboard-icon-add') as HTMLDivElement;
const keyboardIconInit = new TimepickerUI(keyboardIcon, {
  enableSwitchIcon: true,
  focusTrap: true,
});

keyboardIconInit.create();

const themeCrane = document.querySelector('.theme-crane-straight') as HTMLDivElement;
const themeCraneInit = new TimepickerUI(themeCrane, {
  enableSwitchIcon: true,
  theme: 'crane-straight',
  focusTrap: true,
});
themeCraneInit.create();

const themeCraneRadius = document.querySelector('.theme-crane-radius') as HTMLDivElement;
const themeCraneRadiusInit = new TimepickerUI(themeCraneRadius, {
  enableSwitchIcon: true,
  theme: 'crane-radius',
  focusTrap: true,
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
  // eslint-disable-next-line no-return-assign
  ({ detail: { hour, minutes, type } }) => (acceptValue.innerHTML = `${hour}:${minutes} ${type}`),
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

const mobiles24 = document.querySelector('.mobile-24') as HTMLDivElement;

const mobilePicker24 = new TimepickerUI(mobiles24, {
  mobile: true,
  clockType: '24h',
});

mobilePicker24.create();
