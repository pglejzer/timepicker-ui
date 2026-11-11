import TimepickerUI from '@/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';

const SETTLE_MS = 2000;

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;
const am = (): HTMLElement => modal().querySelector('.tp-ui-am') as HTMLElement;
const pm = (): HTMLElement => modal().querySelector('.tp-ui-pm') as HTMLElement;
const announcer = (): HTMLElement => modal().querySelector('.timepicker-announcer') as HTMLElement;

const press = (target: HTMLElement, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const radioState = (radio: HTMLElement): { checked: string | null; tabindex: string | null } => ({
  checked: radio.getAttribute('aria-checked'),
  tabindex: radio.getAttribute('tabindex'),
});

describe('AM/PM radio group', () => {
  const open = (value: string): TimepickerUI => {
    const input = document.createElement('input');
    input.value = value;
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { clock: { type: '12h' }, ui: { animation: false } });
    picker.create();
    picker.open();
    settle();
    return picker;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('renders a labelled radiogroup of two radios without aria-pressed', () => {
    open('10:15 AM');

    const group = modal().querySelector('.tp-ui-wrapper-type-time') as HTMLElement;
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(group.getAttribute('aria-label')).toBe('Period');
    [am(), pm()].forEach((radio) => {
      expect(radio.getAttribute('role')).toBe('radio');
      expect(radio.hasAttribute('aria-checked')).toBe(true);
      expect(radio.hasAttribute('aria-pressed')).toBe(false);
    });
  });

  it('keeps a roving tabindex on the checked radio', () => {
    open('10:15 AM');
    expect(radioState(am())).toEqual({ checked: 'true', tabindex: '0' });
    expect(radioState(pm())).toEqual({ checked: 'false', tabindex: '-1' });

    pm().click();

    expect(radioState(am())).toEqual({ checked: 'false', tabindex: '-1' });
    expect(radioState(pm())).toEqual({ checked: 'true', tabindex: '0' });
  });

  it.each(['ArrowRight', 'ArrowDown'])('%s on AM moves focus to PM and selects it once', (key) => {
    const picker = open('10:15 AM');
    const onPm = jest.fn();
    const onUpdate = jest.fn();
    picker.on('select:pm', onPm);
    picker.on('update', onUpdate);
    am().focus();

    press(am(), key);
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(document.activeElement).toBe(pm());
    expect(radioState(pm())).toEqual({ checked: 'true', tabindex: '0' });
    expect(radioState(am())).toEqual({ checked: 'false', tabindex: '-1' });
    expect(onPm).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ type: 'PM' }));
    expect(announcer().textContent).toBe('PM selected');
  });

  it.each(['ArrowLeft', 'ArrowUp'])('%s on PM moves focus back to AM and selects it once', (key) => {
    const picker = open('10:15 PM');
    const onAm = jest.fn();
    picker.on('select:am', onAm);
    pm().focus();

    press(pm(), key);
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(document.activeElement).toBe(am());
    expect(radioState(am())).toEqual({ checked: 'true', tabindex: '0' });
    expect(radioState(pm())).toEqual({ checked: 'false', tabindex: '-1' });
    expect(onAm).toHaveBeenCalledTimes(1);
    expect(announcer().textContent).toBe('AM selected');
  });

  it.each([' ', 'Enter'])('key %p on the focused radio selects it', (key) => {
    open('10:15 AM');
    pm().focus();

    press(pm(), key);

    expect(radioState(pm())).toEqual({ checked: 'true', tabindex: '0' });
    expect(radioState(am())).toEqual({ checked: 'false', tabindex: '-1' });
  });

  it('leaves the unchecked radio out of the focus trap candidates', () => {
    open('10:15 AM');
    const wrapper = modal().querySelector('.tp-ui-wrapper') as HTMLElement;
    const candidates = Array.from(
      wrapper.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );

    expect(candidates).toContain(am());
    expect(candidates).not.toContain(pm());

    pm().click();
    const afterClick = Array.from(
      wrapper.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );

    expect(afterClick).toContain(pm());
    expect(afterClick).not.toContain(am());
  });
});
