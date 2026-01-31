import {
  getTimezoneOffset,
  getLocalTimezone,
  isValidTimezone,
  getTimezoneList,
  clearTimezoneCache,
} from '../../../src/utils/timezone';

describe('timezone utils', () => {
  beforeEach(() => {
    clearTimezoneCache();
  });

  describe('getTimezoneOffset', () => {
    it('should return offset for valid timezone', () => {
      const offset = getTimezoneOffset('UTC');
      expect(offset).toBe('+00:00');
    });

    it('should return formatted offset for timezone with positive offset', () => {
      const offset = getTimezoneOffset('Europe/Paris');
      expect(offset).toMatch(/^[+-]\d{1,2}(:\d{2})?$/);
    });

    it('should return +00:00 for invalid timezone', () => {
      const offset = getTimezoneOffset('Invalid/Timezone');
      expect(offset).toBe('+00:00');
    });
  });

  describe('getLocalTimezone', () => {
    it('should return a non-empty string', () => {
      const tz = getLocalTimezone();
      expect(typeof tz).toBe('string');
      expect(tz.length).toBeGreaterThan(0);
    });

    it('should return valid IANA timezone identifier', () => {
      const tz = getLocalTimezone();
      expect(isValidTimezone(tz)).toBe(true);
    });
  });

  describe('isValidTimezone', () => {
    it('should return true for valid IANA timezone', () => {
      expect(isValidTimezone('UTC')).toBe(true);
      expect(isValidTimezone('America/New_York')).toBe(true);
      expect(isValidTimezone('Europe/London')).toBe(true);
      expect(isValidTimezone('Asia/Tokyo')).toBe(true);
    });

    it('should return false for invalid timezone', () => {
      expect(isValidTimezone('Invalid/Timezone')).toBe(false);
      expect(isValidTimezone('NotATimezone')).toBe(false);
      expect(isValidTimezone('')).toBe(false);
    });
  });

  describe('getTimezoneList', () => {
    it('should return array of TimezoneInfo objects', () => {
      const list = getTimezoneList();
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);

      const first = list[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('label');
      expect(first).toHaveProperty('offset');
    });

    it('should include common timezones', () => {
      const list = getTimezoneList();
      const ids = list.map((tz) => tz.id);

      expect(ids).toContain('UTC');
      expect(ids).toContain('America/New_York');
      expect(ids).toContain('Europe/Paris');
    });

    it('should format label with city name and offset', () => {
      const list = getTimezoneList();
      const utc = list.find((tz) => tz.id === 'UTC');

      expect(utc).toBeDefined();
      expect(utc?.label).toContain('UTC');
    });

    it('should filter by whitelist when provided', () => {
      const whitelist = ['UTC', 'America/New_York'] as const;
      const list = getTimezoneList(whitelist);

      expect(list.length).toBe(2);
      expect(list.map((tz) => tz.id)).toEqual(['UTC', 'America/New_York']);
    });

    it('should filter out invalid timezones from whitelist', () => {
      const whitelist = ['UTC', 'Invalid/Timezone', 'America/New_York'] as const;
      const list = getTimezoneList(whitelist);

      expect(list.length).toBe(2);
      expect(list.map((tz) => tz.id)).toEqual(['UTC', 'America/New_York']);
    });

    it('should cache results when no whitelist provided', () => {
      const list1 = getTimezoneList();
      const list2 = getTimezoneList();

      expect(list1).toBe(list2);
    });

    it('should not cache results when whitelist provided', () => {
      const whitelist = ['UTC'] as const;
      const list1 = getTimezoneList(whitelist);
      const list2 = getTimezoneList(whitelist);

      expect(list1).not.toBe(list2);
      expect(list1).toEqual(list2);
    });
  });

  describe('clearTimezoneCache', () => {
    it('should clear cached timezone list', () => {
      const list1 = getTimezoneList();
      clearTimezoneCache();
      const list2 = getTimezoneList();

      expect(list1).not.toBe(list2);
      expect(list1).toEqual(list2);
    });
  });
});

