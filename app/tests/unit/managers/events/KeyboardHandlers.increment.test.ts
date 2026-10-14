import TimepickerUI from '../../../../src/timepicker/TimepickerUI';

describe('minutes spinbutton follows incrementMinutes (S21)', () => {
  let minutes: HTMLInputElement;

  beforeEach(() => {
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h', incrementMinutes: 5 },
      ui: { animation: false },
    });
    picker.create();
    picker.open();
    minutes = document.querySelector('.tp-ui-modal .tp-ui-minutes') as HTMLInputElement;
  });
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  const press = (key: string): void => {
    minutes.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };

  it('ArrowUp moves to the next step', () => {
    press('ArrowUp');
    expect(minutes.value).toBe('35');
  });
  it('ArrowDown moves to the previous step', () => {
    press('ArrowDown');
    expect(minutes.value).toBe('25');
  });
  it('snaps an off-grid value up to the next step', () => {
    minutes.value = '32';
    press('ArrowUp');
    expect(minutes.value).toBe('35');
  });
  it('End goes to the last step', () => {
    press('End');
    expect(minutes.value).toBe('55');
  });
  it('ArrowUp wraps from the last step to 00', () => {
    minutes.value = '55';
    press('ArrowUp');
    expect(minutes.value).toBe('00');
  });
});
