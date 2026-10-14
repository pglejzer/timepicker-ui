import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import { TIMINGS } from '../../../src/constants/timings';

describe('open/close lifecycle', () => {
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

  it('shows the invalid-format error while an invalid value is open (bug #11)', () => {
    input.value = '99:99';
    const onError = jest.fn();
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false },
      labels: { invalidTimeFormat: 'Zły format' },
      callbacks: { onError },
    });
    picker.create();
    picker.open();
    const error = input.nextElementSibling as HTMLElement | null;
    expect(error?.classList.contains('tp-ui-invalid-text')).toBe(true);
    expect(error?.getAttribute('role')).toBe('alert');
    expect(error?.textContent).toBe('Zły format');
    expect(onError).toHaveBeenCalled();
  });

  it('removes the error once a valid value is confirmed (bug #11)', () => {
    input.value = '99:99';
    const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });
    picker.create();
    picker.open();
    picker.setValue('10:30');
    (document.querySelector('.tp-ui-modal .tp-ui-ok-btn') as HTMLElement).click();
    expect(input.nextElementSibling?.classList.contains('tp-ui-invalid-text') ?? false).toBe(false);
  });

  it('fires onCancel once per Escape after several open/close cycles (bug #12)', () => {
    input.value = '10:30';
    const onCancel = jest.fn();
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false },
      callbacks: { onCancel },
    });
    picker.create();
    for (let i = 0; i < 3; i++) {
      picker.open();
      jest.advanceTimersByTime(500);
      picker.close();
      jest.advanceTimersByTime(1000);
    }
    onCancel.mockClear();
    picker.open();
    jest.advanceTimersByTime(500);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe('invalid value: dialog announcement and input aria', () => {
  const LABEL = 'Zły format';
  let input: HTMLInputElement;

  const announcer = (): HTMLElement | null => document.querySelector('.tp-ui-modal .timepicker-announcer');
  const errorIdOf = (picker: TimepickerUI): string => `tp-ui-invalid-text-${picker.instanceId}`;
  const okButton = (): HTMLElement => document.querySelector('.tp-ui-modal .tp-ui-ok-btn') as HTMLElement;

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

  it('has the dialog announcer in the DOM when onError runs', () => {
    input.value = '99:99';
    const announcerSeenByOnError: boolean[] = [];
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false },
      callbacks: { onError: () => announcerSeenByOnError.push(announcer() !== null) },
    });

    picker.create();
    picker.open();

    expect(announcerSeenByOnError).toEqual([true]);
  });

  it('calls onError before onOpen', () => {
    input.value = '99:99';
    const order: string[] = [];
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false },
      callbacks: {
        onError: () => order.push('error'),
        onOpen: () => order.push('open'),
      },
    });

    picker.create();
    picker.open();

    expect(order).toEqual(['error', 'open']);
  });

  it('announces a custom invalidTimeFormat once focus enters the dialog (default focusTrap)', () => {
    input.value = '99:99';
    const picker = new TimepickerUI(input, { clock: { type: '24h' }, labels: { invalidTimeFormat: LABEL } });

    picker.create();
    picker.open();
    jest.advanceTimersByTime(500);
    (document.querySelector('.tp-ui-modal .tp-ui-wrapper') as HTMLElement).dispatchEvent(
      new FocusEvent('focusin', { bubbles: true }),
    );
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(announcer()?.textContent).toBe(LABEL);
  });

  it('inline: announces the label after ANNOUNCE_DELAY without focus', () => {
    const container = document.createElement('div');
    container.id = 'invalid-inline-host';
    document.body.appendChild(container);
    input.value = '99:99';
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { inline: { enabled: true, containerId: 'invalid-inline-host' } },
      labels: { invalidTimeFormat: LABEL },
    });

    picker.create();
    const inlineAnnouncer = container.querySelector('.timepicker-announcer') as HTMLElement;
    expect(inlineAnnouncer.textContent).toBe('');

    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(inlineAnnouncer.textContent).toBe(LABEL);
  });

  it.each([
    ['without a developer token', null],
    ['keeping a developer token', 'hint'],
  ])('clears aria-invalid and the error id after a valid value is confirmed (%s)', (_, devToken) => {
    if (devToken) input.setAttribute('aria-describedby', devToken);
    input.value = '99:99';
    const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });
    picker.create();
    picker.open();

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(
      [devToken, errorIdOf(picker)].filter(Boolean).join(' '),
    );

    picker.setValue('10:30', false);
    okButton().click();

    expect(input.value).toBe('10:30');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.getAttribute('aria-describedby')).toBe(devToken);
  });

  it.each([
    ['without a developer token', null],
    ['keeping a developer token', 'hint'],
  ])('clears aria-invalid and the error id on destroy (%s)', (_, devToken) => {
    if (devToken) input.setAttribute('aria-describedby', devToken);
    input.value = '99:99';
    const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });
    picker.create();
    picker.open();
    expect(input.getAttribute('aria-invalid')).toBe('true');

    picker.destroy();

    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.getAttribute('aria-describedby')).toBe(devToken);
  });

  it('opens a valid value without aria-invalid or an error id', () => {
    input.value = '10:30';
    const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });

    picker.create();
    picker.open();

    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });
});
