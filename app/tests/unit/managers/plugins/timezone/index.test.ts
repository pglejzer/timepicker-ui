import * as timezoneIndex from '../../../../../src/managers/plugins/timezone/index';
import TimezoneManager from '../../../../../src/managers/plugins/timezone/TimezoneManager';
import { TimezoneDropdown } from '../../../../../src/managers/plugins/timezone/TimezoneDropdown';
import { TimezoneKeyboard } from '../../../../../src/managers/plugins/timezone/TimezoneKeyboard';

describe('timezone index exports', () => {
  it('should export TimezoneManager', () => {
    expect(timezoneIndex.TimezoneManager).toBe(TimezoneManager);
  });

  it('should export TimezoneDropdown', () => {
    expect(timezoneIndex.TimezoneDropdown).toBe(TimezoneDropdown);
  });

  it('should export TimezoneKeyboard', () => {
    expect(timezoneIndex.TimezoneKeyboard).toBe(TimezoneKeyboard);
  });
});

