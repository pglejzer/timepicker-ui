import TimepickerUI from '@/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';

const FACE_SIZE = 200;
const RADIUS = FACE_SIZE / 2;

type DragCase = {
  field: 'hour' | 'minutes';
  showFace: (modal: HTMLElement) => void;
  degrees: number;
  now: string;
  text: string;
};

const pointAt = (degrees: number): { clientX: number; clientY: number } => ({
  clientX: RADIUS + RADIUS * Math.sin((degrees * Math.PI) / 180),
  clientY: RADIUS - RADIUS * Math.cos((degrees * Math.PI) / 180),
});

const openClock = (): HTMLElement => {
  const input = document.createElement('input');
  input.value = '10:00';
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });
  picker.create();
  picker.open();
  const modal = document.querySelector('.tp-ui-modal') as HTMLElement;
  const face = modal.querySelector('.tp-ui-clock-face') as HTMLElement;
  Object.defineProperty(face, 'offsetWidth', { value: FACE_SIZE, configurable: true });
  Object.defineProperty(face, 'offsetHeight', { value: FACE_SIZE, configurable: true });
  return modal;
};

const CASES: DragCase[] = [
  { field: 'hour', showFace: () => undefined, degrees: 90, now: '3', text: '03' },
  {
    field: 'minutes',
    showFace: (modal) => (modal.querySelector('.tp-ui-minutes') as HTMLElement).click(),
    degrees: 30,
    now: '5',
    text: '05',
  },
];

describe('clock drag writes a numeric aria-valuenow to the spinbutton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each(CASES)(
    'should set aria-valuenow $now and aria-valuetext $text on the $field field after a drag',
    ({ field, showFace, degrees, now, text }) => {
      const modal = openClock();
      showFace(modal);
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
      const face = modal.querySelector('.tp-ui-clock-face') as HTMLElement;

      face.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, ...pointAt(degrees) }));
      jest.advanceTimersByTime(150);

      const spinbutton = modal.querySelector(`.tp-ui-${field}`) as HTMLInputElement;
      expect(spinbutton.value).toBe(text);
      expect(spinbutton.getAttribute('aria-valuenow')).toBe(now);
      expect(spinbutton.getAttribute('aria-valuetext')).toBe(text);
    },
  );
});
