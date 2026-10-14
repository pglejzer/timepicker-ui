import TimepickerUI from '@/timepicker/TimepickerUI';

const CONTAINER_ID = 'inline-rerender-host';

describe('re-rendering an inline picker after update() does not open it again', () => {
  let container: HTMLDivElement;
  let picker: TimepickerUI;
  let onOpenEvent: jest.Mock;
  let onOpen: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.append(input, container);
    onOpenEvent = jest.fn();
    onOpen = jest.fn();
    picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false, inline: { enabled: true, containerId: CONTAINER_ID, showButtons: true } },
      callbacks: { onOpen },
    });
    picker.on('open', onOpenEvent);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should emit open once on create', () => {
    picker.create();

    expect(onOpenEvent).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])(
    'should apply new labels without emitting open again (update with create: %p)',
    (create) => {
      picker.create();

      picker.update({ options: { labels: { ok: 'X' } }, create });
      jest.advanceTimersByTime(1000);

      expect(container.querySelector('.tp-ui-ok-btn')?.textContent).toBe('X');
      expect(onOpenEvent).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledTimes(1);
    },
  );

  it('should show the re-rendered clock face at once', () => {
    picker.create();
    const firstFace = container.querySelector('.tp-ui-clock-face');
    expect(firstFace).not.toHaveClass('scale-in');

    picker.update({ options: { labels: { ok: 'X' } } });

    const face = container.querySelector('.tp-ui-clock-face');
    expect(face).not.toBe(firstFace);
    expect(face).toHaveClass('scale-in');
  });

  it.each<[string, (cancel: HTMLElement) => void]>([
    ['a click', (cancel) => cancel.click()],
    [
      'Enter on the focused button',
      (cancel) => {
        cancel.focus();
        cancel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      },
    ],
  ])('should leave focus on the new Cancel button after %s', (_label, activate) => {
    picker.create();
    const cancel = container.querySelector<HTMLElement>('.tp-ui-cancel-btn');
    if (!cancel) throw new Error('.tp-ui-cancel-btn is not rendered');

    activate(cancel);

    const newCancel = container.querySelector('.tp-ui-cancel-btn');
    expect(newCancel).not.toBe(cancel);
    expect(newCancel?.isConnected).toBe(true);
    expect(document.activeElement).toBe(newCancel);
  });
});
