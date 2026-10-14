import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';
import { mockWheelItemHeight } from '../managers/plugins/wheel/wheel-test-helpers';

const POINTER = 'tp-ui-pointer';
const CONTAINER_ID = 'pointer-modality-inline-host';
const CLOSE_CYCLE_MS = TIMINGS.MODAL_EXIT;

const MODAL_OPTIONS: TimepickerOptions = {
  clock: { type: '24h' },
  ui: { animation: true },
};

const pointerDown = (target: Element): void => {
  target.dispatchEvent(new Event('pointerdown', { bubbles: true }));
};

const keyDown = (target: Element, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
};

const modalIn = (root: ParentNode): HTMLElement => root.querySelector('.tp-ui-modal') as HTMLElement;

const wrapperOf = (modal: HTMLElement): HTMLElement => modal.querySelector('.tp-ui-wrapper') as HTMLElement;

const createInput = (): HTMLInputElement => {
  const input = document.createElement('input');
  input.value = '10:30';
  document.body.appendChild(input);
  return input;
};

describe('pointer modality class in the picker lifecycle', () => {
  let input: HTMLInputElement;
  let addListenerSpy: jest.SpyInstance;
  let removeListenerSpy: jest.SpyInstance;

  const keydownCaptureListeners = (spy: jest.SpyInstance): unknown[] =>
    spy.mock.calls
      .filter(([type, , options]) => type === 'keydown' && options === true)
      .map(([, listener]) => listener);

  const attachedKeydownCaptureListeners = (): number => {
    const removed = keydownCaptureListeners(removeListenerSpy);
    return keydownCaptureListeners(addListenerSpy).filter((listener) => !removed.includes(listener)).length;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    input = createInput();
    addListenerSpy = jest.spyOn(document, 'addEventListener');
    removeListenerSpy = jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('modal picker', () => {
    const openPicker = (): TimepickerUI => {
      const picker = new TimepickerUI(input, MODAL_OPTIONS);
      picker.create();
      picker.open();
      return picker;
    };

    it('should add the class on a pointerdown in the open modal and remove it on a keydown', () => {
      openPicker();
      const modal = modalIn(document);

      pointerDown(wrapperOf(modal));
      expect(modal).toHaveClass(POINTER);

      keyDown(wrapperOf(modal), 'Tab');
      expect(modal).not.toHaveClass(POINTER);
    });

    it('should not add the class on a pointerdown in the closing modal before it is removed', () => {
      const picker = openPicker();
      const modal = modalIn(document);

      picker.close();
      jest.advanceTimersByTime(CLOSE_CYCLE_MS - 1);

      expect(modal.isConnected).toBe(true);
      pointerDown(wrapperOf(modal));
      expect(modal).not.toHaveClass(POINTER);
    });

    it('should keep exactly one keydown capture listener per open across open, close and open', () => {
      const picker = new TimepickerUI(input, MODAL_OPTIONS);
      picker.create();
      expect(attachedKeydownCaptureListeners()).toBe(0);

      picker.open();
      expect(attachedKeydownCaptureListeners()).toBe(1);

      picker.close();
      jest.advanceTimersByTime(CLOSE_CYCLE_MS);
      expect(attachedKeydownCaptureListeners()).toBe(0);

      picker.open();
      expect(attachedKeydownCaptureListeners()).toBe(1);
    });

    it('should reopen without the class from the previous open and track the new modal', () => {
      const picker = openPicker();
      const firstModal = modalIn(document);
      pointerDown(wrapperOf(firstModal));
      expect(firstModal).toHaveClass(POINTER);

      picker.close();
      jest.advanceTimersByTime(CLOSE_CYCLE_MS);
      picker.open();
      const secondModal = modalIn(document);

      expect(secondModal).not.toBe(firstModal);
      expect(secondModal).not.toHaveClass(POINTER);

      pointerDown(wrapperOf(secondModal));
      expect(secondModal).toHaveClass(POINTER);
    });

    it('should remove the keydown capture listener on destroy()', () => {
      const picker = openPicker();
      const modal = modalIn(document);
      expect(attachedKeydownCaptureListeners()).toBe(1);

      picker.destroy();

      expect(attachedKeydownCaptureListeners()).toBe(0);
      modal.classList.add(POINTER);
      keyDown(document.body, 'Tab');
      expect(modal).toHaveClass(POINTER);
    });
  });

  describe('inline picker', () => {
    const createInline = (): { picker: TimepickerUI; container: HTMLElement } => {
      const container = document.createElement('div');
      container.id = CONTAINER_ID;
      document.body.appendChild(container);
      const picker = new TimepickerUI(input, {
        clock: { type: '24h' },
        ui: { animation: false, inline: { enabled: true, containerId: CONTAINER_ID } },
      });
      picker.create();
      return { picker, container };
    };

    it('should add the class on a pointerdown in the inline picker after create()', () => {
      const { container } = createInline();
      const modal = modalIn(container);

      pointerDown(wrapperOf(modal));

      expect(modal).toHaveClass(POINTER);
    });

    it.each([false, true])(
      'should keep one keydown capture listener after an inline update() re-render (create: %p)',
      (create) => {
        const { picker, container } = createInline();
        expect(attachedKeydownCaptureListeners()).toBe(1);

        picker.update({ options: { labels: { ok: 'Done' } }, create });

        expect(attachedKeydownCaptureListeners()).toBe(1);
        const modal = modalIn(container);
        pointerDown(wrapperOf(modal));
        expect(modal).toHaveClass(POINTER);
      },
    );
  });
});

describe('pointer modality class in wheel mode', () => {
  beforeAll(() => PluginRegistry.register(WheelPlugin));

  beforeEach(() => {
    jest.useFakeTimers();
    mockWheelItemHeight();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('should add the class on a pointerdown in an open wheel picker', () => {
    const picker = new TimepickerUI(createInput(), {
      clock: { type: '24h' },
      ui: { mode: 'wheel', animation: false },
    });
    picker.create();
    picker.open();
    const modal = modalIn(document);
    const wheel = modal.querySelector('.tp-ui-wheel-container') as HTMLElement;
    expect(wheel).not.toBeNull();

    pointerDown(wheel);

    expect(modal).toHaveClass(POINTER);
  });
});
