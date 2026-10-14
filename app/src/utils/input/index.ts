import type { ClockOptions } from '../../types/options';
import { parseTime, pad, fromHours24, type TimeValue } from '../time/parse';
import { localeClockType } from '../time/locale';

export type InputValueResult = {
  hour: string;
  minutes: string;
  seconds?: string;
  type?: string;
  error?: string;
  currentHour?: string | number;
  currentMin?: string | number;
  currentSec?: string | number;
  currentType?: string;
  currentLength?: number;
};

const MAX_12H_LENGTH = 8;
const MAX_12H_LENGTH_WITH_SECONDS = 11;

const toResult = ({ hour, minutes, seconds, type }: TimeValue): InputValueResult =>
  seconds === undefined ? { hour, minutes, type } : { hour, minutes, seconds, type };

const fromDate = (date: Date, clockType: string | undefined, showSeconds: boolean): InputValueResult => {
  const minutes = pad(date.getMinutes());
  const seconds = showSeconds ? pad(date.getSeconds()) : undefined;
  return toResult(fromHours24(date.getHours(), { minutes, seconds }, clockType === '24h' ? '24h' : '12h'));
};

export const getInputValue = (
  el: HTMLInputElement,
  clockType?: string,
  currentTime?: ClockOptions['currentTime'],
  updateOptions?: boolean,
  showSeconds = false,
): InputValueResult => {
  const defaultReturn = toResult({
    hour: '12',
    minutes: '00',
    seconds: showSeconds ? '00' : undefined,
    type: clockType === '24h' ? undefined : 'PM',
  });
  if (!el) return defaultReturn;
  const value = el.value.trim();
  if (!currentTime && !value) return defaultReturn;

  if (typeof currentTime === 'boolean' && currentTime) {
    return fromDate(new Date(), clockType, showSeconds);
  }

  if (typeof currentTime === 'object') {
    const { time, preventClockType } = currentTime;
    const date = new Date(time ?? new Date());

    if (preventClockType && updateOptions) {
      return fromDate(date, localeClockType(), showSeconds);
    }

    return fromDate(date, clockType, showSeconds);
  }

  const parsed = parseTime(value, { clockType: clockType === '24h' ? '24h' : '12h', showSeconds });
  if (parsed) return toResult(parsed);

  const [hourPart, type] = value.split(' ');
  const [hStr = '', mStr = '', sStr = ''] = hourPart.split(':');

  const hour = hStr.replace(/\D/g, '');
  const minutes = mStr.replace(/\D/g, '');
  const seconds = showSeconds ? sStr.replace(/\D/g, '') : '';

  const result: InputValueResult = {
    hour: hour.padStart(2, '0'),
    minutes: minutes.padStart(2, '0'),
    type: clockType === '12h' ? type : undefined,
  };
  if (showSeconds) result.seconds = seconds.padStart(2, '0');

  if (hour.length > 2 || minutes.length > 2 || seconds.length > 2) {
    return {
      ...result,
      error: 'Invalid input: too many digits.',
      currentHour: hStr,
      currentMin: mStr,
      ...(showSeconds ? { currentSec: sStr } : {}),
    };
  }

  if (/[a-z]/i.test(hourPart)) {
    return {
      ...result,
      error: 'Input contains invalid letters.',
    };
  }

  if (value.includes(' ')) {
    const maxLength = showSeconds ? MAX_12H_LENGTH_WITH_SECONDS : MAX_12H_LENGTH;
    if (!type || value.length > maxLength || (type !== 'AM' && type !== 'PM')) {
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
  const s = Number(seconds);
  const isSixtyValid = m >= 0 && m <= 59 && s >= 0 && s <= 59;
  const secondInfo = showSeconds ? { currentSec: s } : {};

  if (clockType === '12h') {
    if (h < 1 || h > 12 || !isSixtyValid || (type !== 'AM' && type !== 'PM')) {
      return {
        ...result,
        error: `Invalid 12h time.`,
        currentHour: h,
        currentMin: m,
        ...secondInfo,
        currentType: type,
      };
    }
  } else {
    if (h < 0 || h > 23 || !isSixtyValid) {
      return {
        ...result,
        error: `Invalid 24h time.`,
        currentHour: h,
        currentMin: m,
        ...secondInfo,
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
