import { mergeOptions } from '@/utils/options/defaults';

describe('mergeOptions and clock.isTimeDisabled', () => {
  it('adds no isTimeDisabled key to the defaults', () => {
    const { clock } = mergeOptions({});

    expect(Object.keys(clock)).not.toContain('isTimeDisabled');
    expect(clock.isTimeDisabled).toBeUndefined();
  });

  it('adds no isTimeDisabled key when other clock options are set', () => {
    const { clock } = mergeOptions({ clock: { type: '24h', showSeconds: true } });

    expect('isTimeDisabled' in clock).toBe(false);
  });

  it('passes a user function through by reference', () => {
    const isTimeDisabled = jest.fn(() => false);

    expect(mergeOptions({ clock: { isTimeDisabled } }).clock.isTimeDisabled).toBe(isTimeDisabled);
  });
});
