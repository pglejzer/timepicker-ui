import { WheelPlugin } from '@/plugins/wheel';
import { mergeOptions } from '@/utils/options/defaults';
import type { TimepickerOptions } from '@/types/options';

const hourValues = (options: TimepickerOptions): Array<string | null> => {
  const provide = WheelPlugin.templateProvider;
  if (!provide) throw new Error('WheelPlugin has no templateProvider');

  const host = document.createElement('div');
  host.innerHTML = provide(mergeOptions(options), 'tp');
  return [...host.querySelectorAll('.tp-ui-wheel-hours .tp-ui-wheel-item')].map((item) =>
    item.getAttribute('data-value'),
  );
};

describe('WheelPlugin template passes clock.incrementHours to the wheel', () => {
  it('lists 12 hours in a 24h wheel with incrementHours 2', () => {
    expect(hourValues({ clock: { type: '24h', incrementHours: 2 }, ui: { mode: 'wheel' } })).toEqual([
      '00',
      '02',
      '04',
      '06',
      '08',
      '10',
      '12',
      '14',
      '16',
      '18',
      '20',
      '22',
    ]);
  });

  it('lists the grid hours in a 12h compact wheel', () => {
    expect(hourValues({ clock: { type: '12h', incrementHours: 3 }, ui: { mode: 'compact-wheel' } })).toEqual([
      '03',
      '06',
      '09',
      '12',
    ]);
  });

  it('lists every hour when incrementHours is not set', () => {
    expect(hourValues({ clock: { type: '24h' }, ui: { mode: 'wheel' } })).toHaveLength(24);
  });
});
