import TimepickerUI from '../../../src/timepicker/TimepickerUI';

const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;

describe('labels are display-only (bug #5)', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    input.value = '02:30 AM';
    document.body.appendChild(input);
  });
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it('keeps AM/PM in the value when labels.am/pm are translated', () => {
    const picker = new TimepickerUI(input, {
      ui: { animation: false },
      labels: { am: 'rano', pm: 'po poł.' },
    });
    picker.create();
    picker.open();
    (modal().querySelector('.tp-ui-pm') as HTMLElement).click();
    expect(picker.getValue().type).toBe('PM');
    expect(picker.getValue().time).toBe('02:30 PM');
    (modal().querySelector('.tp-ui-ok-btn') as HTMLElement).click();
    expect(input.value).toBe('02:30 PM');
  });

  it('emits the AM/PM token in update and confirm payloads', () => {
    const onConfirm = jest.fn();
    const onUpdate = jest.fn();
    const picker = new TimepickerUI(input, {
      ui: { animation: false },
      labels: { am: 'rano', pm: 'po poł.' },
      callbacks: { onConfirm, onUpdate },
    });
    picker.create();
    picker.open();
    (modal().querySelector('.tp-ui-pm') as HTMLElement).click();
    (modal().querySelector('.tp-ui-hour') as HTMLElement).click();
    expect(onUpdate).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'PM' }));
    (modal().querySelector('.tp-ui-ok-btn') as HTMLElement).click();
    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ type: 'PM' }));
  });
});

describe('inline update re-renders labels (bug #10)', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it('applies new labels to a mounted inline picker', () => {
    const container = document.createElement('div');
    container.id = 'inline-host';
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.append(input, container);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false, inline: { enabled: true, containerId: 'inline-host', showButtons: true } },
    });
    picker.create();
    picker.update({ options: { labels: { ok: 'ZATWIERDŹ', time: 'Wybierz' } } });
    expect(container.querySelector('.tp-ui-ok-btn')?.textContent).toBe('ZATWIERDŹ');
    expect(container.querySelector('.tp-ui-select-time')?.textContent).toBe('Wybierz');
  });
});
