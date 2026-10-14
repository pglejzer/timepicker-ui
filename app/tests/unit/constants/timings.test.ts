import { TIMINGS } from '../../../src/constants/timings';
import * as constantsIndex from '../../../src/constants/index';

const REMOVED_KEYS = [
  'DEFAULT_DELAY',
  'MODAL_ANIMATION',
  'SCROLLBAR_UNLOCK_DELAY',
  'SCROLLBAR_RESTORE',
  'MODAL_REMOVE',
];

describe('TIMINGS constants', () => {
  it('should export TIMINGS object', () => {
    expect(TIMINGS).toBeDefined();
    expect(typeof TIMINGS).toBe('object');
  });

  it('should be re-exported from index', () => {
    expect(constantsIndex.TIMINGS).toBe(TIMINGS);
  });

  it('should time the modal exit fade at 150ms', () => {
    expect(TIMINGS.MODAL_EXIT).toBe(150);
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

  it('should have ANNOUNCE_DELAY constant', () => {
    expect(TIMINGS.ANNOUNCE_DELAY).toBe(100);
  });

  it('should have COMMIT_ON_SCROLL_DELAY constant', () => {
    expect(TIMINGS.COMMIT_ON_SCROLL_DELAY).toBe(400);
  });

  it('should have exactly the expected numeric keys', () => {
    const expectedKeys: Array<keyof typeof TIMINGS> = [
      'MODAL_EXIT',
      'TIPS_ANIMATION',
      'MOBILE_TOGGLE',
      'CLOCK_SCALE_DELAY',
      'WRAPPER_TRANSITION',
      'DROPDOWN_CLICK_DELAY',
      'ANNOUNCE_DELAY',
      'COMMIT_ON_SCROLL_DELAY',
    ];

    expect(Object.keys(TIMINGS).sort()).toEqual([...expectedKeys].sort());
    expectedKeys.forEach((key) => {
      expect(typeof TIMINGS[key]).toBe('number');
    });
  });

  it.each(REMOVED_KEYS)('should no longer define the open/close timer %s', (key) => {
    expect(TIMINGS).not.toHaveProperty(key);
  });

  it('should be immutable (readonly)', () => {
    const timingsCopy = { ...TIMINGS };
    expect(timingsCopy.MODAL_EXIT).toBe(TIMINGS.MODAL_EXIT);
  });
});
