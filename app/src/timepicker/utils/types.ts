export declare type OptionTypes = {
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
   * @description Set default selector to append timepicker inside it. Timepicker default append to `body`
   * @default ""
   */
  appendModalSelector?: string;
  /**
   * @description Turn on/off backdrop
   * @default true
   */
  backdrop?: boolean;
  /**
   * @description Set custom text to cancel button
   * @default "CANCEL"
   */
  cancelLabel?: string;
  /**
   * @description Edit hour/minutes on the web mode.
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
   * @description Set increment hour by `1`, `2`, `3` hour
   * @default 1
   */
  incrementHours?: number;
  /**
   * @description Set increment minutes by `1`, `5`, `10`, `15` minutes
   * @default 1
   */
  incrementMinutes?: number;
  /**
   * @description set custom text to minute label on mobile version
   * @default "Minute"
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
   * @description Set theme to timepicker. Available options: `basic`, `crane-straight`, `crane-radius`, `m3`.

   * The offical version of Material Design 3 is still not avaialbe for the WEB version.Theme `m3` has been added
   * based on the design what you can find [here](https://m3.material.io/components/time-pickers/overview).
   * If new version M3 will be released this design will get improve.
   * @default "basic"
   */
  theme?: 'basic' | 'crane-straight' | 'crane-radius' | 'm3';
  /**
   * @description Set type of clock, it contains 2 versions: `12h` and `24h`.
   * @default false
   */
  clockType?: '12h' | '24h';
  /**
   * @description - The `hours` and `minutes` are arrays which accept strings and numbers to block select hours/minutes.
   * - The `interval` key allow only string with interval values i.e., if you have 24h clockType the string can be 03:00 - 15:00, 01:20 - 05:15, 02:03 - 06:55 etc.. On the other hand if you have 12h clockType the string can be i.e 01:30 PM - 6:30 PM, 02:00 AM - 10:00 AM, 02:30 AM - 10:30 PM. It is important to remember that first hour in the interval option should be less that the second value if you want to block values from AM to PM and if you are using interval with 24h clockType.
   * - If the interval key is set, the hours/minutes keys are `ignored`.
   * @example
    disabledTime: {
      minutes: [1,2,4,5,55,23,"22","38"],
      hours: [1,"3","5", 8],
      interval: "10:00 AM - 12:00 PM",
    }
   * @default  undefined
   */
  disabledTime?: {
    minutes?: Array<string | number>;
    hours?: Array<string | number>;
    interval?: string;
  };
  /**
   * @description Set current time to the input and timepicker.\
   * If this options is set to `true` it's gonna update picker with toLocaleTimeString() and input with value based on your location.
   * This option also allows to put object with properties.
   * @example
      currentTime: {
        time: new Date(),
        updateInput: true,
        locales: "en-US",
        preventClockType: false
      };
   * @example currentTime: true
   * @default  undefined
   */
  currentTime?:
    | {
        /**
         * The `time` key allows to put any valid date to update picker.
         * @requires
         * If the `updateInput` is set to `false/undefined` and the default value from the input not exist, the `time` key value will be displayed in the picker.
         *
         * If the `updateInput` is set to `false/undefined` but the default value from the input exist, the `time` key will be ignored.
         */
        time?: Date;
        /**
         * The `updateInput` key is set to `true` it's going update input value with set time key.
         */
        updateInput?: boolean;
        /**
         * The `locales` key can change language from `toLocaleTimeString()`.
         */
        locales?: string | string[];
        /**
         * The `preventClockType` key if is set to `true` it's `force` the clockType option to set value "12h" or "24h" based on your location
         * with current time and `locales` key value is ignored.
         */
        preventClockType?: boolean;
      }
    | boolean;

  /**
   * @description Set focus trap to the modal element to all elements with tabindex in the picker
   * @default true
   */
  focusTrap?: boolean;
  /**
   * @description Set delay to clickable elements like button "OK", "CANCEL" etc. The value has to be set in milliseconds.
   * @default 300
   */
  delayHandler?: number;
};
