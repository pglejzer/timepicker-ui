import * as timezoneIndex from '../../../../../src/managers/plugins/timezone/index';
import TimezoneManager from '../../../../../src/managers/plugins/timezone/TimezoneManager';
import { TimezoneDropdown } from '../../../../../src/managers/plugins/timezone/TimezoneDropdown';
import { TimezoneKeyboard } from '../../../../../src/managers/plugins/timezone/TimezoneKeyboard';
import type { KeyboardState, DropdownState } from '../../../../../src/managers/plugins/timezone/types';

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

  it('should have types available from re-export', () => {
    const keyboardState: KeyboardState = { focusedIndex: 0 };
    const dropdownState: DropdownState = { isOpen: false, selectedTimezone: null };

    expect(keyboardState.focusedIndex).toBe(0);
    expect(dropdownState.isOpen).toBe(false);
  });
});
