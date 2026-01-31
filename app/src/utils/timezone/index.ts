export interface TimezoneInfo {
  readonly id: string;
  readonly label: string;
  readonly offset: string;
}

let cachedTimezones: TimezoneInfo[] | null = null;

export const getTimezoneOffset = (timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart?.value?.replace('GMT', '') || '+00:00';
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

