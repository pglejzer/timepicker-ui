import TimepickerUI from '@/timepicker/TimepickerUI';

type Orientation = 'portrait' | 'landscape';
type ClockType = '12h' | '24h';
type View = 'clock' | 'keyboard';
type MediaListener = (event: MediaQueryListEvent) => void;

interface FakeMediaQueryList {
  readonly media: string;
  readonly matches: boolean;
  onchange: MediaListener | null;
  listeners: MediaListener[];
}

interface Step {
  step: string;
  view: View;
  mobile: boolean;
  expanded: boolean;
}

const SWITCH_BUTTON = '.tp-ui-keyboard-icon-wrapper button.tp-ui-keyboard-icon';

let frames: FrameRequestCallback[] = [];
let landscape = false;
let mediaLists: FakeMediaQueryList[] = [];

const matchesOrientation = (query: string): boolean => {
  if (/orientation:\s*landscape/.test(query)) return landscape;
  if (/orientation:\s*portrait/.test(query)) return !landscape;
  return false;
};

const fakeMatchMedia = (query: string): MediaQueryList => {
  const list: FakeMediaQueryList = {
    media: query,
    get matches(): boolean {
      return matchesOrientation(query);
    },
    onchange: null,
    listeners: [],
  };
  mediaLists.push(list);

  const add = (listener: MediaListener): void => {
    list.listeners.push(listener);
  };
  const remove = (listener: MediaListener): void => {
    list.listeners = list.listeners.filter((candidate) => candidate !== listener);
  };

  return Object.assign(list, {
    addListener: add,
    removeListener: remove,
    addEventListener: (_type: string, listener: MediaListener): void => add(listener),
    removeEventListener: (_type: string, listener: MediaListener): void => remove(listener),
    dispatchEvent: (): boolean => false,
  }) as unknown as MediaQueryList;
};

const rotate = (orientation: Orientation): void => {
  landscape = orientation === 'landscape';
  mediaLists.forEach((list) => {
    const event = { matches: list.matches, media: list.media } as MediaQueryListEvent;
    list.onchange?.(event);
    list.listeners.forEach((listener) => listener(event));
  });
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('orientationchange'));
};

const runAllFrames = (): void => {
  for (let batch = 0; batch < 10 && frames.length > 0; batch++) {
    const due = frames;
    frames = [];
    due.forEach((callback) => callback(performance.now()));
  }
};

const settle = (): void => {
  for (let round = 0; round < 20 && (frames.length > 0 || jest.getTimerCount() > 0); round++) {
    runAllFrames();
    jest.runOnlyPendingTimers();
  }
};

const part = (selector: string): HTMLElement => {
  const element = document.querySelector<HTMLElement>(`.tp-ui-modal ${selector}`);
  if (!element) throw new Error(`${selector} is not rendered`);
  return element;
};

const clickSwitch = (): void => {
  part(SWITCH_BUTTON).click();
  settle();
};

const openDesktopPicker = (clockType: ClockType, seconds: boolean): void => {
  const input = document.createElement('input');
  input.value = clockType === '24h' ? '10:30' : '10:30 AM';
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: clockType, showSeconds: seconds },
    ui: { animation: false, enableSwitchIcon: true, mobile: false },
  });
  picker.create();
  picker.open();
  settle();
};

const CASES = (['12h', '24h'] as ClockType[]).flatMap((clockType) =>
  [false, true].map((seconds) => ({
    clockType,
    seconds,
    secondsLabel: seconds ? 'with seconds' : 'without seconds',
  })),
);

describe('desktop start: the wrapper carries mobile exactly while the keyboard view is shown', () => {
  let realMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    jest.useFakeTimers();
    frames = [];
    landscape = false;
    mediaLists = [];
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
    mediaLists = [];
    window.matchMedia = realMatchMedia;
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each(CASES)(
    'should keep mobile on the keyboard view across collapses and rotations in either orientation ($clockType, $secondsLabel)',
    ({ clockType, seconds }) => {
      const steps: Step[] = [];
      const record = (step: string): void => {
        const wrapper = part('.tp-ui-wrapper');
        steps.push({
          step,
          view: part('.tp-ui-header').classList.contains('mobile') ? 'keyboard' : 'clock',
          mobile: wrapper.classList.contains('mobile'),
          expanded: wrapper.classList.contains('expanded'),
        });
      };

      rotate('portrait');
      openDesktopPicker(clockType, seconds);
      record('opened in portrait');

      clickSwitch();
      record('collapsed in portrait');

      rotate('landscape');
      settle();
      record('rotated to landscape');

      clickSwitch();
      record('expanded in landscape');

      clickSwitch();
      record('collapsed in landscape');

      rotate('portrait');
      settle();
      record('rotated to portrait');

      clickSwitch();
      record('expanded in portrait');

      const keyboard = { view: 'keyboard', mobile: true, expanded: false };
      const clock = { view: 'clock', mobile: false, expanded: true };
      expect(steps).toEqual([
        { step: 'opened in portrait', ...clock },
        { step: 'collapsed in portrait', ...keyboard },
        { step: 'rotated to landscape', ...keyboard },
        { step: 'expanded in landscape', ...clock },
        { step: 'collapsed in landscape', ...keyboard },
        { step: 'rotated to portrait', ...keyboard },
        { step: 'expanded in portrait', ...clock },
      ]);
    },
  );
});
