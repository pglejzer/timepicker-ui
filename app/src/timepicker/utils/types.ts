export declare type optionTypes = {
  /**
   * @description Set custom text to AM label
   * @default "AM"
   */
  amLabel?: string;
  /**
   * @description Turn on/off animations on picker on start/close
   * @default true
   */
  animation?: boolean;
  /**
   * @description Set default selector to append timepicker inside it. Timepicker default append to body
   * @default ""
   */
  appendModalSelector?: string;
  /**
   * @description 	Turn on/off backdrop
   * @default true
   */
  backdrop?: boolean;
  /**
   * @description Set custom text to cancel button
   * @default "CANCEL"
   */
  cancelLabel?: string;
  /**
   * @description Edit hour/minutes on the web mode. You have set option preventDefault to false.
   * @default false
   */
  editable?: boolean;
  /**
   * @description Turn on/off scroll if timepicker is open
   * @default false
   */
  enableScrollbar?: boolean;
  /**
   * @description Turn on/off icon to switch desktop/mobile
   * @default false
   */
  enableSwitchIcon?: boolean;
  /**
   * @description Set custom text to time label on mobile version
   * @default "Enter Time"
   */
  mobileTimeLabel?: string;
  /**
   * @description Turn on/off focus to input after close modal
   * @default false
   */
  focusInputAfterCloseModal?: boolean;
  /**
   * @description Set custom text to hour label on mobile version
   * @default "Hour"
   */
  hourMobileLabel?: string;
  /**
   * @description Set default template to switch desktop.This options is using by default material design icon
   * @default "<i class='material-icons timepicker-ui-keyboard-icon'> keyboard </i>"
   */
  iconTemplate?: string;
  /**
   * @description Set default template to switch mobile. This options is using by default material design icon
   * @default "<i class='material-icons timepicker-ui-keyboard-icon'> schedule </i>"
   */
  iconTemplateMobile?: string;
  /**
   * @description Turn on/off focus to input after close modal
   * @default false
   */
  incrementHours?: number;
  /**
   * @description Set increment hour by 1, 2, 3 hour
   * @default 1
   */
  incrementMinutes?: number;
  /**
   * @description Set increment minutes by 1, 5, 10, 15 minutes
   * @default 1
   */
  minuteMobileLabel?: string;
  /**
   * @description Turn on/off mobile version
   * @default false
   */
  mobile?: boolean;
  /**
   * @description Set custom text to ok label
   * @default "OK"
   */
  okLabel?: string;
  /**
   * @description Set custom text to pm label
   * @default "PM"
   */
  pmLabel?: string;
  /**
   * @description Set on/off defaults events to clock face events
   * @default true
   */
  preventDefault?: boolean;
  /**
   * @description Set custom text to time label on desktop version
   * @default "Select Time"
   */
  timeLabel?: string;
  /**
   * @description Turn on/off switch to minutes by select hour
   * @default true
   */
  switchToMinutesAfterSelectHour?: boolean;
  /**
   * @description Set theme to timepicker. Available options: basic, crane-straight, crane-radius
   * @default "basic"
   */
  theme?: 'basic' | 'crane-straight' | 'crane-radius';
  /**
   * @description Set type of clock, it contains 2 versions: 12h and 24h.
   * @default false
   */
  clockType?: '12h' | '24h';
  /**
   * @description Set disabled time to timepicker. It contains object with minutes, hours and inverval keys.
   * @default  """
   */
  disabledTime?: {
    minutes?: {
      value: Array<string | number>;
    };
    hours?: {
      value: Array<string | number>;
    };
    interval?: string;
  };
};
