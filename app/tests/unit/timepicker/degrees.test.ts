import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import { TIMINGS } from '../../../src/constants/timings';
import { setSpinbuttonValue } from '../../../src/utils/accessibility';
import type { TimepickerOptions } from '../../../src/types/options';

describe('TimepickerUI degrees consistency', () => {
  let container: HTMLDivElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    input.value = '';
    container.appendChild(input);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('degrees match time after setValue without opening modal', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('14:30');

    const result = timepicker.getValue();

    expect(result.hour).toBe('14');
    expect(result.minutes).toBe('30');
    expect(result.degreesHours).toBe(420);
    expect(result.degreesMinutes).toBe(180);
  });

  test('degrees update when input value changes manually', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('10:00');

    let result1 = timepicker.getValue();
    expect(result1.hour).toBe('10');
    expect(result1.degreesHours).toBe(300);

    input.value = '15:45';

    let result2 = timepicker.getValue();
    expect(result2.hour).toBe('15');
    expect(result2.minutes).toBe('45');
    expect(result2.degreesHours).toBe(450);
    expect(result2.degreesMinutes).toBe(270);
  });

  test('degrees are consistent after multiple setValue calls', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('10:00');
    timepicker.setValue('12:15');
    timepicker.setValue('18:45');

    const result = timepicker.getValue();

    expect(result.hour).toBe('18');
    expect(result.minutes).toBe('45');
    expect(result.degreesHours).toBe(540);
    expect(result.degreesMinutes).toBe(270);
  });
});

describe('TimepickerUI degrees follow the value the picker shows', () => {
  const FACE_SIZE = 200;
  const RADIUS = FACE_SIZE / 2;
  const SETTLE_MS = 1000;

  type Degrees = { degreesHours: number | null; degreesMinutes: number | null };

  let input: HTMLInputElement;

  const createPicker = (value: string, options: TimepickerOptions): TimepickerUI => {
    input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { ...options, ui: { animation: false, ...options.ui } });
    picker.create();
    return picker;
  };

  const degreesOf = ({ degreesHours, degreesMinutes }: Degrees): Degrees => ({ degreesHours, degreesMinutes });

  const pointAt = (degrees: number): { clientX: number; clientY: number } => ({
    clientX: RADIUS + RADIUS * Math.sin((degrees * Math.PI) / 180),
    clientY: RADIUS - RADIUS * Math.cos((degrees * Math.PI) / 180),
  });

  const dragHourHandTo = (degrees: number): void => {
    const face = document.querySelector('.tp-ui-modal .tp-ui-clock-face') as HTMLElement;
    Object.defineProperty(face, 'offsetWidth', { value: FACE_SIZE, configurable: true });
    Object.defineProperty(face, 'offsetHeight', { value: FACE_SIZE, configurable: true });
    jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
    face.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, ...pointAt(degrees) }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  test('getValue() takes the degrees from the hour and minutes the open 12h clock shows', () => {
    const picker = createPicker('10:00 AM', { clock: { type: '12h' } });
    picker.open();

    setSpinbuttonValue(picker.hour, '03');

    expect(picker.getValue()).toMatchObject({
      hour: '03',
      minutes: '00',
      degreesHours: 90,
      degreesMinutes: 0,
    });

    setSpinbuttonValue(picker.minutes, '45');

    expect(picker.getValue()).toMatchObject({
      hour: '03',
      minutes: '45',
      degreesHours: 90,
      degreesMinutes: 270,
    });
  });

  test('a 24h 15:45 reports 450/270 while open and after close()', () => {
    const picker = createPicker('15:45', { clock: { type: '24h' } });
    const expected = { hour: '15', minutes: '45', degreesHours: 450, degreesMinutes: 270 };

    picker.open();

    expect(picker.getValue()).toMatchObject(expected);

    picker.close();
    jest.advanceTimersByTime(SETTLE_MS);

    expect(document.querySelector('.tp-ui-modal')).toBeNull();
    expect(picker.getValue()).toMatchObject(expected);
  });

  test('after Clear while open, getValue() reports the neutral 12:00 at 360/0', () => {
    const picker = createPicker('10:00 AM', { clock: { type: '12h' }, ui: { clearButton: true } });
    picker.open();

    (document.querySelector('.tp-ui-modal .tp-ui-clear-btn') as HTMLElement).click();

    expect(picker.getValue()).toMatchObject({
      hour: '12',
      minutes: '00',
      degreesHours: 360,
      degreesMinutes: 0,
    });
  });

  test('after destroy(), getValue() reports null degrees', () => {
    const picker = createPicker('15:45', { clock: { type: '24h' } });
    picker.open();

    picker.destroy();

    expect(degreesOf(picker.getValue())).toEqual({ degreesHours: null, degreesMinutes: null });
  });

  test('with showSeconds, getValue() has no degreesSeconds key, closed or open', () => {
    const picker = createPicker('15:45:30', { clock: { type: '24h', showSeconds: true } });

    const closed = picker.getValue();
    picker.open();
    const opened = picker.getValue();

    [closed, opened].forEach((value) => {
      expect(value).toMatchObject({ seconds: '30', degreesHours: 450, degreesMinutes: 270 });
      expect(value).not.toHaveProperty('degreesSeconds');
    });
  });

  test('the open payload after a clock drag, close(true) and reopen reports the dragged hour', () => {
    const picker = createPicker('10:00 AM', { clock: { type: '12h' } });
    picker.open();

    dragHourHandTo(90);

    expect(picker.hour?.value).toBe('03');

    picker.close(true);
    jest.advanceTimersByTime(SETTLE_MS);

    expect(input.value).toBe('03:00 AM');

    const openListener = jest.fn();
    picker.on('open', openListener);
    picker.open();

    expect(openListener).toHaveBeenCalledTimes(1);
    expect(openListener).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '03', degreesHours: 90, degreesMinutes: 0 }),
    );
  });

  test('the open payload reports a value typed into the input after create()', () => {
    const picker = createPicker('10:00', { clock: { type: '24h' } });
    const openListener = jest.fn();
    picker.on('open', openListener);

    input.value = '15:45';
    picker.open();

    expect(openListener).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '15', minutes: '45', degreesHours: 450, degreesMinutes: 270 }),
    );
  });

  test('the open payload degrees equal getValue() read inside the open listener', () => {
    const picker = createPicker('07:20 PM', { clock: { type: '12h' } });
    const seen: Degrees[] = [];
    picker.on('open', (payload) => {
      seen.push(degreesOf(payload), degreesOf(picker.getValue()));
    });

    picker.open();

    expect(seen).toEqual([
      { degreesHours: 210, degreesMinutes: 120 },
      { degreesHours: 210, degreesMinutes: 120 },
    ]);
  });
});

