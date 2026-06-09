import { KeyboardHandlers } from '../../../../src/managers/events/KeyboardHandlers';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter } from '../../../../src/utils/EventEmitter';
import type { TimepickerEventMap } from '../../../../src/utils/EventEmitter';
import type { TimepickerOptions } from '../../../../src/types/options';
import { mergeOptions } from '../../../../src/utils/options/defaults';

function dispatchKey(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('KeyboardHandlers spinbutton navigation', () => {
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let handlers: KeyboardHandlers;
  let hourInput: HTMLInputElement;
  let minuteInput: HTMLInputElement;

  const setup = (clockType: '12h' | '24h'): void => {
    const hourMin = clockType === '12h' ? '1' : '0';
    const hourMax = clockType === '12h' ? '12' : '23';

    document.body.innerHTML = `
      <div>
        <input type="number" class="tp-ui-hour" min="${hourMin}" max="${hourMax}" value="${hourMin === '1' ? '06' : '06'}" />
        <input type="number" class="tp-ui-minutes" min="0" max="59" value="30" />
        <div class="tp-ui-am active" data-type="AM">AM</div>
      </div>
    `;

    hourInput = document.querySelector('.tp-ui-hour') as HTMLInputElement;
    minuteInput = document.querySelector('.tp-ui-minutes') as HTMLInputElement;

    const options: TimepickerOptions = { clock: { type: clockType }, ui: { mobile: false } };
    core = new CoreState(hourInput, mergeOptions(options), 'kbd-instance');

    jest.spyOn(core, 'getHour').mockReturnValue(hourInput);
    jest.spyOn(core, 'getMinutes').mockReturnValue(minuteInput);
    jest.spyOn(core, 'getActiveTypeMode').mockReturnValue(document.querySelector('.tp-ui-am'));
    jest.spyOn(core, 'getModalElement').mockReturnValue(null);

    emitter = new EventEmitter<TimepickerEventMap>();
    handlers = new KeyboardHandlers(core, emitter);
    handlers.handleKeyboardInput();
  };

  afterEach(() => {
    handlers.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  describe('hour input - 12h mode', () => {
    beforeEach(() => setup('12h'));

    it('ArrowUp increments and updates aria-valuenow', () => {
      dispatchKey(hourInput, 'ArrowUp');
      expect(hourInput.value).toBe('07');
      expect(hourInput.getAttribute('aria-valuenow')).toBe('07');
    });

    it('ArrowDown decrements', () => {
      dispatchKey(hourInput, 'ArrowDown');
      expect(hourInput.value).toBe('05');
    });

    it('ArrowUp wraps from max to min', () => {
      hourInput.value = '12';
      dispatchKey(hourInput, 'ArrowUp');
      expect(hourInput.value).toBe('01');
    });

    it('ArrowDown wraps from min to max', () => {
      hourInput.value = '01';
      dispatchKey(hourInput, 'ArrowDown');
      expect(hourInput.value).toBe('12');
    });

    it('Home jumps to min', () => {
      dispatchKey(hourInput, 'Home');
      expect(hourInput.value).toBe('01');
    });

    it('End jumps to max', () => {
      dispatchKey(hourInput, 'End');
      expect(hourInput.value).toBe('12');
    });

    it('PageUp steps by 3 and clamps at max', () => {
      hourInput.value = '11';
      dispatchKey(hourInput, 'PageUp');
      expect(hourInput.value).toBe('12');
    });

    it('PageDown steps by 3 and clamps at min', () => {
      hourInput.value = '02';
      dispatchKey(hourInput, 'PageDown');
      expect(hourInput.value).toBe('01');
    });

    it('emits select:hour on navigation', () => {
      const spy = jest.fn();
      emitter.on('select:hour', spy);
      dispatchKey(hourInput, 'ArrowUp');
      expect(spy).toHaveBeenCalledWith({ hour: '07' });
    });
  });

  describe('hour input - 24h mode', () => {
    beforeEach(() => setup('24h'));

    it('Home jumps to 00', () => {
      dispatchKey(hourInput, 'Home');
      expect(hourInput.value).toBe('00');
    });

    it('End jumps to 23', () => {
      dispatchKey(hourInput, 'End');
      expect(hourInput.value).toBe('23');
    });

    it('ArrowDown wraps from 0 to 23', () => {
      hourInput.value = '00';
      dispatchKey(hourInput, 'ArrowDown');
      expect(hourInput.value).toBe('23');
    });

    it('PageUp steps by 3 clamped at 23', () => {
      hourInput.value = '22';
      dispatchKey(hourInput, 'PageUp');
      expect(hourInput.value).toBe('23');
    });
  });

  describe('minute input', () => {
    beforeEach(() => setup('24h'));

    it('ArrowUp increments and updates aria-valuenow', () => {
      dispatchKey(minuteInput, 'ArrowUp');
      expect(minuteInput.value).toBe('31');
      expect(minuteInput.getAttribute('aria-valuenow')).toBe('31');
    });

    it('Home jumps to 00', () => {
      dispatchKey(minuteInput, 'Home');
      expect(minuteInput.value).toBe('00');
    });

    it('End jumps to 59', () => {
      dispatchKey(minuteInput, 'End');
      expect(minuteInput.value).toBe('59');
    });

    it('PageUp steps by 5 and clamps at 59', () => {
      minuteInput.value = '57';
      dispatchKey(minuteInput, 'PageUp');
      expect(minuteInput.value).toBe('59');
    });

    it('PageDown steps by 5 and clamps at 0', () => {
      minuteInput.value = '03';
      dispatchKey(minuteInput, 'PageDown');
      expect(minuteInput.value).toBe('00');
    });

    it('ArrowDown wraps from 0 to 59', () => {
      minuteInput.value = '00';
      dispatchKey(minuteInput, 'ArrowDown');
      expect(minuteInput.value).toBe('59');
    });

    it('emits select:minute on navigation', () => {
      const spy = jest.fn();
      emitter.on('select:minute', spy);
      dispatchKey(minuteInput, 'PageUp');
      expect(spy).toHaveBeenCalledWith({ minutes: '35' });
    });
  });
});
