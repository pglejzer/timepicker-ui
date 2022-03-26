/* eslint-disable no-else-return */
import { OptionTypes } from './types';

export const getInputValue = (
  el: HTMLInputElement,
  clockType?: string,
  currentTime?: OptionTypes['currentTime'],
  updateOptions?: boolean,
) => {
  if (!el) {
    return {
      hour: '12',
      minutes: '00',
      type: clockType === '24h' ? undefined : 'PM',
    };
  }

  const { value } = el;

  if (!currentTime) {
    if (value === '' || !value) {
      return {
        hour: '12',
        minutes: '00',
        type: clockType === '24h' ? undefined : 'PM',
      };
    }
  } else if (typeof currentTime === 'boolean' && currentTime) {
    const [hour, splitMinutes] = new Date().toLocaleTimeString().split(':');

    if (/[a-z]/i.test(splitMinutes) && clockType === '12h') {
      const [minutes, type] = splitMinutes.split(' ');

      return {
        hour: Number(hour) <= 9 ? `0${Number(hour)}` : hour,
        minutes,
        type,
      };
    }

    return {
      hour: Number(hour) <= 9 ? `0${Number(hour)}` : hour,
      minutes: splitMinutes,
      type: undefined,
    };
  } else {
    const { time, locales, preventClockType } = currentTime;
    let cTime = time;

    if (!time) {
      cTime = new Date();
    }

    if (preventClockType && updateOptions) {
      const [preventHour, splitedRest] = new Date(cTime as Date).toLocaleTimeString().split(':');

      if (/[a-z]/i.test(splitedRest)) {
        const [splitedMinutes, restType] = splitedRest.split(' ');
        return {
          hour: preventHour,
          minutes: splitedMinutes,
          type: restType,
        };
      }

      return {
        hour: Number(preventHour) <= 9 ? `0${Number(preventHour)}` : preventHour,
        minutes: splitedRest,
        type: undefined,
      };
    }

    const [hour, splitMinutes] = new Date(cTime as Date)
      .toLocaleTimeString(locales, {
        timeStyle: 'short',
      })
      .split(':');

    if (/[a-z]/i.test(splitMinutes) && clockType === '12h') {
      const [minutes, type] = splitMinutes.split(' ');

      return {
        hour: Number(hour) <= 9 ? `0${Number(hour)}` : hour,
        minutes,
        type,
      };
    }

    if (clockType === '12h') {
      const [h, r] = new Date(`1970-01-01T${hour}:${splitMinutes}Z`)
        .toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour12: true,
          hour: 'numeric',
          minute: 'numeric',
        })
        .split(':');

      const [nm, t] = r.split(' ');

      return {
        hour: Number(h) <= 9 ? `0${Number(h)}` : hour,
        minutes: nm,
        type: t,
      };
    }

    return {
      hour: Number(hour) <= 9 ? `0${Number(hour)}` : hour,
      minutes: splitMinutes,
      type: undefined,
    };
  }

  const [hour, type] = value.split(' ');
  const [hourSplit, minutesSplit] = hour.split(':');

  if (/[a-z]/i.test(hour)) {
    return {
      error: 'The input contains invalid letters or whitespace.',
    };
  }

  if (value.includes(' ')) {
    if (!type) {
      return {
        error: `The input contains invalid letters or whitespace.
        Problem is with input length (max 5), currentLength: ${value.length}.`,
        currentLength: value.length,
      };
    }
    if (value.length > 8 || (type !== 'AM' && type !== 'PM')) {
      return {
        error: `The input contains invalid letters or whitespace.
        Problem is with input length (max 8), currentLength: ${value.length} or invalid type (PM or AM), currentType: ${type}.`,
        currentLength: value.length,
        currentType: type,
      };
    }
  }

  let min: number | string = Number(minutesSplit);
  const hor = Number(hourSplit);

  if (min < 10) {
    min = `0${min}`;
  } else if (min === 0) {
    min = '00';
  }

  if (clockType === '12h') {
    if (hor > 12 || min > 59 || min < 0 || hor === 0 || (type !== 'AM' && type !== 'PM')) {
      return {
        error: `The input contains invalid letters or numbers. Problem is with hour which should be less than 13 and higher or equal 0, currentHour: ${hor}. Minutes should be less than 60 and higher or equal 0, currentMinutes: ${Number(
          min,
        )} or invalid type (PM or AM), currentType: ${type}.`,
        currentHour: hor,
        currentMin: min,
        currentType: type,
      };
    }

    return {
      hour: hor < 10 ? `0${hor}` : hor.toString(),
      minutes: min.toString(),
      type,
    };
    // eslint-disable-next-line no-else-return
  } else {
    if (hor < 0 || hor > 23 || min > 59) {
      return {
        error: `The input contains invalid numbers. Problem is with hour which should be less than 24 and higher or equal 0, currentHour: ${hor}. Minutes should be less than 60 and higher or equal 0, currentMinutes: ${Number(
          min,
        )}`,
        currentHour: hor,
        currentMin: min,
      };
    }

    return {
      hour: hor < 10 ? `0${hor}` : hor.toString(),
      minutes: min.toString(),
    };
  }
};

export const handleValueAndCheck = (
  val: string | number | null,
  type: 'hour' | 'minutes',
  clockType?: OptionTypes['clockType'],
): undefined | boolean => {
  const value = Number(val);

  if (type === 'hour') {
    if (clockType !== '24h') {
      if (value > 0 && value <= 12) {
        return true;
      } else {
        return false;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (value >= 0 && value <= 23) {
        return true;
      } else {
        return false;
      }
    }
  }

  if (type === 'minutes') {
    if (value >= 0 && value <= 59) {
      return true;
    } else {
      return false;
    }
  }
};
