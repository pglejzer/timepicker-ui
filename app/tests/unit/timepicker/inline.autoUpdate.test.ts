import TimepickerUI from '../../../src/timepicker/TimepickerUI';

describe('inline.autoUpdate (S8)', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it('writes every change to the input', () => {
    const container = document.createElement('div');
    container.id = 'auto-host';
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.append(input, container);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false, inline: { enabled: true, containerId: 'auto-host', autoUpdate: true } },
    });
    picker.create();
    const hour = container.querySelector('.tp-ui-hour') as HTMLInputElement;
    hour.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(input.value).toBe('11:30');
  });

  it('leaves the input alone without autoUpdate', () => {
    const container = document.createElement('div');
    container.id = 'manual-host';
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.append(input, container);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false, inline: { enabled: true, containerId: 'manual-host' } },
    });
    picker.create();
    (container.querySelector('.tp-ui-hour') as HTMLInputElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    expect(input.value).toBe('10:30');
  });
});
