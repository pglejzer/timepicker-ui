import { initCallback } from '../utils/config';
import type { OptionTypes } from '../types/types';
import { sanitizeTimeInput } from '../utils/validation';
import TimepickerLifecycle from './TimepickerLifecycle';

type TypeFunction = () => void;

export default class TimepickerAPI extends TimepickerLifecycle {
  public getValue = (): {
    hour: string;
    minutes: string;
    type?: string;
    time: string;
    degreesHours: number | null;
    degreesMinutes: number | null;
  } => {
    if (this._isDestroyed) {
      return {
        hour: '',
        minutes: '',
        type: undefined,
        time: '',
        degreesHours: null,
        degreesMinutes: null,
      };
    }

    const currentHour = this.hour?.value || '12';
    const currentMinutes = this.minutes?.value || '00';
    const currentType =
      this._options.clockType === '24h' ? undefined : this.activeTypeMode?.textContent || 'AM';

    let timeString = '';
    if (this._options.clockType === '24h') {
      timeString = `${currentHour.padStart(2, '0')}:${currentMinutes.padStart(2, '0')}`;
    } else {
      timeString = `${currentHour}:${currentMinutes.padStart(2, '0')} ${currentType}`;
    }

    return {
      hour: currentHour,
      minutes: currentMinutes,
      type: currentType,
      time: timeString,
      degreesHours: this._degreesHours,
      degreesMinutes: this._degreesMinutes,
    };
  };

  public setValue = (time: string, updateInput: boolean = true): void => {
    if (this._isDestroyed) {
      return;
    }

    if (!time || typeof time !== 'string') {
      return;
    }

    if (!this._isInitialized) {
      this.create();
    }

    const trimmedTime = sanitizeTimeInput(time.trim());
    let hour = '12';
    let minutes = '00';
    let type = 'AM';

    try {
      if (this._options.clockType === '24h') {
        const timeMatch = trimmedTime.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
        if (!timeMatch) {
          throw new Error('Invalid 24h format. Expected HH:MM');
        }
        hour = timeMatch[1].padStart(2, '0');
        minutes = timeMatch[2];
      } else {
        const timeMatch = trimmedTime.match(/^(1[0-2]|[1-9]):([0-5][0-9])\s*(AM|PM)$/i);
        if (!timeMatch) {
          throw new Error('Invalid 12h format. Expected HH:MM AM/PM');
        }
        hour = timeMatch[1];
        minutes = timeMatch[2];
        type = timeMatch[3].toUpperCase();
      }

      if (this.hour) {
        this.hour.value = hour;
        this.hour.setAttribute('aria-valuenow', hour);
        this._degreesHours = Number(hour) * 30;
      }

      if (this.minutes) {
        this.minutes.value = minutes;
        this.minutes.setAttribute('aria-valuenow', minutes);
        this._degreesMinutes = Number(minutes) * 6;
      }

      if (this._options.clockType !== '24h' && this.AM && this.PM) {
        if (type === 'AM') {
          this.AM.classList.add('active');
          this.PM.classList.remove('active');
        } else {
          this.PM.classList.add('active');
          this.AM.classList.remove('active');
        }
      }

      if (updateInput && this.input) {
        this.input.value = trimmedTime;
      }

      if (this.clockHand) {
        this.clockHand.style.transform = `rotateZ(${this._degreesHours || 0}deg)`;
      }
    } catch (error) {
      return;
    }
  };

  public update = (
    value: {
      options: OptionTypes;
      create?: boolean;
    },
    callback?: TypeFunction,
  ): void => {
    if (this._isDestroyed) {
      return;
    }

    this._options = { ...this._options, ...value.options };

    this.configManager.checkMobileOption();

    if (value.create) {
      this.create();
    }

    initCallback(callback);
  };

  public setTheme(themeConfig: {
    primaryColor?: string;
    backgroundColor?: string;
    surfaceColor?: string;
    surfaceHoverColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    disabledTextColor?: string;
    onPrimaryColor?: string;
    borderColor?: string;
    shadow?: string;
    borderRadius?: string;
    fontFamily?: string;
  }): void {
    if (this._isDestroyed) {
      return;
    }

    this._pendingThemeConfig = themeConfig;

    const wrapper = this.modalElement?.querySelector('.timepicker-ui-wrapper');
    if (!wrapper) {
      return;
    }

    this._applyThemeToWrapper(wrapper as HTMLElement);
  }
}
