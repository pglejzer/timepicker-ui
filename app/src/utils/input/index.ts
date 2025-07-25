import type { OptionTypes } from '../../types/types';

export type InputValueResult = {
  hour: string;
  minutes: string;
  type?: string;
  error?: string;
  currentHour?: string | number;
  currentMin?: string | number;
  currentType?: string;
  currentLength?: number;
};

export const getInputValue = (
  el: HTMLInputElement,
  clockType?: string,
  currentTime?: OptionTypes['currentTime'],
  updateOptions?: boolean,
): InputValueResult => {
  const defaultReturn = {
    hour: '12',
    minutes: '00',
    type: clockType === '24h' ? undefined : 'PM',
  };

  if (!el) return defaultReturn;

  const value = el.value.trim();

  if (!currentTime && value === '') return defaultReturn;

  if (typeof currentTime === 'boolean' && currentTime) {
    const date = new Date();
    const [rawHour, rawRest] = date.toLocaleTimeString().split(':');
    const hour = Number(rawHour) <= 9 ? `0${Number(rawHour)}` : rawHour;

    if (/[a-z]/i.test(rawRest) && clockType === '12h') {
      const [minutes, type] = rawRest.split(' ');
      return { hour, minutes, type };
    }

    return { hour, minutes: rawRest, type: undefined };
  }

  if (typeof currentTime === 'object') {
    const { time, locales, preventClockType } = currentTime;
    const cTime = time ?? new Date();

    if (preventClockType && updateOptions) {
      const [h, rest] = new Date(cTime).toLocaleTimeString().split(':');

      if (/[a-z]/i.test(rest)) {
        const [minutes, type] = rest.split(' ');
        return { hour: h, minutes, type };
      }

      const hour = Number(h) <= 9 ? `0${Number(h)}` : h;
      return { hour, minutes: rest, type: undefined };
    }

    const [rawHour, rawRest] = new Date(cTime).toLocaleTimeString(locales, { timeStyle: 'short' }).split(':');
    const hour = Number(rawHour) <= 9 ? `0${Number(rawHour)}` : rawHour;

    if (/[a-z]/i.test(rawRest) && clockType === '12h') {
      const [minutes, type] = rawRest.split(' ');
      return { hour, minutes, type };
    }

    if (clockType === '12h') {
      const [h, mWithType] = new Date(`1970-01-01T${rawHour}:${rawRest}Z`)
        .toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour12: true,
          hour: 'numeric',
          minute: 'numeric',
        })
        .split(':');

      const [nm, t] = mWithType.split(' ');
      return { hour: Number(h) <= 9 ? `0${Number(h)}` : h, minutes: nm, type: t };
    }

    return { hour, minutes: rawRest, type: undefined };
  }

  // manual input
  const [hourPart, type] = value.split(' ');
  const [hStr = '', mStr = ''] = hourPart.split(':');

  const hour = hStr.replace(/\D/g, '');
  const minutes = mStr.replace(/\D/g, '');

  const result = {
    hour: hour.padStart(2, '0'),
    minutes: minutes.padStart(2, '0'),
    type: clockType === '12h' ? type : undefined,
  };

  if (hour.length > 2 || minutes.length > 2) {
    return {
      ...result,
      error: 'Invalid input: too many digits.',
      currentHour: hStr,
      currentMin: mStr,
    };
  }

  if (/[a-z]/i.test(hourPart)) {
    return {
      ...result,
      error: 'Input contains invalid letters.',
    };
  }

  if (value.includes(' ')) {
    if (!type || value.length > 8 || (type !== 'AM' && type !== 'PM')) {
      return {
        ...result,
        error: `Invalid AM/PM format or length.`,
        currentLength: value.length,
        currentType: type,
      };
    }
  }

  const h = Number(hour);
  const m = Number(minutes);

  if (clockType === '12h') {
    if (h < 1 || h > 12 || m < 0 || m > 59 || (type !== 'AM' && type !== 'PM')) {
      return {
        ...result,
        error: `Invalid 12h time.`,
        currentHour: h,
        currentMin: m,
        currentType: type,
      };
    }
  } else {
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      return {
        ...result,
        error: `Invalid 24h time.`,
        currentHour: h,
        currentMin: m,
      };
    }
  }

  return result;
};

export const handleValueAndCheck = (
  val: string | number | null,
  type: 'hour' | 'minutes',
  clockType?: OptionTypes['clockType'],
): boolean | undefined => {
  const value = Number(val);

  if (Number.isNaN(value)) {
    return false;
  }

  switch (type) {
    case 'hour': {
      if (clockType === '24h') {
        if (value >= 0 && value <= 23) {
          return true;
        } else {
          return false;
        }
      }

      if (value > 0 && value <= 12) {
        return true;
      } else {
        return false;
      }
    }

    case 'minutes': {
      if (value >= 0 && value <= 59) {
        return true;
      } else {
        return false;
      }
    }

    default:
      return undefined;
  }
};
