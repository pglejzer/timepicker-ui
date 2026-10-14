import TimepickerUI from '../../../src/timepicker/TimepickerUI';

describe('clear button', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    jest.useFakeTimers();
    input = document.createElement('input');
    document.body.appendChild(input);
  });
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('is enabled on the first open when the input has a value (S4)', () => {
    input.value = '10:30';
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { clearButton: true, animation: false },
    });
    picker.create();
    picker.open();
    const clear = document.querySelector('.tp-ui-modal .tp-ui-clear-btn') as HTMLElement;
    expect(clear.classList.contains('disabled')).toBe(false);
    expect(clear.getAttribute('aria-disabled')).toBe('false');
  });

  it('announces labels.announceCleared (bug #8)', () => {
    input.value = '10:30';
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { clearButton: true, animation: false },
      labels: { announceCleared: 'Wyczyszczono' },
    });
    picker.create();
    picker.open();
    const modal = document.querySelector('.tp-ui-modal') as HTMLElement;
    const clear = modal.querySelector('.tp-ui-clear-btn') as HTMLElement;
    clear.classList.remove('disabled');
    clear.setAttribute('aria-disabled', 'false');
    clear.click();
    jest.advanceTimersByTime(150);
    expect(modal.querySelector('.timepicker-announcer')?.textContent).toBe('Wyczyszczono');
  });
});
