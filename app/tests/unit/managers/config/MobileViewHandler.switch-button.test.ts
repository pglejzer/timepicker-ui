import TimepickerUI from '@/timepicker/TimepickerUI';
import type { TimepickerOptions } from '@/types/options';

const LABELS = { switchToKeyboardLabel: 'Pokaż klawiaturę', switchToClockLabel: 'Pokaż zegar' };
const KEYBOARD_ICON = '<span class="custom-keyboard-icon">K</span>';
const CLOCK_ICON = '<span class="custom-clock-icon">C</span>';
const FOCUSABLE = 'button, input, select, textarea, a[href], [tabindex], [contenteditable="true"]';

type UiOptions = NonNullable<TimepickerOptions['ui']>;

interface ViewCase {
  view: string;
  ui: UiOptions;
  startsOnClockFace: boolean;
}

const VIEWS: ViewCase[] = [
  { view: 'desktop', ui: {}, startsOnClockFace: true },
  { view: 'mobile', ui: { mobile: true }, startsOnClockFace: false },
];

const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;
const control = (): HTMLElement => modal().querySelector('.tp-ui-keyboard-icon-wrapper') as HTMLElement;
const switchButton = (): HTMLButtonElement | null => control().querySelector('button.tp-ui-keyboard-icon');
const isClockFaceShown = (): boolean =>
  (modal().querySelector('.tp-ui-wrapper') as HTMLElement).classList.contains('expanded');
const labelFor = (clockFaceShown: boolean): string =>
  clockFaceShown ? LABELS.switchToKeyboardLabel : LABELS.switchToClockLabel;
const iconFor = (clockFaceShown: boolean): string =>
  clockFaceShown ? '.custom-keyboard-icon' : '.custom-clock-icon';

const isFocusable = (element: Element): boolean =>
  element.matches(FOCUSABLE) &&
  element.getAttribute('tabindex') !== '-1' &&
  !element.hasAttribute('disabled');

const openPicker = (ui: UiOptions = {}): TimepickerUI => {
  const input = document.createElement('input');
  input.value = '10:30';
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h' },
    ui: { animation: false, enableSwitchIcon: true, ...ui },
    labels: LABELS,
  });
  picker.create();
  picker.open();
  return picker;
};

const settle = (): void => {
  jest.advanceTimersByTime(1000);
};

const clickSwitch = (): void => {
  const button = switchButton();
  expect(button).not.toBeNull();
  button?.click();
  settle();
};

describe('view-switch control is one native button whose label names the action', () => {
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

  describe.each(VIEWS)('$view', ({ ui, startsOnClockFace }) => {
    it('should expose exactly one focusable element: the native switch button', () => {
      openPicker(ui);
      const wrapper = control();

      const focusables = [wrapper, ...wrapper.querySelectorAll('*')].filter(isFocusable);

      expect(focusables).toHaveLength(1);
      expect(focusables[0]).toBe(switchButton());
      expect(switchButton()).toHaveAttribute('type', 'button');
    });

    it('should keep the wrapper a plain ripple host without role, tabindex, name or pressed state', () => {
      openPicker(ui);
      const wrapper = control();

      expect(wrapper).not.toHaveAttribute('role');
      expect(wrapper).not.toHaveAttribute('tabindex');
      expect(wrapper).not.toHaveAttribute('aria-label');
      expect(wrapper).not.toHaveAttribute('aria-pressed');
      expect(wrapper.querySelectorAll('[aria-pressed]')).toHaveLength(0);
      expect(wrapper).toHaveAttribute('data-md3-ripple');
    });

    it('should name the button after the view it switches to, initially and after every switch', () => {
      openPicker(ui);
      let clockFaceShown = startsOnClockFace;

      expect(isClockFaceShown()).toBe(clockFaceShown);
      expect(switchButton()).toHaveAttribute('aria-label', labelFor(clockFaceShown));

      for (let round = 0; round < 2; round++) {
        clickSwitch();
        clockFaceShown = !clockFaceShown;

        expect(isClockFaceShown()).toBe(clockFaceShown);
        expect(switchButton()).toHaveAttribute('aria-label', labelFor(clockFaceShown));
        expect(control()).not.toHaveAttribute('aria-pressed');
        expect(control().querySelectorAll('[aria-pressed]')).toHaveLength(0);
      }
    });

    it('should switch the view exactly once per click', () => {
      const picker = openPicker(ui);
      const onSwitch = jest.fn();
      picker.on('switch:view', onSwitch);

      clickSwitch();

      expect(onSwitch).toHaveBeenCalledTimes(1);
      expect(isClockFaceShown()).toBe(!startsOnClockFace);
    });

    it('should render the custom icon templates inside the named button, initially and after a switch', () => {
      const expectCustomIconInNamedButton = (clockFaceShown: boolean): void => {
        const button = switchButton();
        expect(button).not.toBeNull();
        expect(button?.querySelector(iconFor(clockFaceShown))).not.toBeNull();
        expect(button?.querySelector(iconFor(!clockFaceShown))).toBeNull();
        expect(button).toHaveAttribute('aria-label', labelFor(clockFaceShown));
      };

      openPicker({ ...ui, iconTemplate: KEYBOARD_ICON, iconTemplateMobile: CLOCK_ICON });
      expectCustomIconInNamedButton(startsOnClockFace);

      clickSwitch();

      expectCustomIconInNamedButton(!startsOnClockFace);
    });
  });

  describe.each<[string, () => HTMLElement]>([
    ['wrapper', control],
    ['button', (): HTMLElement => switchButton() as HTMLElement],
  ])('a bare keydown on the %s', (_name, target) => {
    it.each(['Enter', ' '])('should not switch the view by itself (key %p)', (key) => {
      const picker = openPicker();
      const onSwitch = jest.fn();
      picker.on('switch:view', onSwitch);

      target().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      settle();

      expect(onSwitch).not.toHaveBeenCalled();
      expect(isClockFaceShown()).toBe(true);
    });
  });
});

describe('clock tips stay hidden from assistive technology across view switches', () => {
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

  const tipsWrappers = (): Element[] => [
    ...modal().querySelectorAll('.tp-ui-tips-wrapper, .tp-ui-tips-wrapper-24h'),
  ];

  it.each([
    { view: 'desktop', ui: {}, clicksToClockFace: 2 },
    { view: 'mobile', ui: { mobile: true }, clicksToClockFace: 1 },
  ])('should keep both tips wrappers aria-hidden once the clock view is shown again ($view)', (scenario) => {
    openPicker(scenario.ui);
    expect(tipsWrappers()).toHaveLength(2);

    for (let click = 0; click < scenario.clicksToClockFace; click++) {
      clickSwitch();
    }

    expect(isClockFaceShown()).toBe(true);
    tipsWrappers().forEach((wrapper) => {
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it.each([
    { view: 'desktop', ui: {}, clicksToClockFace: 2 },
    { view: 'mobile', ui: { mobile: true }, clicksToClockFace: 1 },
  ])('should expose the clock dial and put it in the tab order once the clock view is shown ($view)', (scenario) => {
    openPicker(scenario.ui);

    for (let click = 0; click < scenario.clicksToClockFace; click++) {
      clickSwitch();
    }

    expect(isClockFaceShown()).toBe(true);
    modal()
      .querySelectorAll<HTMLElement>('.tp-ui-clock-face')
      .forEach((face) => {
        expect(face).not.toHaveAttribute('aria-hidden', 'true');
        expect(face.tabIndex).toBe(0);
      });
  });
});
