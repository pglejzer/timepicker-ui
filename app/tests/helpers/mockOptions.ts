import type { OptionTypes } from '../../src/types/types';

export const mockOptions: OptionTypes = {
  amLabel: 'AM',
  pmLabel: 'PM',
  cancelLabel: 'Cancel',
  okLabel: 'OK',
  enableSwitchIcon: false,
  animation: true,
  backdrop: true,
  clockType: '12h',
  editable: false,
  enableScrollbar: false,
  focusInputAfterCloseModal: false,
  focusTrap: true,
  incrementHours: 1,
  incrementMinutes: 1,
  mobile: false,
  autoSwitchToMinutes: true,
  theme: 'basic',
  timeLabel: 'Select time',
  iconTemplate: '',
  iconTemplateMobile: '',
  mobileTimeLabel: 'Enter Time',
  hourMobileLabel: 'Hour',
  minuteMobileLabel: 'Minute',
  delayHandler: 300,
};

export const mock24hOptions: OptionTypes = {
  ...mockOptions,
  clockType: '24h',
};

export const mockInlineOptions: OptionTypes = {
  ...mockOptions,
  inline: {
    enabled: true,
    containerId: 'inline-container',
    showButtons: false,
    autoUpdate: true,
  },
};

export const mockMobileOptions: OptionTypes = {
  ...mockOptions,
  mobile: true,
};

export const mockDisabledTimeOptions: OptionTypes = {
  ...mockOptions,
  disabledTime: {
    hours: [1, 2, 3],
    minutes: [15, 30, 45],
  },
};

export const mockIntervalDisabledOptions: OptionTypes = {
  ...mockOptions,
  disabledTime: {
    interval: '10:00 AM - 12:00 PM',
  },
};
