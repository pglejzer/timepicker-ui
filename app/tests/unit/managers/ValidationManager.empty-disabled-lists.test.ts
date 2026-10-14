import TimepickerUI from '@/timepicker/TimepickerUI';
import type { TimepickerOptions } from '@/types/options';

type ClockType = '12h' | '24h';
type DisabledTime = NonNullable<NonNullable<TimepickerOptions['clock']>['disabledTime']>;
type Face = 'hours' | 'minutes' | 'seconds';

interface EmptyListCase {
  name: string;
  clockType: ClockType;
  showSeconds: boolean;
  disabledTime: DisabledTime;
}

const CASES: EmptyListCase[] = [
  {
    name: 'hours: [] and minutes: [] (12h)',
    clockType: '12h',
    showSeconds: false,
    disabledTime: { hours: [], minutes: [] },
  },
  {
    name: 'hours: [] and minutes: [] (24h)',
    clockType: '24h',
    showSeconds: false,
    disabledTime: { hours: [], minutes: [] },
  },
  { name: 'hours: [] alone', clockType: '12h', showSeconds: false, disabledTime: { hours: [] } },
  { name: 'minutes: [] alone', clockType: '24h', showSeconds: false, disabledTime: { minutes: [] } },
  {
    name: 'hours, minutes and seconds all [] with showSeconds',
    clockType: '24h',
    showSeconds: true,
    disabledTime: { hours: [], minutes: [], seconds: [] },
  },
  {
    name: 'seconds: [] alone with showSeconds',
    clockType: '12h',
    showSeconds: true,
    disabledTime: { seconds: [] },
  },
];

const SETTLE_MS = 1000;

const FACE_INPUT: Record<Face, string> = {
  hours: '.tp-ui-hour',
  minutes: '.tp-ui-minutes',
  seconds: '.tp-ui-seconds',
};

const modal = (): HTMLElement => {
  const element = document.querySelector<HTMLElement>('.tp-ui-modal');
  if (!element) throw new Error('the picker modal is not open');
  return element;
};

const readFace = (face: Face): { face: Face; rendered: boolean; disabled: string[] } => {
  const input = modal().querySelector<HTMLElement>(FACE_INPUT[face]);
  if (!input) throw new Error(`${FACE_INPUT[face]} is not rendered`);
  input.click();
  jest.advanceTimersByTime(SETTLE_MS);
  const tips = [...modal().querySelectorAll<HTMLElement>('.tp-ui-value-tips, .tp-ui-value-tips-24h')];
  return {
    face,
    rendered: tips.length > 0,
    disabled: [...modal().querySelectorAll<HTMLElement>('.tp-ui-tips-disabled')].map(
      (tip) => tip.textContent?.trim() ?? '',
    ),
  };
};

describe('empty disabledTime lists mean nothing is disabled', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each(CASES)('should create and open with $name, report no error and disable nothing', (testCase) => {
    const { clockType, showSeconds, disabledTime } = testCase;
    const input = document.createElement('input');
    document.body.appendChild(input);
    const onError = jest.fn();
    const errorListener = jest.fn();
    const picker = new TimepickerUI(input, {
      clock: { type: clockType, showSeconds, disabledTime },
      ui: { animation: false },
      callbacks: { onError },
    });
    picker.on('error', errorListener);

    expect(() => picker.create()).not.toThrow();
    expect(picker.isDestroyed).toBe(false);
    expect(picker.isInitialized).toBe(true);

    picker.open();

    const faces: Face[] = showSeconds ? ['hours', 'minutes', 'seconds'] : ['hours', 'minutes'];
    expect(faces.map(readFace)).toEqual(faces.map((face) => ({ face, rendered: true, disabled: [] })));
    expect(errorListener).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
