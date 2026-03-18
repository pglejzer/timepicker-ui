export interface TimezoneInfo {
  readonly id: string;
  readonly label: string;
  readonly offset: string;
}

let cachedTimezones: TimezoneInfo[] | null = null;

const normalizeOffset = (raw: string): string => {
  if (!raw || raw === '+0' || raw === '-0') return '+00:00';
  const sign = raw.startsWith('-') ? '-' : '+';
  const stripped = raw.replace(/^[+-]/, '');
  const parts = stripped.split(':');
  const hours = parts[0].padStart(2, '0');
  const minutes = parts.length > 1 ? parts[1].padStart(2, '0') : '00';
  return `${sign}${hours}:${minutes}`;
};

export const getTimezoneOffset = (timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    const raw = tzPart?.value?.replace('GMT', '') || '';
    return normalizeOffset(raw);
  } catch {
    return '+00:00';
  }
};

export const getLocalTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

const COMMON_TIMEZONES: readonly string[] = [
  'Pacific/Pago_Pago',
  'Pacific/Honolulu',
  'America/Anchorage',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Santiago',
  'America/Sao_Paulo',
  'Atlantic/Azores',
  'UTC',
  'Europe/Paris',
  'Europe/Helsinki',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Kathmandu',
  'Asia/Dhaka',
  'Asia/Yangon',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Darwin',
  'Australia/Sydney',
  'Pacific/Guadalcanal',
  'Pacific/Auckland',
  'Pacific/Chatham',
  'Pacific/Kiritimati',
];

const buildTimezoneInfo = (id: string): TimezoneInfo => {
  const offset = getTimezoneOffset(id);
  const cityName = id.split('/').pop()?.replace(/_/g, ' ') || id;
  return {
    id,
    label: `${cityName} (${offset || 'UTC'})`,
    offset,
  };
};

export const getTimezoneList = (whitelist?: readonly string[]): TimezoneInfo[] => {
  const tzIds = whitelist ?? COMMON_TIMEZONES;

  if (!whitelist && cachedTimezones) {
    return cachedTimezones;
  }

  const result = tzIds.filter(isValidTimezone).map(buildTimezoneInfo);

  if (!whitelist) {
    cachedTimezones = result;
  }

  return result;
};

export const clearTimezoneCache = (): void => {
  cachedTimezones = null;
};
