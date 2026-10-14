import TimepickerUI from '@/timepicker/TimepickerUI';

describe('switching between the clock and keyboard views with seconds', () => {
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

  const openPicker = (): HTMLElement => {
    const input = document.createElement('input');
    input.value = '10:00:30';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h', showSeconds: true },
      ui: { animation: false, enableSwitchIcon: true },
    });
    picker.create();
    picker.open();
    return document.querySelector('.tp-ui-modal') as HTMLElement;
  };

  const secondsParts = (modal: HTMLElement): { field: HTMLInputElement; caption: HTMLElement } => {
    const field = modal.querySelector<HTMLInputElement>('.tp-ui-seconds');
    const caption = modal.querySelector<HTMLElement>('.tp-ui-second-text');
    if (!field || !caption) throw new Error('the seconds field or its caption is not rendered');
    return { field, caption };
  };

  const switchView = (modal: HTMLElement): void => {
    (modal.querySelector('.tp-ui-keyboard-icon') as HTMLElement).click();
  };

  it('makes the seconds field editable in the keyboard view', () => {
    const modal = openPicker();
    const { field, caption } = secondsParts(modal);
    expect(field.hasAttribute('readonly')).toBe(true);
    switchView(modal);
    expect(field.hasAttribute('readonly')).toBe(false);
    expect(field.classList.contains('mobile')).toBe(true);
    expect(caption.classList.contains('mobile')).toBe(true);
  });

  it('makes the seconds field read-only again back in the clock view', () => {
    const modal = openPicker();
    const { field, caption } = secondsParts(modal);
    switchView(modal);
    jest.advanceTimersByTime(1000);
    switchView(modal);
    expect(field.hasAttribute('readonly')).toBe(true);
    expect(field.classList.contains('mobile')).toBe(false);
    expect(caption.classList.contains('mobile')).toBe(false);
  });
});
