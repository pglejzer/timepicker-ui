import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import { TimezonePlugin } from '@/plugins/timezone';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

type Orientation = 'portrait' | 'landscape';
type Origin = 'desktop' | 'mobile';
type Mode = 'plain' | 'range' | 'timezone';
type ClockType = '12h' | '24h';

interface PickerSetup {
  origin: Origin;
  mode: Mode;
  clockType: ClockType;
  seconds: boolean;
  animation?: boolean;
}

interface ViewExpectation {
  clockShown: boolean;
  seconds: boolean;
  clockType: ClockType;
  wrapperMobile?: boolean;
}

const LABELS = {
  time: 'Wybierz godzinę',
  mobileTime: 'Wpisz godzinę',
  switchToKeyboardLabel: 'Pokaż klawiaturę',
  switchToClockLabel: 'Pokaż zegar',
  hourLabel: 'Godzina (zegar)',
  mobileHour: 'Godzina',
  minuteLabel: 'Minuta (zegar)',
  mobileMinute: 'Minuta',
  second: 'Sekunda',
};

const SWITCH_BUTTON = '.tp-ui-keyboard-icon-wrapper button.tp-ui-keyboard-icon';
const FIELDS = ['input.tp-ui-hour', 'input.tp-ui-minutes', 'input[name="seconds"].tp-ui-seconds'];
const FIELD_LABELS = {
  clock: [LABELS.hourLabel, LABELS.minuteLabel, LABELS.second],
  keyboard: [LABELS.mobileHour, LABELS.mobileMinute, LABELS.second],
};
const CAPTIONS = ['.tp-ui-hour-text', '.tp-ui-minute-text', '.tp-ui-second-text'];
const NO_INLINE_STYLE = { width: '', height: '', opacity: '', transform: '' };
const VIEW_SWITCHING = 'tp-ui-view-switching';
const SWITCHES = 4;

const MODE_OPTIONS: Record<Mode, TimepickerOptions> = {
  plain: {},
  range: { range: { enabled: true } },
  timezone: { timezone: { enabled: true, whitelist: ['Europe/Warsaw', 'Europe/London'] } },
};

const DIRECTIONS: Array<{ direction: string; origin: Origin }> = [
  { direction: 'clock to keyboard', origin: 'desktop' },
  { direction: 'keyboard to clock', origin: 'mobile' },
];

const ORIGINS: Origin[] = ['desktop', 'mobile'];
const MODES: Mode[] = ['plain', 'range', 'timezone'];
const CLOCK_TYPES: ClockType[] = ['12h', '24h'];
const ORIENTATIONS: Orientation[] = ['portrait', 'landscape'];
const SECONDS_CASES = [
  { seconds: true, secondsLabel: 'with seconds' },
  { seconds: false, secondsLabel: 'without seconds' },
];

let frames: FrameRequestCallback[] = [];
let landscape = false;
let reducedMotion = false;

const setOrientation = (orientation: Orientation): void => {
  landscape = orientation === 'landscape';
};

const otherOrientation = (orientation: Orientation): Orientation =>
  orientation === 'portrait' ? 'landscape' : 'portrait';

const matchesQuery = (query: string): boolean => {
  if (/prefers-reduced-motion:\s*reduce/.test(query)) return reducedMotion;
  if (/orientation:\s*landscape/.test(query)) return landscape;
  if (/orientation:\s*portrait/.test(query)) return !landscape;
  return false;
};

const fakeMatchMedia = (query: string): MediaQueryList =>
  ({
    matches: matchesQuery(query),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;

const runFrame = (): void => {
  const due = frames;
  frames = [];
  due.forEach((callback) => callback(performance.now()));
};

const runAllFrames = (): void => {
  for (let batch = 0; batch < 10 && frames.length > 0; batch++) {
    runFrame();
  }
};

const settle = (): void => {
  for (let round = 0; round < 20 && (frames.length > 0 || jest.getTimerCount() > 0); round++) {
    runAllFrames();
    jest.runOnlyPendingTimers();
  }
};

const modal = (): HTMLElement => {
  const element = document.querySelector<HTMLElement>('.tp-ui-modal');
  if (!element) throw new Error('the picker modal is not open');
  return element;
};

const part = <T extends Element = HTMLElement>(selector: string): T => {
  const element = modal().querySelector<T>(selector);
  if (!element) throw new Error(`${selector} is not rendered`);
  return element;
};

const rendered = (selectors: string[]): string[] =>
  selectors.filter((selector) => modal().querySelector(selector) !== null);

const hasClass = (selector: string, className: string): boolean => part(selector).classList.contains(className);

const inlineStyle = (selector: string): typeof NO_INLINE_STYLE => {
  const { style } = part(selector);
  return { width: style.width, height: style.height, opacity: style.opacity, transform: style.transform };
};

const isSwitching = (): boolean => modal().classList.contains(VIEW_SWITCHING);

const clockFaceState = (): { scaledIn: boolean; tabIndex: number } => {
  const face = part('.tp-ui-clock-face');
  return { scaledIn: face.classList.contains('scale-in'), tabIndex: face.tabIndex };
};

const clickSwitch = (): void => {
  part<HTMLButtonElement>(SWITCH_BUTTON).click();
};

const inputValueFor = ({ mode, clockType }: PickerSetup): string => {
  if (mode === 'range') return '';
  return clockType === '24h' ? '10:30' : '10:30 AM';
};

const createPicker = (setup: PickerSetup): TimepickerUI => {
  const input = document.createElement('input');
  input.value = inputValueFor(setup);
  document.body.appendChild(input);

  const picker = new TimepickerUI(input, {
    ...MODE_OPTIONS[setup.mode],
    clock: { type: setup.clockType, showSeconds: setup.seconds },
    ui: { animation: setup.animation ?? false, enableSwitchIcon: true, mobile: setup.origin === 'mobile' },
    labels: LABELS,
  });
  picker.create();
  return picker;
};

const openPicker = (setup: PickerSetup): TimepickerUI => {
  const picker = createPicker(setup);
  picker.open();
  settle();
  return picker;
};

const wrapperMobileFor = (
  origin: Origin,
  clockShown: boolean,
  collapsedInLandscape: boolean,
): boolean | undefined => {
  if (clockShown) return false;
  if (origin === 'mobile' || collapsedInLandscape) return true;
  return undefined;
};

const readView = (clockType: ClockType) => ({
  hasSecondsClass: modal().classList.contains('tp-ui-has-seconds'),
  wrapper: {
    expanded: hasClass('.tp-ui-wrapper', 'expanded'),
    mobile: hasClass('.tp-ui-wrapper', 'mobile'),
    inline: inlineStyle('.tp-ui-wrapper'),
  },
  clockWrapper: {
    expanded: hasClass('.tp-ui-mobile-clock-wrapper', 'expanded'),
    mobile: hasClass('.tp-ui-mobile-clock-wrapper', 'mobile'),
    inline: inlineStyle('.tp-ui-mobile-clock-wrapper'),
  },
  fields: rendered(FIELDS).map((selector) => {
    const field = part<HTMLInputElement>(selector);
    return {
      field: selector,
      mobile: field.classList.contains('mobile'),
      expanded: field.classList.contains('expanded'),
      readonly: field.hasAttribute('readonly'),
      label: field.getAttribute('aria-label'),
    };
  }),
  captions: rendered(CAPTIONS).map((selector) => ({ caption: selector, mobile: hasClass(selector, 'mobile') })),
  headerMobile: hasClass('.tp-ui-header', 'mobile'),
  periodMobile: clockType === '12h' ? hasClass('.tp-ui-wrapper-type-time', 'mobile') : null,
  heading: part('.tp-ui-select-time').textContent,
  switchLabel: part(SWITCH_BUTTON).getAttribute('aria-label'),
  clockFaceHidden: part('.tp-ui-clock-face').getAttribute('aria-hidden') === 'true',
});

const expectedView = (
  picker: TimepickerUI,
  { clockShown, seconds, clockType, wrapperMobile }: ViewExpectation,
): ReturnType<typeof readView> => {
  const keyboardShown = !clockShown;
  const readonly = clockShown && !picker.options.ui.editable;
  const shownParts = seconds ? 3 : 2;

  return {
    hasSecondsClass: seconds,
    wrapper: {
      expanded: clockShown,
      mobile: wrapperMobile ?? expect.any(Boolean),
      inline: NO_INLINE_STYLE,
    },
    clockWrapper: {
      expanded: clockShown,
      mobile: clockShown ? false : expect.any(Boolean),
      inline: NO_INLINE_STYLE,
    },
    fields: FIELDS.slice(0, shownParts).map((selector, index) => ({
      field: selector,
      mobile: keyboardShown,
      expanded: clockShown,
      readonly,
      label: FIELD_LABELS[clockShown ? 'clock' : 'keyboard'][index],
    })),
    captions: CAPTIONS.slice(0, shownParts).map((selector) => ({ caption: selector, mobile: keyboardShown })),
    headerMobile: keyboardShown,
    periodMobile: clockType === '12h' ? keyboardShown : null,
    heading: clockShown ? LABELS.time : LABELS.mobileTime,
    switchLabel: clockShown ? LABELS.switchToKeyboardLabel : LABELS.switchToClockLabel,
    clockFaceHidden: keyboardShown,
  };
};

const expectView = (picker: TimepickerUI, expectation: ViewExpectation): void => {
  expect(readView(expectation.clockType)).toEqual(expectedView(picker, expectation));
};

describe('mobile and landscape view switching', () => {
  let realMatchMedia: typeof window.matchMedia;

  beforeAll(() => {
    PluginRegistry.register(RangePlugin);
    PluginRegistry.register(TimezonePlugin);
  });

  beforeEach(() => {
    jest.useFakeTimers();
    frames = [];
    landscape = false;
    reducedMotion = false;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    realMatchMedia = window.matchMedia;
    window.matchMedia = fakeMatchMedia;
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    frames = [];
    window.matchMedia = realMatchMedia;
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('repeated switches between the clock and keyboard views', () => {
    const ORIENTATION_PLANS: Array<{ plan: string; orientationAt: (index: number) => Orientation }> = [
      { plan: 'portrait', orientationAt: (): Orientation => 'portrait' },
      { plan: 'landscape', orientationAt: (): Orientation => 'landscape' },
      {
        plan: 'rotated between switches, first switch in portrait',
        orientationAt: (index: number): Orientation => (index % 2 === 0 ? 'portrait' : 'landscape'),
      },
      {
        plan: 'rotated between switches, first switch in landscape',
        orientationAt: (index: number): Orientation => (index % 2 === 0 ? 'landscape' : 'portrait'),
      },
    ];

    const CASES = ORIENTATION_PLANS.flatMap((plan) =>
      ORIGINS.flatMap((origin) =>
        MODES.flatMap((mode) =>
          CLOCK_TYPES.flatMap((clockType) =>
            SECONDS_CASES.map((secondsCase) => ({ ...plan, origin, mode, clockType, ...secondsCase })),
          ),
        ),
      ),
    );

    it.each(CASES)(
      'should settle every switch into a consistent view with no inline size and a free switch ($origin start, $plan, $mode, $clockType, $secondsLabel)',
      ({ orientationAt, origin, mode, clockType, seconds }) => {
        setOrientation(orientationAt(0));
        const picker = openPicker({ origin, mode, clockType, seconds });
        let clockShown = origin === 'desktop';

        expectView(picker, {
          clockShown,
          seconds,
          clockType,
          wrapperMobile: wrapperMobileFor(origin, clockShown, false),
        });

        for (let index = 0; index < SWITCHES; index++) {
          const orientation = orientationAt(index);
          setOrientation(orientation);

          clickSwitch();
          settle();
          clockShown = !clockShown;

          expectView(picker, {
            clockShown,
            seconds,
            clockType,
            wrapperMobile: wrapperMobileFor(origin, clockShown, orientation === 'landscape'),
          });
        }
      },
    );
  });

  describe('interrupted switches', () => {
    const MOMENTS: Record<Orientation, Array<{ moment: string; reach: () => void }>> = {
      portrait: [
        { moment: 'right after the click', reach: () => undefined },
        { moment: 'after the first animation frame', reach: runFrame },
        {
          moment: 'just before the animation ends',
          reach: () => {
            runAllFrames();
            jest.advanceTimersByTime(TIMINGS.MOBILE_TOGGLE - 1);
          },
        },
      ],
      landscape: [
        { moment: 'right after the click', reach: () => undefined },
        {
          moment: 'just before the wrapper transition ends',
          reach: () => jest.advanceTimersByTime(TIMINGS.WRAPPER_TRANSITION - 1),
        },
      ],
    };

    const casesFor = (orientations: Orientation[]) =>
      DIRECTIONS.flatMap((direction) =>
        orientations.flatMap((orientation) =>
          MOMENTS[orientation].flatMap((moment) =>
            SECONDS_CASES.map((secondsCase) => ({ ...direction, orientation, ...moment, ...secondsCase })),
          ),
        ),
      );

    it.each(casesFor(['portrait']))(
      'should ignore a click $moment and finish the running portrait switch cleanly ($direction, $secondsLabel)',
      ({ origin, reach, seconds }) => {
        setOrientation('portrait');
        const picker = openPicker({ origin, mode: 'plain', clockType: '12h', seconds });
        const startsOnClock = origin === 'desktop';

        clickSwitch();
        reach();
        clickSwitch();
        settle();

        expectView(picker, {
          clockShown: !startsOnClock,
          seconds,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, !startsOnClock, false),
        });

        clickSwitch();
        settle();

        expectView(picker, {
          clockShown: startsOnClock,
          seconds,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, startsOnClock, false),
        });
      },
    );

    it.each(casesFor(['landscape']))(
      'should ignore a click $moment while the landscape transition runs and finish it cleanly ($direction, $secondsLabel)',
      ({ origin, reach, seconds }) => {
        setOrientation('landscape');
        const picker = openPicker({ origin, mode: 'plain', clockType: '12h', seconds, animation: true });
        const startsOnClock = origin === 'desktop';
        const switched: ViewExpectation = {
          clockShown: !startsOnClock,
          seconds,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, !startsOnClock, true),
        };

        clickSwitch();
        reach();

        expect(isSwitching()).toBe(true);
        expectView(picker, switched);

        clickSwitch();

        expect(isSwitching()).toBe(true);
        expectView(picker, switched);

        settle();

        expect(isSwitching()).toBe(false);
        expectView(picker, switched);

        clickSwitch();
        settle();

        expect(isSwitching()).toBe(false);
        expectView(picker, {
          clockShown: startsOnClock,
          seconds,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, startsOnClock, true),
        });
      },
    );

    it.each(casesFor(ORIENTATIONS))(
      'should finish the running switch with no inline size when the device rotates $moment ($direction, rotated from $orientation, $secondsLabel)',
      ({ origin, orientation, reach, seconds }) => {
        const rotated = otherOrientation(orientation);
        setOrientation(orientation);
        const picker = openPicker({ origin, mode: 'plain', clockType: '12h', seconds, animation: true });
        const startsOnClock = origin === 'desktop';

        clickSwitch();
        reach();
        setOrientation(rotated);
        settle();

        expect(isSwitching()).toBe(false);
        expectView(picker, {
          clockShown: !startsOnClock,
          seconds,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, !startsOnClock, orientation === 'landscape'),
        });

        clickSwitch();
        settle();

        expect(isSwitching()).toBe(false);
        expectView(picker, {
          clockShown: startsOnClock,
          seconds,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, startsOnClock, rotated === 'landscape'),
        });
      },
    );
  });

  describe('landscape switches apply the final view in the same call', () => {
    const CASES = ORIGINS.flatMap((origin) =>
      CLOCK_TYPES.flatMap((clockType) =>
        SECONDS_CASES.map((secondsCase) => ({ origin, clockType, ...secondsCase })),
      ),
    );

    const expectLandscapeView = (picker: TimepickerUI, expectation: ViewExpectation): void => {
      expectView(picker, expectation);
      expect(clockFaceState()).toEqual({
        scaledIn: expectation.clockShown,
        tabIndex: expectation.clockShown ? 0 : -1,
      });
    };

    it.each(CASES)(
      'should switch both ways right away without waiting for a frame or a timer ($origin start, $clockType, $secondsLabel)',
      ({ origin, clockType, seconds }) => {
        setOrientation('landscape');
        const picker = openPicker({ origin, mode: 'plain', clockType, seconds });
        const startsOnClock = origin === 'desktop';
        const onSelectHour = jest.fn();
        picker.on('select:hour', onSelectHour);
        const switched: ViewExpectation = {
          clockShown: !startsOnClock,
          seconds,
          clockType,
          wrapperMobile: wrapperMobileFor(origin, !startsOnClock, true),
        };
        const switchedBack: ViewExpectation = {
          clockShown: startsOnClock,
          seconds,
          clockType,
          wrapperMobile: wrapperMobileFor(origin, startsOnClock, true),
        };

        clickSwitch();

        expect(frames).toHaveLength(0);
        expect(isSwitching()).toBe(false);
        expectLandscapeView(picker, switched);
        expect(onSelectHour).toHaveBeenCalledTimes(startsOnClock ? 0 : 1);

        clickSwitch();

        expect(frames).toHaveLength(0);
        expect(isSwitching()).toBe(false);
        expectLandscapeView(picker, switchedBack);
        expect(onSelectHour).toHaveBeenCalledTimes(1);
        expect(onSelectHour).toHaveBeenCalledWith({ hour: '10' });

        settle();

        expectLandscapeView(picker, switchedBack);
      },
    );
  });

  describe('landscape transition lock', () => {
    const LOCK_CASES = DIRECTIONS.flatMap((direction) =>
      SECONDS_CASES.map((secondsCase) => ({ ...direction, ...secondsCase })),
    );

    it.each(LOCK_CASES)(
      'should mark the modal as switching for the wrapper transition and release the lock when it ends ($direction, $secondsLabel)',
      ({ origin, seconds }) => {
        setOrientation('landscape');
        const picker = openPicker({ origin, mode: 'plain', clockType: '12h', seconds, animation: true });
        const startsOnClock = origin === 'desktop';
        const switched: ViewExpectation = {
          clockShown: !startsOnClock,
          seconds,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, !startsOnClock, true),
        };
        const switchedBack: ViewExpectation = {
          clockShown: startsOnClock,
          seconds,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, startsOnClock, true),
        };

        clickSwitch();

        expect(frames).toHaveLength(0);
        expect(isSwitching()).toBe(true);
        expectView(picker, switched);

        jest.advanceTimersByTime(TIMINGS.WRAPPER_TRANSITION - 1);
        clickSwitch();

        expect(isSwitching()).toBe(true);
        expectView(picker, switched);

        jest.advanceTimersByTime(1);

        expect(isSwitching()).toBe(false);
        expectView(picker, switched);

        clickSwitch();

        expect(isSwitching()).toBe(true);
        expectView(picker, switchedBack);

        jest.advanceTimersByTime(TIMINGS.WRAPPER_TRANSITION);

        expect(isSwitching()).toBe(false);
        expectView(picker, switchedBack);
      },
    );

    const NO_MOTION_CASES = [
      { motion: 'reduced motion', animation: true, prefersReduced: true },
      { motion: 'ui.animation off', animation: false, prefersReduced: false },
    ].flatMap((motionCase) => DIRECTIONS.map((direction) => ({ ...motionCase, ...direction })));

    it.each(NO_MOTION_CASES)(
      'should switch at once without the switching class and take the next switch immediately under $motion ($direction)',
      ({ animation, prefersReduced, origin }) => {
        reducedMotion = prefersReduced;
        setOrientation('landscape');
        const picker = openPicker({ origin, mode: 'plain', clockType: '12h', seconds: false, animation });
        const startsOnClock = origin === 'desktop';
        const switchedBack: ViewExpectation = {
          clockShown: startsOnClock,
          seconds: false,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, startsOnClock, true),
        };

        clickSwitch();

        expect(frames).toHaveLength(0);
        expect(isSwitching()).toBe(false);
        expectView(picker, {
          clockShown: !startsOnClock,
          seconds: false,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, !startsOnClock, true),
        });

        clickSwitch();

        expect(isSwitching()).toBe(false);
        expectView(picker, switchedBack);

        settle();

        expect(isSwitching()).toBe(false);
        expectView(picker, switchedBack);
      },
    );

    it.each(DIRECTIONS)(
      'should never mark the modal as switching in portrait even with animation on ($direction)',
      ({ origin }) => {
        setOrientation('portrait');
        const picker = openPicker({ origin, mode: 'plain', clockType: '12h', seconds: false, animation: true });
        const startsOnClock = origin === 'desktop';

        clickSwitch();
        expect(isSwitching()).toBe(false);

        runFrame();
        expect(isSwitching()).toBe(false);

        runAllFrames();
        jest.advanceTimersByTime(TIMINGS.MOBILE_TOGGLE - 1);
        expect(isSwitching()).toBe(false);

        settle();
        expect(isSwitching()).toBe(false);
        expectView(picker, {
          clockShown: !startsOnClock,
          seconds: false,
          clockType: '12h',
          wrapperMobile: wrapperMobileFor(origin, !startsOnClock, false),
        });
      },
    );
  });

  describe('ui.mobile toggled between opens', () => {
    const openSwitchAndClose = (picker: TimepickerUI, mobile: boolean, seconds: boolean): void => {
      const origin: Origin = mobile ? 'mobile' : 'desktop';

      picker.update({ options: { ui: { mobile } } });
      picker.open();
      settle();

      expect(document.querySelectorAll('.tp-ui-modal')).toHaveLength(1);
      expect(modal().classList.contains('mobile')).toBe(mobile);
      expectView(picker, {
        clockShown: !mobile,
        seconds,
        clockType: '24h',
        wrapperMobile: wrapperMobileFor(origin, !mobile, false),
      });

      clickSwitch();
      settle();

      expectView(picker, {
        clockShown: mobile,
        seconds,
        clockType: '24h',
        wrapperMobile: wrapperMobileFor(origin, mobile, false),
      });

      picker.close();
      settle();

      expect(document.querySelector('.tp-ui-modal')).toBeNull();
    };

    it.each(SECONDS_CASES)(
      'should open in the view of the current ui.mobile with nothing carried over from the previous open ($secondsLabel)',
      ({ seconds }) => {
        const picker = createPicker({ origin: 'mobile', mode: 'plain', clockType: '24h', seconds });

        openSwitchAndClose(picker, true, seconds);
        openSwitchAndClose(picker, false, seconds);
        openSwitchAndClose(picker, false, seconds);
        openSwitchAndClose(picker, true, seconds);
      },
    );

    it.each(SECONDS_CASES)(
      'should reopen clean and switchable after closing in the middle of a landscape switch, untouched by the stale transition timer ($secondsLabel)',
      ({ seconds }) => {
        setOrientation('landscape');
        const picker = openPicker({ origin: 'desktop', mode: 'plain', clockType: '24h', seconds, animation: true });
        const collapsed: ViewExpectation = { clockShown: false, seconds, clockType: '24h', wrapperMobile: true };
        const expanded: ViewExpectation = { clockShown: true, seconds, clockType: '24h', wrapperMobile: false };

        clickSwitch();

        expect(isSwitching()).toBe(true);

        picker.close();
        jest.advanceTimersByTime(TIMINGS.MODAL_EXIT);

        expect(document.querySelector('.tp-ui-modal')).toBeNull();

        picker.open();
        runAllFrames();

        expect(document.querySelectorAll('.tp-ui-modal')).toHaveLength(1);
        expect(isSwitching()).toBe(false);
        expectView(picker, expanded);

        clickSwitch();

        expect(isSwitching()).toBe(true);
        expectView(picker, collapsed);

        jest.advanceTimersByTime(TIMINGS.WRAPPER_TRANSITION - TIMINGS.MODAL_EXIT);
        clickSwitch();

        expect(isSwitching()).toBe(true);
        expectView(picker, collapsed);

        jest.advanceTimersByTime(TIMINGS.MODAL_EXIT);

        expect(isSwitching()).toBe(false);
        expectView(picker, collapsed);

        clickSwitch();
        settle();

        expect(isSwitching()).toBe(false);
        expectView(picker, expanded);
      },
    );
  });
});
