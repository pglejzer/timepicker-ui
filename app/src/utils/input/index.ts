import type { ClockOptions } from '../../types/options';

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
  currentTime?: ClockOptions['currentTime'],
  updateOptions?: boolean,
): InputValueResult => {
  const defaultReturn = { hour: '12', minutes: '00', type: clockType === '24h' ? undefined : 'PM' };
  if (!el) return defaultReturn;
  const value = el.value.trim();
  if (!currentTime && !value) return defaultReturn;

  if (typeof currentTime === 'boolean' && currentTime) {
    const date = new Date();
    const [rawHour, rawRest] = date.toLocaleTimeString().split(':');
    const hour = rawHour.padStart(2, '0');
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
      return { hour: h.padStart(2, '0'), minutes: rest, type: undefined };
    }

    const timeString = new Date(cTime).toLocaleTimeString(locales || 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: clockType === '12h',
    });

    const [rawHour, rawRest] = timeString.split(':');

    if (clockType === '12h' && /[a-z]/i.test(rawRest)) {
      const parts = rawRest.trim().split(' ');
      const minutes = parts[0];
      const type = parts[1] || 'AM';
      return { hour: rawHour, minutes, type };
    }

    return { hour: rawHour, minutes: rawRest.replace(/\D/g, ''), type: undefined };
  }

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
  clockType?: '12h' | '24h',
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
