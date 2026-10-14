import TimepickerUI from '@/timepicker/TimepickerUI';
import AnimationManager from '@/managers/AnimationManager';
import { TIMINGS } from '@/constants/timings';
import type { EventEmitter, TimepickerEventMap } from '@/utils/EventEmitter';
import type { TimepickerOptions } from '@/types/options';

const EXIT_MS = TIMINGS.MODAL_EXIT;
const CLOSE_DELAY_MS = 200;

type Internals = { emitter: EventEmitter<TimepickerEventMap> };

interface Mounted {
  readonly picker: TimepickerUI;
  readonly input: HTMLInputElement;
  readonly opener: HTMLButtonElement;
  readonly modal: HTMLElement;
}

interface Closer {
  readonly name: string;
  readonly close: (mounted: Mounted) => void;
  readonly event: 'confirm' | 'cancel' | null;
}

const modals = (): NodeListOf<HTMLElement> => document.querySelectorAll<HTMLElement>('.tp-ui-modal');

const html = (): HTMLElement => document.documentElement;

const inModal = (modal: HTMLElement, selector: string): HTMLElement => {
  const element = modal.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`${selector} is not rendered in the modal`);
  return element;
};

const CLOSERS: readonly Closer[] = [
  { name: 'OK', close: ({ modal }) => inModal(modal, '.tp-ui-ok-btn').click(), event: 'confirm' },
  { name: 'Cancel', close: ({ modal }) => inModal(modal, '.tp-ui-cancel-btn').click(), event: 'cancel' },
  {
    name: 'Escape',
    close: () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
    event: 'cancel',
  },
  { name: 'a backdrop click', close: ({ modal }) => modal.click(), event: 'cancel' },
  { name: 'close()', close: ({ picker }) => picker.close(), event: null },
];

const setReducedMotion = (reduce: boolean): void => {
  window.matchMedia = jest.fn((query: string) => ({
    matches: reduce && /prefers-reduced-motion:\s*reduce/.test(query),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })) as unknown as typeof window.matchMedia;
};

const openPicker = (options: TimepickerOptions = {}): Mounted => {
  const root = document.createElement('div');
  root.className = 'tp-ui';
  const input = document.createElement('input');
  input.value = '10:30';
  const opener = document.createElement('button');
  opener.type = 'button';
  opener.setAttribute('data-open', 'picker');
  root.append(input, opener);
  document.body.appendChild(root);

  const picker = new TimepickerUI(root, { ...options, clock: { type: '24h', ...options.clock } });
  picker.create();
  picker.open();

  const [modal] = Array.from(modals());
  expect(modal).toHaveClass('show');
  expect(opener).toHaveClass('disabled');
  return { picker, input, opener, modal };
};

describe('closing the picker', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    window.matchMedia = originalMatchMedia;
    jest.restoreAllMocks();
    jest.useRealTimers();
    html().removeAttribute('style');
    document.body.innerHTML = '';
  });

  describe.each(CLOSERS.filter(({ event }) => event !== null))(
    'the close event of $name',
    ({ close, event }) => {
      it(`should emit ${event} once, before show is removed`, () => {
        const mounted = openPicker();
        const emit = jest.spyOn((mounted.picker as unknown as Internals).emitter, 'emit');
        const removeShow = jest.spyOn(AnimationManager.prototype, 'removeAnimationToClose');

        close(mounted);

        const eventCalls = emit.mock.calls.flatMap(([name], index) => (name === event ? [index] : []));
        expect(eventCalls).toHaveLength(1);
        expect(removeShow).toHaveBeenCalledTimes(1);
        const [eventCall] = eventCalls;
        expect(emit.mock.invocationCallOrder[eventCall]).toBeLessThan(removeShow.mock.invocationCallOrder[0]);
      });
    },
  );

  describe.each(CLOSERS)('through $name with the default delay', ({ close }) => {
    it('should remove show synchronously while the modal stays in the DOM', () => {
      const mounted = openPicker();

      close(mounted);

      expect(mounted.modal).not.toHaveClass('show');
      expect(mounted.modal.isConnected).toBe(true);
    });

    it('should keep the modal and the disabled openers until the exit ends, then drop them together (S133)', () => {
      const mounted = openPicker({ behavior: { focusInputAfterClose: true } });
      const { modal, opener, input } = mounted;
      expect(html().style.overflowY).toBe('hidden');

      close(mounted);
      jest.advanceTimersByTime(EXIT_MS - 1);

      expect(modal.isConnected).toBe(true);
      expect(opener).toHaveClass('disabled');
      expect(html().style.overflowY).toBe('hidden');
      expect(document.activeElement).not.toBe(input);

      jest.advanceTimersByTime(1);

      expect(modal.isConnected).toBe(false);
      expect(opener).not.toHaveClass('disabled');
      expect(html().style.overflowY).toBe('');
      expect(document.activeElement).toBe(input);
    });
  });

  describe('with behavior.delayHandler', () => {
    it('should wait delayHandler before removing show, then the exit duration before removing the modal', () => {
      const mounted = openPicker({ behavior: { delayHandler: CLOSE_DELAY_MS } });
      const { modal, opener } = mounted;

      inModal(modal, '.tp-ui-cancel-btn').click();
      jest.advanceTimersByTime(CLOSE_DELAY_MS - 1);

      expect(modal).toHaveClass('show');

      jest.advanceTimersByTime(1);

      expect(modal).not.toHaveClass('show');
      expect(modal.isConnected).toBe(true);

      jest.advanceTimersByTime(EXIT_MS - 1);

      expect(modal.isConnected).toBe(true);
      expect(opener).toHaveClass('disabled');

      jest.advanceTimersByTime(1);

      expect(modal.isConnected).toBe(false);
      expect(opener).not.toHaveClass('disabled');
    });
  });

  describe.each([
    { name: 'ui.animation is false', options: { ui: { animation: false } }, reduce: false },
    { name: 'the user prefers reduced motion', options: {}, reduce: true },
  ])('when $name', ({ options, reduce }) => {
    it('should finish the close on the next timer tick, never synchronously', () => {
      setReducedMotion(reduce);
      const mounted = openPicker(options);

      mounted.picker.close();

      expect(mounted.modal).not.toHaveClass('show');
      expect(mounted.modal.isConnected).toBe(true);

      jest.advanceTimersByTime(0);

      expect(mounted.modal.isConnected).toBe(false);
      expect(mounted.opener).not.toHaveClass('disabled');
      expect(html().style.overflowY).toBe('');
    });
  });

  describe('destroy() during the exit', () => {
    it('should clean up at once and cancel the rest of the exit', () => {
      const mounted = openPicker({ behavior: { focusInputAfterClose: true } });
      const { picker, input, opener } = mounted;

      picker.close();
      jest.advanceTimersByTime(EXIT_MS - 1);
      picker.destroy();

      expect(modals()).toHaveLength(0);
      expect(opener).not.toHaveClass('disabled');
      expect(html().style.overflowY).toBe('');

      expect(() => jest.advanceTimersByTime(EXIT_MS)).not.toThrow();
      expect(document.activeElement).not.toBe(input);
      expect(modals()).toHaveLength(0);
    });
  });

  describe('reopening', () => {
    it('should be blocked during the exit and work once the modal is removed', () => {
      const mounted = openPicker();
      const { picker, input, opener, modal } = mounted;
      const onOpen = jest.fn();
      picker.on('open', onOpen);

      picker.close();
      picker.open();
      opener.click();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

      expect(modals()).toHaveLength(1);
      expect(modals()[0]).toBe(modal);
      expect(modal).not.toHaveClass('show');
      expect(onOpen).not.toHaveBeenCalled();

      jest.advanceTimersByTime(EXIT_MS);
      expect(modals()).toHaveLength(0);

      opener.click();

      expect(modals()).toHaveLength(1);
      expect(modals()[0]).not.toBe(modal);
      expect(modals()[0]).toHaveClass('show');
      expect(onOpen).toHaveBeenCalledTimes(1);
    });
  });
});
