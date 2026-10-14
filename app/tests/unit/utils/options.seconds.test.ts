import { DEFAULT_OPTIONS, mergeOptions } from '@/utils/options/defaults';

describe('seconds options', () => {
  it('are off by default', () => {
    expect(DEFAULT_OPTIONS.clock.showSeconds).toBe(false);
    expect(DEFAULT_OPTIONS.clock.incrementSeconds).toBe(1);
    expect(DEFAULT_OPTIONS.clock.autoSwitchToSeconds).toBe(true);
  });

  it('have one English seconds label and no per-use seconds keys', () => {
    const { labels } = mergeOptions({});
    expect(labels.second).toBe('Second');
    expect(labels).not.toHaveProperty('secondLabel');
    expect(labels).not.toHaveProperty('mobileSecond');
    expect(labels).not.toHaveProperty('announceSecond');
  });

  it('merge user seconds options over the clock defaults', () => {
    const { clock } = mergeOptions({ clock: { showSeconds: true, incrementSeconds: 15 } });
    expect(clock).toEqual(
      expect.objectContaining({
        type: '12h',
        autoSwitchToMinutes: true,
        showSeconds: true,
        incrementSeconds: 15,
        autoSwitchToSeconds: true,
      }),
    );
  });
});
