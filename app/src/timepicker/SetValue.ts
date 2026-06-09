import type { CoreState } from './CoreState';
import type { Managers } from './Managers';
import { parseTime12, parseTime24 } from '../utils/time/parse';
import { isWheelMode } from '../utils/options/predicates';

export interface ParsedTime {
  hourValue: string;
  minutesValue: string;
  typeValue: string;
}

export function parseTimeStringFor(core: CoreState, trimmedTime: string): ParsedTime {
  if (core.options.clock.type === '24h') {
    const parsed = parseTime24(trimmedTime);
    if (!parsed) throw new Error('Invalid 24h format. Expected HH:MM');
    return {
      hourValue: parsed.hour.padStart(2, '0'),
      minutesValue: parsed.minutes,
      typeValue: 'AM',
    };
  }
  const parsed = parseTime12(trimmedTime);
  if (!parsed) throw new Error('Invalid 12h format. Expected HH:MM AM/PM');
  return {
    hourValue: parsed.hour,
    minutesValue: parsed.minutes,
    typeValue: parsed.type,
  };
}

export function applyParsedTime(core: CoreState, parsed: ParsedTime): void {
  const hour = core.getHour();
  const minutes = core.getMinutes();

  if (hour) {
    hour.value = parsed.hourValue;
    hour.setAttribute('aria-valuenow', parsed.hourValue);
    core.setDegreesHours(Number(parsed.hourValue) * 30);
  }

  if (minutes) {
    minutes.value = parsed.minutesValue;
    minutes.setAttribute('aria-valuenow', parsed.minutesValue);
    core.setDegreesMinutes(Number(parsed.minutesValue) * 6);
  }
}

export function syncPeriodIndicator(core: CoreState, typeValue: string): void {
  if (core.options.clock.type === '24h') return;

  const AM = core.getAM();
  const PM = core.getPM();
  if (!AM || !PM) return;

  if (typeValue === 'AM') {
    AM.classList.add('active');
    PM.classList.remove('active');
  } else {
    PM.classList.add('active');
    AM.classList.remove('active');
  }
}

export function syncClockVisual(core: CoreState, managers: Managers, parsed: ParsedTime): void {
  if (isWheelMode(core.options)) {
    const wheel = managers.getPlugin('wheel');
    wheel?.scrollToValue?.(parsed.hourValue, parsed.minutesValue, parsed.typeValue);
  } else {
    const clockHand = core.getClockHand();
    if (clockHand) {
      clockHand.style.transform = `rotateZ(${core.degreesHours || 0}deg)`;
    }
  }
}
