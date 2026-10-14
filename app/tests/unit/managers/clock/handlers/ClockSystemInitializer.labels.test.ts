import TimepickerUI from '../../../../../src/timepicker/TimepickerUI';

describe('clock drag announcements use labels (S22)', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('announces the hour with labels.announceHour', () => {
    jest.useFakeTimers();
    const input = document.createElement('input');
    input.value = '10:00';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false },
      labels: { announceHour: 'Godzina' },
    });
    picker.create();
    picker.open();
    const modal = document.querySelector('.tp-ui-modal') as HTMLElement;
    const face = modal.querySelector('.tp-ui-clock-face') as HTMLElement;
    Object.defineProperty(face, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(face, 'offsetHeight', { value: 200, configurable: true });
    face.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 200, clientY: 100 }));
    jest.advanceTimersByTime(150);
    expect(modal.querySelector('.timepicker-announcer')?.textContent).toBe('Godzina: 03');
  });
});
