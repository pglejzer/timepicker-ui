// eslint-disable-next-line import/no-unresolved
import { TimepickerUI } from 'timepicker-ui';

const basic = document.querySelector('.timepicker-ui-basic');

const newPicker = new TimepickerUI(basic, {});

newPicker.create();
