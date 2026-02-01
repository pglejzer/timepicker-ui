import EventManager from '../../../src/managers/EventManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('EventManager - Mobile Input Validation', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let eventManager: EventManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);

    const mobileOptions = {
      ...DEFAULT_OPTIONS,
      ui: {
        ...DEFAULT_OPTIONS.ui,
        mobile: true,
      },
    };

    coreState = new CoreState(mockElement, mobileOptions, 'test-mobile-id');
    emitter = new EventEmitter();
    eventManager = new EventManager(coreState, emitter);
  });

  afterEach(() => {
    eventManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Hour input validation on mobile', () => {
    it('should reject hour > 23 in 24h format', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        ui: { ...DEFAULT_OPTIONS.ui, mobile: true },
        clock: { ...DEFAULT_OPTIONS.clock, type: '24h' as const },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h-id');
      const emitter24h = new EventEmitter<TimepickerEventMap>();
      const manager24h = new EventManager(core24h, emitter24h);

      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-hour mobile" type="number" min="0" max="23" value="12" />`;
      document.body.appendChild(modal);

      const hourInput = modal.querySelector('.tp-ui-hour') as HTMLInputElement;
      jest.spyOn(core24h, 'getHour').mockReturnValue(hourInput);

      manager24h.handleHourEvents();

      hourInput.value = '169';
      hourInput.dispatchEvent(new Event('blur'));

      expect(parseInt(hourInput.value)).toBeLessThanOrEqual(23);

      manager24h.destroy();
      modal.remove();
    });

    it('should reject hour > 12 in 12h format', () => {
      const options12h = {
        ...DEFAULT_OPTIONS,
        ui: { ...DEFAULT_OPTIONS.ui, mobile: true },
        clock: { ...DEFAULT_OPTIONS.clock, type: '12h' as const },
      };

      const core12h = new CoreState(mockElement, options12h, 'test-12h-id');
      const emitter12h = new EventEmitter<TimepickerEventMap>();
      const manager12h = new EventManager(core12h, emitter12h);

      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-hour mobile" type="number" min="0" max="12" value="12" />`;
      document.body.appendChild(modal);

      const hourInput = modal.querySelector('.tp-ui-hour') as HTMLInputElement;
      jest.spyOn(core12h, 'getHour').mockReturnValue(hourInput);

      manager12h.handleHourEvents();

      hourInput.value = '25';
      hourInput.dispatchEvent(new Event('blur'));

      expect(parseInt(hourInput.value)).toBeLessThanOrEqual(12);

      manager12h.destroy();
      modal.remove();
    });

    it('should reject hour < 0', () => {
      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-hour mobile" type="number" min="0" max="23" value="12" />`;
      document.body.appendChild(modal);

      const hourInput = modal.querySelector('.tp-ui-hour') as HTMLInputElement;
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);

      eventManager.handleHourEvents();

      hourInput.value = '-5';
      hourInput.dispatchEvent(new Event('blur'));

      expect(parseInt(hourInput.value)).toBeGreaterThanOrEqual(0);

      modal.remove();
    });

    it('should reject hour = 0 in 12h format', () => {
      const options12h = {
        ...DEFAULT_OPTIONS,
        ui: { ...DEFAULT_OPTIONS.ui, mobile: true },
        clock: { ...DEFAULT_OPTIONS.clock, type: '12h' as const },
      };

      const core12h = new CoreState(mockElement, options12h, 'test-12h-zero-id');
      const emitter12h = new EventEmitter<TimepickerEventMap>();
      const manager12h = new EventManager(core12h, emitter12h);

      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-hour mobile" type="number" min="1" max="12" value="12" />`;
      document.body.appendChild(modal);

      const hourInput = modal.querySelector('.tp-ui-hour') as HTMLInputElement;
      jest.spyOn(core12h, 'getHour').mockReturnValue(hourInput);

      manager12h.handleHourEvents();

      hourInput.value = '0';
      hourInput.dispatchEvent(new Event('blur'));

      expect(parseInt(hourInput.value)).toBeGreaterThan(0);

      manager12h.destroy();
      modal.remove();
    });
  });

  describe('Minute input validation on mobile', () => {
    it('should reject minutes > 59', () => {
      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-minutes mobile" type="number" min="0" max="59" value="30" />`;
      document.body.appendChild(modal);

      const minuteInput = modal.querySelector('.tp-ui-minutes') as HTMLInputElement;
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minuteInput);

      eventManager.handleMinutesEvents();

      minuteInput.value = '70';
      minuteInput.dispatchEvent(new Event('blur'));

      expect(parseInt(minuteInput.value)).toBeLessThanOrEqual(59);

      modal.remove();
    });

    it('should reject minutes < 0', () => {
      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-minutes mobile" type="number" min="0" max="59" value="30" />`;
      document.body.appendChild(modal);

      const minuteInput = modal.querySelector('.tp-ui-minutes') as HTMLInputElement;
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minuteInput);

      eventManager.handleMinutesEvents();

      minuteInput.value = '-10';
      minuteInput.dispatchEvent(new Event('blur'));

      expect(parseInt(minuteInput.value)).toBeGreaterThanOrEqual(0);

      modal.remove();
    });

    it('should handle extreme values like 999', () => {
      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-minutes mobile" type="number" min="0" max="59" value="30" />`;
      document.body.appendChild(modal);

      const minuteInput = modal.querySelector('.tp-ui-minutes') as HTMLInputElement;
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minuteInput);

      eventManager.handleMinutesEvents();

      minuteInput.value = '999';
      minuteInput.dispatchEvent(new Event('blur'));

      expect(parseInt(minuteInput.value)).toBeLessThanOrEqual(59);

      modal.remove();
    });
  });

  describe('Combined hour and minute validation', () => {
    it('should handle invalid input for both hour (169) and minutes (70)', () => {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <input class="tp-ui-hour mobile" type="number" min="0" max="23" value="12" />
        <input class="tp-ui-minutes mobile" type="number" min="0" max="59" value="30" />
      `;
      document.body.appendChild(modal);

      const hourInput = modal.querySelector('.tp-ui-hour') as HTMLInputElement;
      const minuteInput = modal.querySelector('.tp-ui-minutes') as HTMLInputElement;

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minuteInput);

      eventManager.handleHourEvents();
      eventManager.handleMinutesEvents();

      hourInput.value = '169';
      minuteInput.value = '70';

      hourInput.dispatchEvent(new Event('blur'));
      minuteInput.dispatchEvent(new Event('blur'));

      expect(parseInt(hourInput.value)).toBeLessThanOrEqual(23);
      expect(parseInt(minuteInput.value)).toBeLessThanOrEqual(59);

      modal.remove();
    });
  });

  describe('Non-numeric input handling', () => {
    it('should handle empty string gracefully', () => {
      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-hour mobile" type="number" min="0" max="23" value="12" />`;
      document.body.appendChild(modal);

      const hourInput = modal.querySelector('.tp-ui-hour') as HTMLInputElement;
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);

      eventManager.handleHourEvents();

      hourInput.value = '';
      hourInput.dispatchEvent(new Event('blur'));

      expect(hourInput.value === '' || !Number.isNaN(parseInt(hourInput.value))).toBe(true);

      modal.remove();
    });

    it('should handle NaN values', () => {
      const modal = document.createElement('div');
      modal.innerHTML = `<input class="tp-ui-minutes mobile" type="number" min="0" max="59" value="30" />`;
      document.body.appendChild(modal);

      const minuteInput = modal.querySelector('.tp-ui-minutes') as HTMLInputElement;
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minuteInput);

      eventManager.handleMinutesEvents();

      minuteInput.value = 'abc';
      minuteInput.dispatchEvent(new Event('blur'));

      expect(minuteInput.value === '' || !Number.isNaN(parseInt(minuteInput.value))).toBe(true);

      modal.remove();
    });
  });
});

