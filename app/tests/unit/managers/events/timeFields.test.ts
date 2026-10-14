import { CoreState } from '@/timepicker/CoreState';
import { TIMINGS } from '@/constants/timings';
import { mergeOptions } from '@/utils/options/defaults';
import {
  activateField,
  announceField,
  fieldBounds,
  getActiveField,
  isTimeDisabled,
  type TimeField,
} from '@/managers/events/timeFields';
import type { TimepickerOptions } from '@/types/options';

type DisabledValue = NonNullable<CoreState['disabledTime']>['value'];

const OWNER_ID = 'time-fields-instance';

const createCore = (options: TimepickerOptions, disabled?: DisabledValue): CoreState => {
  const host = document.createElement('div');
  host.appendChild(document.createElement('input'));
  document.body.appendChild(host);

  const core = new CoreState(host, mergeOptions(options), OWNER_ID);
  if (disabled) core.setDisabledTime({ value: disabled });
  return core;
};

const mountHeader = ({ hour, minutes, seconds }: { hour: string; minutes: string; seconds?: string }): void => {
  const secondsField = seconds === undefined ? '' : `<input class="tp-ui-seconds" value="${seconds}" />`;
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="tp-ui-modal" data-owner-id="${OWNER_ID}">
      <input class="tp-ui-hour" value="${hour}" />
      <input class="tp-ui-minutes" value="${minutes}" />
      ${secondsField}
    </div>`,
  );
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('fieldBounds', () => {
  it.each([
    ['12h', 'hour', [1, 12]],
    ['24h', 'hour', [0, 23]],
    ['12h', 'minutes', [0, 59]],
    ['24h', 'minutes', [0, 59]],
    ['12h', 'seconds', [0, 59]],
    ['24h', 'seconds', [0, 59]],
  ] as const)('%s %s spans %p', (type, field, bounds) => {
    expect(fieldBounds(createCore({ clock: { type } }), field)).toEqual(bounds);
  });
});

describe('isTimeDisabled', () => {
  const secondsInterval: DisabledValue = {
    isInterval: true,
    clockType: '24h',
    intervals: ['10:30:15 - 10:30:45'],
  };

  it('returns false without a header, even when every hour is disabled', () => {
    const allHours = Array.from({ length: 24 }, (_, hour) => String(hour));
    const core = createCore({ clock: { type: '24h' } }, { hours: allHours });

    expect(isTimeDisabled(core)).toBe(false);
  });

  it('checks the header time against the disabled rules', () => {
    const core = createCore({ clock: { type: '24h' } }, { hours: ['10'] });
    mountHeader({ hour: '10', minutes: '15' });

    expect(isTimeDisabled(core)).toBe(true);

    (core.getHour() as HTMLInputElement).value = '11';

    expect(isTimeDisabled(core)).toBe(false);
  });

  it('with showSeconds, checks the header seconds', () => {
    const core = createCore({ clock: { type: '24h', showSeconds: true } }, secondsInterval);
    mountHeader({ hour: '10', minutes: '30', seconds: '20' });

    expect(isTimeDisabled(core)).toBe(true);

    (core.getSeconds() as HTMLInputElement).value = '50';

    expect(isTimeDisabled(core)).toBe(false);
  });

  it('with showSeconds, honours listed seconds', () => {
    const core = createCore({ clock: { type: '24h', showSeconds: true } }, { seconds: ['20'] });
    mountHeader({ hour: '10', minutes: '30', seconds: '20' });

    expect(isTimeDisabled(core)).toBe(true);
  });

  it('without showSeconds, ignores the seconds and checks the whole minute', () => {
    const core = createCore({ clock: { type: '24h' } }, secondsInterval);
    mountHeader({ hour: '10', minutes: '30', seconds: '20' });

    expect(isTimeDisabled(core)).toBe(false);
  });
});

const spinbutton = (field: TimeField, label: string, max: number, value: string): string =>
  `<input class="tp-ui-${field}" role="spinbutton" aria-label="${label}" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${Number(value)}" aria-valuetext="${value}" value="${value}" />`;

const mountClockModal = (withSeconds = true): HTMLElement => {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="tp-ui-modal" data-owner-id="${OWNER_ID}">
      ${spinbutton('hour', 'Hour', 23, '10')}
      ${spinbutton('minutes', 'Minute', 59, '25')}
      ${withSeconds ? spinbutton('seconds', 'Second', 59, '40') : ''}
      <div class="tp-ui-clock-face" role="slider" tabindex="0"></div>
      <div class="timepicker-announcer"></div>
    </div>`,
  );
  return document.querySelector('.tp-ui-modal') as HTMLElement;
};

const fieldInput = (field: TimeField): HTMLInputElement =>
  document.querySelector(`.tp-ui-${field}`) as HTMLInputElement;
const dial = (): HTMLElement => document.querySelector('.tp-ui-clock-face') as HTMLElement;
const activeFields = (): string[] =>
  [...document.querySelectorAll<HTMLInputElement>('input.active')].map((input) => input.classList[0]);

describe('getActiveField', () => {
  it('falls back to hour when no field is active', () => {
    const core = createCore({ clock: { type: '24h' } });
    mountClockModal();

    expect(getActiveField(core)).toBe('hour');
  });

  it('falls back to hour when the picker has no header', () => {
    const core = createCore({ clock: { type: '24h' } });

    expect(getActiveField(core)).toBe('hour');
  });

  it.each<TimeField>(['hour', 'minutes', 'seconds'])('reports %s when that field carries the active class', (field) => {
    const core = createCore({ clock: { type: '24h', showSeconds: true } });
    mountClockModal();
    fieldInput(field).classList.add('active');

    expect(getActiveField(core)).toBe(field);
  });
});

describe('activateField', () => {
  it.each<[TimeField, string, string]>([
    ['hour', 'Hour', '10'],
    ['minutes', 'Minute', '25'],
    ['seconds', 'Second', '40'],
  ])('makes %s the only active field and points the dial at it', (field, label, value) => {
    const core = createCore({ clock: { type: '24h', showSeconds: true } });
    mountClockModal();
    (['hour', 'minutes', 'seconds'] as const).forEach((name) => fieldInput(name).classList.add('active'));

    activateField(core, field);

    expect(activeFields()).toEqual([`tp-ui-${field}`]);
    expect(dial().getAttribute('aria-label')).toBe(label);
    expect(dial().getAttribute('aria-valuenow')).toBe(String(Number(value)));
    expect(dial().getAttribute('aria-valuetext')).toBe(value);
  });

  it('moves the active class from one field to the next on repeated calls', () => {
    const core = createCore({ clock: { type: '24h' } });
    mountClockModal(false);

    activateField(core, 'hour');
    activateField(core, 'minutes');

    expect(activeFields()).toEqual(['tp-ui-minutes']);
    expect(dial().getAttribute('aria-label')).toBe('Minute');
  });

  it('does not throw when the picker has no header or dial', () => {
    const core = createCore({ clock: { type: '24h' } });

    expect(() => activateField(core, 'minutes')).not.toThrow();
  });

  it('writes nothing to the fields or the dial when the field is already active', () => {
    const core = createCore({ clock: { type: '24h', showSeconds: true } });
    const modal = mountClockModal();
    activateField(core, 'minutes');
    const observer = new MutationObserver(() => {});
    observer.observe(modal, { attributes: true, subtree: true, attributeOldValue: true });

    activateField(core, 'minutes');

    const records = observer.takeRecords();
    observer.disconnect();
    expect(records).toHaveLength(0);
    expect(activeFields()).toEqual(['tp-ui-minutes']);
  });
});

describe('announceField', () => {
  const announcer = (): HTMLElement => document.querySelector('.timepicker-announcer') as HTMLElement;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each<[TimeField, string]>([
    ['hour', 'Hour: 10'],
    ['minutes', 'Minutes: 25'],
    ['seconds', 'Second: 40'],
  ])('announces %s with its default label and the field value after the announce delay', (field, message) => {
    const core = createCore({ clock: { type: '24h', showSeconds: true } });
    mountClockModal();
    announcer().textContent = 'previous';

    announceField(core, field);

    expect(announcer().textContent).toBe('');
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);
    expect(announcer().textContent).toBe(message);
  });

  it('uses the custom announce label from the options', () => {
    const core = createCore({ clock: { type: '24h' }, labels: { announceMinute: 'Minuty' } });
    mountClockModal(false);

    announceField(core, 'minutes');
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(announcer().textContent).toBe('Minuty: 25');
  });

  it.each<[TimeField, string]>([
    ['hour', 'Godzina: 10'],
    ['minutes', 'Minuta: 25'],
    ['seconds', 'Sekunda: 40'],
  ])('announces %s with labels.hour, labels.minute and labels.second', (field, message) => {
    const core = createCore({
      clock: { type: '24h', showSeconds: true },
      labels: { hour: 'Godzina', minute: 'Minuta', second: 'Sekunda' },
    });
    mountClockModal();

    announceField(core, field);
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(announcer().textContent).toBe(message);
  });

  it('announces nothing for a field the picker does not render', () => {
    const core = createCore({ clock: { type: '24h' } });
    mountClockModal(false);
    announcer().textContent = 'previous';

    announceField(core, 'seconds');
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(announcer().textContent).toBe('previous');
  });
});
