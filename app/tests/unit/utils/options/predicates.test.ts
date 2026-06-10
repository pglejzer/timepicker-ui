import { isWheelMode, isCompactWheelMode, isPopoverMode } from '@/utils/options/predicates';
import type { TimepickerOptions } from '@/types/options';

const opts = (mode: string, placement?: string): Required<TimepickerOptions> =>
  ({ ui: { mode }, wheel: placement ? { placement } : {} }) as unknown as Required<TimepickerOptions>;

describe('isWheelMode', () => {
  it('true for wheel', () => {
    expect(isWheelMode(opts('wheel'))).toBe(true);
  });
  it('true for compact-wheel', () => {
    expect(isWheelMode(opts('compact-wheel'))).toBe(true);
  });
  it('false for clock', () => {
    expect(isWheelMode(opts('clock'))).toBe(false);
  });
});

describe('isCompactWheelMode', () => {
  it('true only for compact-wheel', () => {
    expect(isCompactWheelMode(opts('compact-wheel'))).toBe(true);
    expect(isCompactWheelMode(opts('wheel'))).toBe(false);
  });
});

describe('isPopoverMode', () => {
  it('true when compact-wheel + placement', () => {
    expect(isPopoverMode(opts('compact-wheel', 'bottom'))).toBe(true);
  });
  it('false when compact-wheel without placement', () => {
    expect(isPopoverMode(opts('compact-wheel'))).toBe(false);
  });
  it('false when wheel + placement', () => {
    expect(isPopoverMode(opts('wheel', 'bottom'))).toBe(false);
  });
});
