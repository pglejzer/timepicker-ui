import { optionTypes } from './types';

const options: optionTypes = {
  amLabel: 'AM',
  animation: true,
  appendModalSelector: '',
  backdrop: true,
  cancelLabel: 'CANCEL',
  editable: false,
  enableScrollbar: false,
  enableSwitchIcon: false,
  enterTimeLabel: 'Enter Time',
  focusInputAfterCloseModal: false,
  hourMobileLabel: 'Hour',
  iconTemplate: '<i class="material-icons timepicker-ui-keyboard-icon">keyboard</i>',
  iconTemplateMobile: '<i class="material-icons timepicker-ui-keyboard-icon">schedule</i>',
  incrementHours: 1,
  incrementMinutes: 1,
  minuteMobileLabel: 'Minute',
  mobile: false,
  okLabel: 'OK',
  pmLabel: 'PM',
  selectTimeLabel: 'Select Time',
  switchToMinutesAfterSelectHour: false,
  theme: 'basic',
  preventDefault: true,
};

export { options };
