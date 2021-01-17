declare type optionTypes = {
  amLabel?: string;
  appendModalSelector?: HTMLAllCollection | string | Element;
  backdrop?: boolean;
  cancelLabel?: string;
  enableScrollbar?: boolean;
  hourMobileLabel?: string;
  enterTimeLabel?: string;
  incrementHours?: number;
  incrementMinutes?: number;
  inputTemplate?: string;
  minuteMobileLabel?: string;
  mobile?: boolean;
  okLabel?: string;
  pmLabel?: string;
  selectTimeLabel?: string;
  switchToMinutesAfterSelectHour?: boolean;
  iconTemplate?: string;
  iconTemplateMobile?: string;
  theme?: 'basic' | 'crane-straight' | 'crane-radius';
  enableSwitchIcon?: boolean;
  focusInputAfterCloseModal?: boolean;
};

export { optionTypes };
