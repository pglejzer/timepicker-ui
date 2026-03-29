import * as managersIndex from '../../../src/managers/index';
import AnimationManager from '../../../src/managers/AnimationManager';
import ModalManager from '../../../src/managers/ModalManager';
import ConfigManager from '../../../src/managers/ConfigManager';
import ThemeManager from '../../../src/managers/ThemeManager';
import ValidationManager from '../../../src/managers/ValidationManager';
import EventManager from '../../../src/managers/EventManager';
import ClockManager from '../../../src/managers/ClockManager';

describe('managers index exports', () => {
  it('should export AnimationManager', () => {
    expect(managersIndex.AnimationManager).toBe(AnimationManager);
  });

  it('should export ModalManager', () => {
    expect(managersIndex.ModalManager).toBe(ModalManager);
  });

  it('should export ConfigManager', () => {
    expect(managersIndex.ConfigManager).toBe(ConfigManager);
  });

  it('should export ThemeManager', () => {
    expect(managersIndex.ThemeManager).toBe(ThemeManager);
  });

  it('should export ValidationManager', () => {
    expect(managersIndex.ValidationManager).toBe(ValidationManager);
  });

  it('should export EventManager', () => {
    expect(managersIndex.EventManager).toBe(EventManager);
  });

  it('should export ClockManager', () => {
    expect(managersIndex.ClockManager).toBe(ClockManager);
  });

  it('should not export plugin managers from core barrel (tree-shaking)', () => {
    expect((managersIndex as Record<string, unknown>).TimezoneManager).toBeUndefined();
    expect((managersIndex as Record<string, unknown>).RangeManager).toBeUndefined();
    expect((managersIndex as Record<string, unknown>).WheelManager).toBeUndefined();
  });
});
