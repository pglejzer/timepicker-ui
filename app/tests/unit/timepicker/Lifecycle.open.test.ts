import TimepickerUI from '@/timepicker/TimepickerUI';
import AnimationManager from '@/managers/AnimationManager';
import ModalManager from '@/managers/ModalManager';
import WheelManager from '@/managers/plugins/wheel/WheelManager';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import type { TimepickerOptions } from '@/types/options';

const FRAME_MS = 16;
const INLINE_CONTAINER_ID = 'open-transition-inline-host';
const POPOVER_OPTIONS: TimepickerOptions = {
  ui: { mode: 'compact-wheel', backdrop: false },
  wheel: { placement: 'bottom' },
};

const modal = (): HTMLElement | null => document.querySelector<HTMLElement>('.tp-ui-modal');

const createPicker = (options: TimepickerOptions = {}): { picker: TimepickerUI; input: HTMLInputElement } => {
  const input = document.createElement('input');
  input.value = '10:30';
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, { ...options, clock: { type: '24h', ...options.clock } });
  picker.create();
  return { picker, input };
};

const trackModalStyleFlushes = (): boolean[] => {
  const showAtFlush: boolean[] = [];
  const read = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')?.get;
  jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('tp-ui-modal')) showAtFlush.push(this.classList.contains('show'));
    return read ? (read.call(this) as number) : 0;
  });
  return showAtFlush;
};

describe('opening the picker shows the modal in the same task', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.documentElement.removeAttribute('style');
    document.body.innerHTML = '';
  });

  describe.each([
    { name: 'animation on', animation: true },
    { name: 'animation off', animation: false },
  ])('with $name', ({ animation }) => {
    it('should add show right after open() without advancing timers', () => {
      const { picker } = createPicker({ ui: { animation } });

      picker.open();

      expect(modal()).toHaveClass('show');
    });

    it('should never add the opacity helper class', () => {
      const { picker } = createPicker({ ui: { animation } });

      picker.open();
      jest.runOnlyPendingTimers();

      expect(modal()).toHaveClass('show');
      expect(modal()).not.toHaveClass('opacity');
    });
  });

  it('should flush styles once, before show, when animation is on so the fade-in runs', () => {
    const { picker } = createPicker({ ui: { animation: true } });
    const showAtFlush = trackModalStyleFlushes();

    picker.open();

    expect(showAtFlush).toEqual([false]);
  });

  it('should not flush styles when animation is off', () => {
    const { picker } = createPicker({ ui: { animation: false } });
    const showAtFlush = trackModalStyleFlushes();

    picker.open();

    expect(showAtFlush).toEqual([]);
    expect(modal()).toHaveClass('show');
  });

  it('should show an inline picker at once on create()', () => {
    const container = document.createElement('div');
    container.id = INLINE_CONTAINER_ID;
    document.body.appendChild(container);

    createPicker({ ui: { inline: { enabled: true, containerId: INLINE_CONTAINER_ID } } });

    const inline = container.querySelector('.tp-ui-modal');
    expect(inline).toHaveClass('show');
    expect(inline).not.toHaveClass('opacity');
  });

  it('should move focus into the dialog after show is set, and not again on a re-render', () => {
    const setAnimationToOpen = jest.spyOn(AnimationManager.prototype, 'setAnimationToOpen');
    const setInitialFocus = jest.spyOn(ModalManager.prototype, 'setInitialFocus');
    const { picker } = createPicker();

    picker.open();

    expect(setInitialFocus).toHaveBeenCalledTimes(1);
    expect(setAnimationToOpen.mock.invocationCallOrder[0]).toBeLessThan(
      setInitialFocus.mock.invocationCallOrder[0],
    );

    picker.update({ options: { labels: { ok: 'Done' } } });

    expect(setInitialFocus).toHaveBeenCalledTimes(1);
    expect(setAnimationToOpen).toHaveBeenLastCalledWith(true);
    expect(modal()).toHaveClass('show');
  });

  describe('initial focus', () => {
    it('should focus the dialog wrapper on the next frame when there is a backdrop', () => {
      const { picker } = createPicker({ ui: { backdrop: true } });

      picker.open();
      const wrapper = modal()?.querySelector('.tp-ui-wrapper');
      expect(document.activeElement).not.toBe(wrapper);

      jest.advanceTimersByTime(FRAME_MS);

      expect(document.activeElement).toBe(wrapper);
    });

    it('should leave focus alone when there is no backdrop', () => {
      const { picker } = createPicker({ ui: { backdrop: false } });
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      outside.focus();

      picker.open();
      jest.advanceTimersByTime(FRAME_MS);

      expect(document.activeElement).toBe(outside);
    });
  });

  describe('compact-wheel popover', () => {
    beforeAll(() => PluginRegistry.register(WheelPlugin));

    it('should add show only after the popover is attached', () => {
      const attach = WheelManager.prototype.attachPopover;
      const showAtAttach: boolean[] = [];
      const attachPopover = jest
        .spyOn(WheelManager.prototype, 'attachPopover')
        .mockImplementation(function (this: WheelManager) {
          showAtAttach.push(!!modal()?.classList.contains('show'));
          attach.call(this);
        });
      const setAnimationToOpen = jest.spyOn(AnimationManager.prototype, 'setAnimationToOpen');
      const { picker } = createPicker(POPOVER_OPTIONS);

      picker.open();

      expect(attachPopover).toHaveBeenCalledTimes(1);
      expect(showAtAttach).toEqual([false]);
      expect(attachPopover.mock.invocationCallOrder[0]).toBeLessThan(
        setAnimationToOpen.mock.invocationCallOrder[0],
      );
      expect(modal()).toHaveClass('tp-ui-popover');
      expect(modal()).toHaveClass('show');
    });

    it('should focus the popover wrapper on the next frame without a backdrop', () => {
      const { picker } = createPicker(POPOVER_OPTIONS);

      picker.open();
      jest.advanceTimersByTime(FRAME_MS);

      expect(document.activeElement).toBe(modal()?.querySelector('.tp-ui-wrapper'));
    });
  });
});
