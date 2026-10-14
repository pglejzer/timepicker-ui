import TimepickerUI from '@/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

describe('TimepickerUI with seconds', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    jest.useFakeTimers();
    input = document.createElement('input');
    document.body.appendChild(input);
  });
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  const create = (value: string, options: TimepickerOptions): TimepickerUI => {
    input.value = value;
    const picker = new TimepickerUI(input, { ...options, ui: { animation: false, ...options.ui } });
    picker.create();
    return picker;
  };
  const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;
  const secondsInput = (root: ParentNode = modal()): HTMLInputElement => {
    const field = root.querySelector<HTMLInputElement>('.tp-ui-seconds');
    if (!field) throw new Error('the seconds field .tp-ui-seconds is not rendered');
    return field;
  };
  const press = (target: HTMLElement, key: string): void => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };
  const faceTips = (): HTMLElement[] => [
    ...modal().querySelectorAll<HTMLElement>('.tp-ui-tips-wrapper .tp-ui-value-tips'),
  ];
  const activeTip = (): string | null | undefined =>
    faceTips().find((tip) => tip.classList.contains('active'))?.textContent;
  const tipFor = (text: string): HTMLElement | undefined =>
    faceTips().find((tip) => tip.textContent === text);
  const handAngle = (picker: TimepickerUI): number => {
    const match = /rotateZ\((-?[\d.]+)deg\)/.exec(picker.clockHand?.style.transform ?? '');
    return ((Number(match?.[1]) % 360) + 360) % 360;
  };

  it('getValue returns seconds and HH:MM:SS (24h, closed)', () => {
    const picker = create('14:30:15', { clock: { type: '24h', showSeconds: true } });
    expect(picker.getValue()).toEqual(
      expect.objectContaining({
        hour: '14',
        minutes: '30',
        seconds: '15',
        time: '14:30:15',
      }),
    );
  });

  it('reads the seconds field while open and reports seconds on open (12h)', () => {
    const onOpen = jest.fn();
    const picker = create('02:30:15 PM', { clock: { showSeconds: true }, callbacks: { onOpen } });
    picker.open();
    expect(secondsInput().value).toBe('15');
    expect(picker.getValue().time).toBe('02:30:15 PM');
    expect(onOpen).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '02', minutes: '30', seconds: '15', type: 'PM' }),
    );
  });

  it('accepts HH:MM as :00 when showSeconds is on', () => {
    const picker = create('', { clock: { type: '24h', showSeconds: true } });
    picker.setValue('14:30');
    expect(input.value).toBe('14:30:00');
    expect(picker.getValue()).toEqual(expect.objectContaining({ seconds: '00', time: '14:30:00' }));
  });

  it('setValue accepts a 12h value with seconds', () => {
    const picker = create('', { clock: { showSeconds: true } });
    picker.setValue('2:30:15 PM');
    expect(picker.getValue()).toEqual(
      expect.objectContaining({ hour: '02', minutes: '30', seconds: '15', type: 'PM', time: '02:30:15 PM' }),
    );
  });

  it('drops seconds when showSeconds is off', () => {
    const picker = create('', { clock: { type: '24h' } });
    picker.setValue('14:30:15');
    expect(input.value).toBe('14:30');
    expect(picker.getValue()).not.toHaveProperty('seconds');
    expect(picker.getValue()).not.toHaveProperty('degreesSeconds');
  });

  it('keeps open and confirm payloads free of seconds while showSeconds is off', () => {
    const onOpen = jest.fn();
    const onConfirm = jest.fn();
    const picker = create('09:05:07', { clock: { type: '24h' }, callbacks: { onOpen, onConfirm } });
    picker.open();
    (modal().querySelector('.tp-ui-ok-btn') as HTMLElement).click();
    expect(input.value).toBe('09:05');
    expect(onOpen.mock.calls[0][0]).not.toHaveProperty('seconds');
    expect(onConfirm.mock.calls[0][0]).not.toHaveProperty('seconds');
  });

  it('confirm writes HH:MM:SS and emits seconds', () => {
    const onConfirm = jest.fn();
    const picker = create('09:05:07', {
      clock: { type: '24h', showSeconds: true },
      callbacks: { onConfirm },
    });
    picker.open();
    (modal().querySelector('.tp-ui-ok-btn') as HTMLElement).click();
    expect(input.value).toBe('09:05:07');
    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '09', minutes: '05', seconds: '07' }),
    );
  });

  it('keyboard steps seconds by incrementSeconds, emits select:second, announces with labels.second', () => {
    const onSelectSecond = jest.fn();
    const picker = create('10:00:30', {
      clock: { type: '24h', showSeconds: true, incrementSeconds: 15 },
      labels: { second: 'Sekunda' },
      callbacks: { onSelectSecond },
    });
    picker.open();
    press(secondsInput(), 'ArrowUp');
    expect(secondsInput().value).toBe('45');
    expect(secondsInput().getAttribute('aria-valuenow')).toBe('45');
    expect(secondsInput().getAttribute('aria-valuetext')).toBe('45');
    expect(onSelectSecond).toHaveBeenCalledWith({ seconds: '45' });
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);
    expect(modal().querySelector('.timepicker-announcer')?.textContent).toBe('Sekunda: 45');
  });

  it.each([
    ['ArrowDown', '15'],
    ['Home', '00'],
    ['End', '45'],
  ])('%s moves the seconds spinbutton to %s', (key, expected) => {
    const picker = create('10:00:30', { clock: { type: '24h', showSeconds: true, incrementSeconds: 15 } });
    picker.open();
    press(secondsInput(), key);
    expect(secondsInput().value).toBe(expected);
  });

  it('clicking the seconds field shows the seconds face', () => {
    const onSelectSecond = jest.fn();
    const picker = create('10:00:30', {
      clock: { type: '24h', showSeconds: true },
      callbacks: { onSelectSecond },
    });
    picker.open();
    secondsInput().click();
    expect(secondsInput().classList.contains('active')).toBe(true);
    expect(modal().querySelector('.tp-ui-hour')?.classList.contains('active')).toBe(false);
    expect(modal().querySelector('.tp-ui-minutes')?.classList.contains('active')).toBe(false);
    jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
    expect(activeTip()).toBe('30');
    expect(onSelectSecond).toHaveBeenCalledWith({ seconds: '30' });
  });

  it.each<[string, TimepickerOptions['ui']]>([
    ['editable', { editable: true }],
    ['mobile', { mobile: true }],
  ])('clamps a typed out-of-range second on blur (%s, review focus 2)', (_name, ui) => {
    const picker = create('10:00:30', { clock: { type: '24h', showSeconds: true }, ui });
    picker.open();
    secondsInput().value = '75';
    secondsInput().dispatchEvent(new Event('blur'));
    expect(secondsInput().value).toBe('59');
    expect(secondsInput().getAttribute('aria-valuenow')).toBe('59');
  });

  it('setValue while open moves the seconds hand and active tip (review focus 3)', () => {
    const picker = create('10:00:30', { clock: { type: '24h', showSeconds: true } });
    picker.open();
    secondsInput().click();
    picker.setValue('10:00:45');
    jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
    expect(secondsInput().value).toBe('45');
    expect(activeTip()).toBe('45');
    expect(handAngle(picker)).toBe(270);
  });

  it('update() can turn seconds on for the next open (review focus 5)', () => {
    const picker = create('10:00', { clock: { type: '24h' } });
    picker.update({ options: { clock: { showSeconds: true } } });
    picker.open();
    expect(modal().classList.contains('tp-ui-has-seconds')).toBe(true);
    expect(secondsInput().value).toBe('00');
  });

  it('dims disabled seconds on the seconds face without disabling that minute', () => {
    const picker = create('10:00:00', {
      clock: { type: '24h', showSeconds: true, disabledTime: { seconds: [15] } },
    });
    picker.open();
    secondsInput().click();
    expect(tipFor('15')?.classList.contains('tp-ui-tips-disabled')).toBe(true);
    expect(tipFor('20')?.classList.contains('tp-ui-tips-disabled')).toBe(false);
    (modal().querySelector('.tp-ui-minutes') as HTMLElement).click();
    expect(tipFor('15')?.classList.contains('tp-ui-tips-disabled')).toBe(false);
  });

  it('inline autoUpdate writes the seconds', () => {
    const container = document.createElement('div');
    container.id = 'sec-inline';
    document.body.appendChild(container);
    create('10:00:30', {
      clock: { type: '24h', showSeconds: true },
      ui: { inline: { enabled: true, containerId: 'sec-inline', autoUpdate: true } },
    });
    press(secondsInput(container), 'ArrowUp');
    expect(input.value).toBe('10:00:31');
  });

  describe('spinbutton ARIA', () => {
    const ariaOf = (field: string): [string | null, string | null] => {
      const spinbutton = modal().querySelector<HTMLInputElement>(`.tp-ui-${field}`);
      return [
        spinbutton?.getAttribute('aria-valuenow') ?? null,
        spinbutton?.getAttribute('aria-valuetext') ?? null,
      ];
    };
    const spinbuttons = (): Record<string, [string | null, string | null]> => ({
      hour: ariaOf('hour'),
      minutes: ariaOf('minutes'),
      seconds: ariaOf('seconds'),
    });

    it('opens 09:05:07 with numeric aria-valuenow 9/5/7 and displayed aria-valuetext 09/05/07', () => {
      const picker = create('09:05:07', { clock: { type: '24h', showSeconds: true } });

      picker.open();

      expect(spinbuttons()).toEqual({ hour: ['9', '09'], minutes: ['5', '05'], seconds: ['7', '07'] });
    });

    it('setValue 14:30:05 while open sets aria-valuenow 14/30/5 and aria-valuetext 14/30/05', () => {
      const picker = create('10:00:30', { clock: { type: '24h', showSeconds: true } });
      picker.open();

      picker.setValue('14:30:05');

      expect(spinbuttons()).toEqual({ hour: ['14', '14'], minutes: ['30', '30'], seconds: ['5', '05'] });
    });
  });
});
