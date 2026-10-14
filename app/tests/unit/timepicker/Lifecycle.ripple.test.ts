import TimepickerUI from '@/timepicker/TimepickerUI';

const FRAME_MS = 16;
const CONTAINER_ID = 'ripple-inline-host';

const press = (target: Element): void => {
  const event = new MouseEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX: 5,
    clientY: 5,
  });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: 'mouse' },
    isPrimary: { value: true },
  });
  target.dispatchEvent(event);
};

const nextFrame = (): void => {
  jest.advanceTimersByTime(FRAME_MS);
};

const rippleHostIn = (root: ParentNode): HTMLElement =>
  root.querySelector('.tp-ui-input-ripple-wrapper') as HTMLElement;

describe('ripple wiring in the picker lifecycle', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    jest.useFakeTimers();
    input = document.createElement('input');
    input.value = '10:30';
    document.body.appendChild(input);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

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

  describe('inline picker', () => {
    it('should ripple a host of the inline modal while the picker lives', () => {
      const { container } = createInline();
      const host = rippleHostIn(container);

      press(host);
      nextFrame();

      expect(host).toHaveClass('is-pressed');
      expect(host).toHaveClass('is-rippling');
    });

    it('should stop rippling the removed inline modal after destroy()', () => {
      const { picker, container } = createInline();
      const host = rippleHostIn(container);

      picker.destroy();
      press(host);
      nextFrame();

      expect(host).not.toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');
    });

    it('should not ripple a host placed in the inline container after destroy()', () => {
      const { picker, container } = createInline();
      picker.destroy();
      const host = document.createElement('div');
      host.setAttribute('data-md3-ripple', '');
      container.appendChild(host);

      press(host);
      nextFrame();

      expect(host).not.toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');
    });
  });

  describe('one handler per press', () => {
    it('should handle a press once after the modal picker is opened a second time', () => {
      const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });
      picker.create();
      picker.open();
      jest.advanceTimersByTime(500);
      picker.close();
      jest.advanceTimersByTime(1000);
      picker.open();
      jest.advanceTimersByTime(500);

      const modals = document.querySelectorAll('.tp-ui-modal');
      expect(modals).toHaveLength(1);
      const host = modals[0].querySelector('.tp-ui-cancel-btn') as HTMLElement;
      const measure = jest.spyOn(host, 'getBoundingClientRect');

      press(host);

      expect(measure).toHaveBeenCalledTimes(1);
    });

    it('should handle a press once after an inline update re-renders the modal', () => {
      const { picker, container } = createInline();
      picker.update({ options: { labels: { ok: 'Done' } } });
      jest.advanceTimersByTime(500);

      const host = rippleHostIn(container);
      const measure = jest.spyOn(host, 'getBoundingClientRect');

      press(host);

      expect(measure).toHaveBeenCalledTimes(1);
    });
  });
});
