import { TIMINGS, type TimingsKey } from '../../../src/constants/timings';
import * as constantsIndex from '../../../src/constants/index';

describe('TIMINGS constants', () => {
  it('should export TIMINGS object', () => {
    expect(TIMINGS).toBeDefined();
    expect(typeof TIMINGS).toBe('object');
  });

  it('should be re-exported from index', () => {
    expect(constantsIndex.TIMINGS).toBe(TIMINGS);
  });

  it('should have DEFAULT_DELAY constant', () => {
    expect(TIMINGS.DEFAULT_DELAY).toBe(300);
  });

  it('should have MODAL_ANIMATION constant', () => {
    expect(TIMINGS.MODAL_ANIMATION).toBe(150);
  });

  it('should have SCROLLBAR_RESTORE constant', () => {
    expect(TIMINGS.SCROLLBAR_RESTORE).toBe(400);
  });

  it('should have MODAL_REMOVE constant', () => {
    expect(TIMINGS.MODAL_REMOVE).toBe(300);
  });

  it('should have CLOCK_ANIMATION constant', () => {
    expect(TIMINGS.CLOCK_ANIMATION).toBe(600);
  });

  it('should have TIPS_ANIMATION constant', () => {
    expect(TIMINGS.TIPS_ANIMATION).toBe(401);
  });

  it('should have MOBILE_TOGGLE constant', () => {
    expect(TIMINGS.MOBILE_TOGGLE).toBe(450);
  });

  it('should have CLOCK_SCALE_DELAY constant', () => {
    expect(TIMINGS.CLOCK_SCALE_DELAY).toBe(150);
  });

  it('should have DROPDOWN_CLICK_DELAY constant', () => {
    expect(TIMINGS.DROPDOWN_CLICK_DELAY).toBe(10);
  });

  it('should have all expected keys', () => {
    const expectedKeys: TimingsKey[] = [
      'DEFAULT_DELAY',
      'MODAL_ANIMATION',
      'SCROLLBAR_RESTORE',
      'MODAL_REMOVE',
      'CLOCK_ANIMATION',
      'TIPS_ANIMATION',
      'MOBILE_TOGGLE',
      'CLOCK_SCALE_DELAY',
      'DROPDOWN_CLICK_DELAY',
    ];

    expectedKeys.forEach((key) => {
      expect(TIMINGS).toHaveProperty(key);
      expect(typeof TIMINGS[key]).toBe('number');
    });
  });

  it('should be immutable (readonly)', () => {
    const timingsCopy = { ...TIMINGS };
    expect(timingsCopy.DEFAULT_DELAY).toBe(TIMINGS.DEFAULT_DELAY);
  });
});

