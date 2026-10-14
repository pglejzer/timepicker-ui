import TimepickerUI from '@/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

describe('switch-view icon keeps localized labels (bug #7)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  const SWITCH_BUTTON = '.tp-ui-modal .tp-ui-keyboard-icon-wrapper button.tp-ui-keyboard-icon';
  const switchButton = (): HTMLButtonElement => document.querySelector(SWITCH_BUTTON) as HTMLButtonElement;

  it('uses switchToClockLabel after switching to the keyboard view and switchToKeyboardLabel back', () => {
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false, enableSwitchIcon: true },
      labels: { switchToClockLabel: 'Pokaż zegar', switchToKeyboardLabel: 'Pokaż klawiaturę' },
    });
    picker.create();
    picker.open();
    switchButton().click();
    expect(switchButton().getAttribute('aria-label')).toBe('Pokaż zegar');
    jest.advanceTimersByTime(1000);
    switchButton().click();
    expect(switchButton().getAttribute('aria-label')).toBe('Pokaż klawiaturę');
  });
});

describe('time fields are named with the labels of the view that shows them', () => {
  type ClockType = '12h' | '24h';
  type View = 'clock' | 'keyboard';

  interface PickerSetup {
    clockType?: ClockType;
    seconds?: boolean;
    ui?: TimepickerOptions['ui'];
    labels?: TimepickerOptions['labels'];
  }

  const LABELS = {
    hourLabel: 'Godzina (zegar)',
    mobileHour: 'Godzina',
    minuteLabel: 'Minuta (zegar)',
    mobileMinute: 'Minuta',
    second: 'Sekunda',
  };

  const VIEW_LABELS: Record<View, string[]> = {
    clock: [LABELS.hourLabel, LABELS.minuteLabel, LABELS.second],
    keyboard: [LABELS.mobileHour, LABELS.mobileMinute, LABELS.second],
  };

  const FIELDS = ['.tp-ui-hour', '.tp-ui-minutes', '.tp-ui-seconds'];
  const CAPTIONS = ['.tp-ui-hour-text', '.tp-ui-minute-text', '.tp-ui-second-text'];
  const VIEW_SWITCH = '.tp-ui-keyboard-icon-wrapper button.tp-ui-keyboard-icon';
  const SPINBUTTON_ATTRIBUTES = ['role', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'];
  const DIAL_ATTRIBUTES = ['aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'];

  const CASES = (['24h', '12h'] as ClockType[]).flatMap((clockType) =>
    [false, true].map((seconds) => ({
      clockType,
      seconds,
      secondsLabel: seconds ? 'with seconds' : 'without seconds',
    })),
  );

  const modal = (): HTMLElement => {
    const element = document.querySelector<HTMLElement>('.tp-ui-modal');
    if (!element) throw new Error('the picker modal is not open');
    return element;
  };

  const rendered = (selectors: string[]): Element[] =>
    selectors.flatMap((selector) => {
      const element = modal().querySelector(selector);
      return element ? [element] : [];
    });

  const field = (selector: string): Element => {
    const [element] = rendered([selector]);
    if (!element) throw new Error(`${selector} is not rendered`);
    return element;
  };

  const labelsFor = (view: View, seconds: boolean): string[] => VIEW_LABELS[view].slice(0, seconds ? 3 : 2);

  const readView = (): { view: View; labels: Array<string | null> } => ({
    view: field('.tp-ui-wrapper').classList.contains('expanded') ? 'clock' : 'keyboard',
    labels: rendered(FIELDS).map((input) => input.getAttribute('aria-label')),
  });

  const captionTexts = (): Array<string | null> => rendered(CAPTIONS).map((caption) => caption.textContent);

  const readSpinbuttons = (): Array<Record<string, string | null>> =>
    rendered(FIELDS).map((input) =>
      Object.fromEntries(SPINBUTTON_ATTRIBUTES.map((name) => [name, input.getAttribute(name)])),
    );

  const readReadonly = (): boolean[] => rendered(FIELDS).map((input) => input.hasAttribute('readonly'));

  const sliderState = (element: Element): Record<string, string | null> =>
    Object.fromEntries(DIAL_ATTRIBUTES.map((name) => [name, element.getAttribute(name)]));

  const expectDialToMirrorHour = (view: View): void => {
    const hour = field('.tp-ui-hour');

    expect(readView().view).toBe(view);
    expect(modal().querySelector('input.active') ?? hour).toBe(hour);
    expect(sliderState(hour)).toEqual({
      'aria-label': VIEW_LABELS[view][0],
      'aria-valuemin': '0',
      'aria-valuemax': '23',
      'aria-valuenow': '10',
      'aria-valuetext': '10',
    });
    expect(sliderState(field('.tp-ui-clock-face'))).toEqual(sliderState(hour));
  };

  const openPicker = ({
    clockType = '24h',
    seconds = false,
    ui = {},
    labels = LABELS,
  }: PickerSetup = {}): void => {
    const input = document.createElement('input');
    input.value = clockType === '24h' ? '10:30' : '10:30 AM';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: clockType, showSeconds: seconds },
      ui: { animation: false, enableSwitchIcon: true, ...ui },
      labels,
    });
    picker.create();
    picker.open();
  };

  const clickSwitch = (): void => {
    (field(VIEW_SWITCH) as HTMLButtonElement).click();
    jest.advanceTimersByTime(TIMINGS.MOBILE_TOGGLE);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each(CASES)(
    'names the fields with the clock labels, then the keyboard labels shown in the captions, then the clock labels again ($clockType, $secondsLabel)',
    ({ clockType, seconds }) => {
      openPicker({ clockType, seconds });

      expect(readView()).toEqual({ view: 'clock', labels: labelsFor('clock', seconds) });

      clickSwitch();

      expect(readView()).toEqual({ view: 'keyboard', labels: labelsFor('keyboard', seconds) });
      expect(readView().labels).toEqual(captionTexts());

      clickSwitch();

      expect(readView()).toEqual({ view: 'clock', labels: labelsFor('clock', seconds) });
    },
  );

  it.each(CASES)(
    'starts a ui.mobile picker on the keyboard labels and follows every switch ($clockType, $secondsLabel)',
    ({ clockType, seconds }) => {
      openPicker({ clockType, seconds, ui: { mobile: true } });

      expect(readView()).toEqual({ view: 'keyboard', labels: labelsFor('keyboard', seconds) });
      expect(readView().labels).toEqual(captionTexts());

      clickSwitch();

      expect(readView()).toEqual({ view: 'clock', labels: labelsFor('clock', seconds) });

      clickSwitch();

      expect(readView()).toEqual({ view: 'keyboard', labels: labelsFor('keyboard', seconds) });
    },
  );

  it.each([
    { editable: false, clockReadonly: true },
    { editable: true, clockReadonly: false },
  ])(
    'keeps role and aria-value* across a round trip while readonly follows ui.editable (editable: $editable)',
    ({ editable, clockReadonly }) => {
      openPicker({ seconds: true, ui: { editable } });
      const spinbuttons = readSpinbuttons();

      expect(spinbuttons).toEqual([
        expect.objectContaining({
          role: 'spinbutton',
          'aria-valuemin': '0',
          'aria-valuemax': '23',
          'aria-valuenow': expect.any(String),
        }),
        expect.objectContaining({
          role: 'spinbutton',
          'aria-valuemin': '0',
          'aria-valuemax': '59',
          'aria-valuenow': expect.any(String),
        }),
        expect.objectContaining({ role: 'spinbutton', 'aria-valuemin': '0', 'aria-valuemax': '59' }),
      ]);
      expect(readReadonly()).toEqual([clockReadonly, clockReadonly, clockReadonly]);

      clickSwitch();

      expect(readView().view).toBe('keyboard');
      expect(readSpinbuttons()).toEqual(spinbuttons);
      expect(readReadonly()).toEqual([false, false, false]);

      clickSwitch();

      expect(readView().view).toBe('clock');
      expect(readSpinbuttons()).toEqual(spinbuttons);
      expect(readReadonly()).toEqual([clockReadonly, clockReadonly, clockReadonly]);
    },
  );

  it.each([
    { start: 'desktop', ui: {}, views: ['clock', 'keyboard', 'clock'] as View[] },
    { start: 'ui.mobile', ui: { mobile: true }, views: ['keyboard', 'clock', 'keyboard'] as View[] },
  ])(
    "mirrors the active hour field's name and value on the clock dial on open and after every switch ($start start)",
    ({ ui, views: [openedView, ...switchedViews] }) => {
      openPicker({ ui });

      expectDialToMirrorHour(openedView);

      switchedViews.forEach((view) => {
        clickSwitch();
        expectDialToMirrorHour(view);
      });
    },
  );

  it('removes the aria-label of a field whose keyboard label is empty and restores the clock label', () => {
    openPicker({ labels: { ...LABELS, mobileHour: '' } });

    expect(field('.tp-ui-hour')).toHaveAttribute('aria-label', LABELS.hourLabel);

    clickSwitch();

    expect(readView().view).toBe('keyboard');
    expect(field('.tp-ui-hour')).not.toHaveAttribute('aria-label');
    expect(field('.tp-ui-minutes')).toHaveAttribute('aria-label', LABELS.mobileMinute);

    clickSwitch();

    expect(readView().view).toBe('clock');
    expect(field('.tp-ui-hour')).toHaveAttribute('aria-label', LABELS.hourLabel);
  });
});
