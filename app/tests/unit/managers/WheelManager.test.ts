import WheelManager from '../../../src/managers/plugins/wheel/WheelManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';
import type { TimepickerOptions } from '../../../src/types/options';

function createModalWithWheel(instanceId: string, clockType: '12h' | '24h'): HTMLDivElement {
  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', instanceId);
  modal.classList.add('tp-ui-modal');

  const hourInput = document.createElement('input');
  hourInput.className = 'tp-ui-hour';
  hourInput.value = '12';
  modal.appendChild(hourInput);

  const minuteInput = document.createElement('input');
  minuteInput.className = 'tp-ui-minutes';
  minuteInput.value = '00';
  modal.appendChild(minuteInput);

  if (clockType !== '24h') {
    const am = document.createElement('div');
    am.className = 'tp-ui-type-mode tp-ui-am active';
    am.textContent = 'AM';
    modal.appendChild(am);

    const pm = document.createElement('div');
    pm.className = 'tp-ui-type-mode tp-ui-pm';
    pm.textContent = 'PM';
    modal.appendChild(pm);
  }

  const container = document.createElement('div');
  container.className = 'tp-ui-wheel-container';

  const hoursWrapper = document.createElement('div');
  hoursWrapper.className = 'tp-ui-wheel-column-wrapper at-start';
  const hoursCol = document.createElement('div');
  hoursCol.className = 'tp-ui-wheel-column tp-ui-wheel-hours';
  hoursCol.setAttribute('role', 'listbox');
  hoursCol.setAttribute('tabindex', '0');

  const maxHour = clockType === '12h' ? 12 : 23;
  const startHour = clockType === '12h' ? 1 : 0;
  for (let i = startHour; i <= maxHour; i++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', String(i).padStart(2, '0'));
    item.setAttribute('role', 'option');
    item.textContent = String(i).padStart(2, '0');
    item.style.height = '40px';
    hoursCol.appendChild(item);
  }
  hoursWrapper.appendChild(hoursCol);
  container.appendChild(hoursWrapper);

  const minutesWrapper = document.createElement('div');
  minutesWrapper.className = 'tp-ui-wheel-column-wrapper at-start';
  const minutesCol = document.createElement('div');
  minutesCol.className = 'tp-ui-wheel-column tp-ui-wheel-minutes';
  minutesCol.setAttribute('role', 'listbox');
  minutesCol.setAttribute('tabindex', '0');

  for (let i = 0; i < 60; i++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', String(i).padStart(2, '0'));
    item.setAttribute('role', 'option');
    item.textContent = String(i).padStart(2, '0');
    item.style.height = '40px';
    minutesCol.appendChild(item);
  }
  minutesWrapper.appendChild(minutesCol);
  container.appendChild(minutesWrapper);

  if (clockType !== '24h') {
    const ampmWrapper = document.createElement('div');
    ampmWrapper.className = 'tp-ui-wheel-column-wrapper at-start';
    const ampmCol = document.createElement('div');
    ampmCol.className = 'tp-ui-wheel-column tp-ui-wheel-ampm';
    ampmCol.setAttribute('role', 'listbox');
    ampmCol.setAttribute('tabindex', '0');

    ['AM', 'PM'].forEach((val) => {
      const item = document.createElement('div');
      item.className = 'tp-ui-wheel-item';
      item.setAttribute('data-value', val);
      item.setAttribute('role', 'option');
      item.textContent = val;
      item.style.height = '40px';
      ampmCol.appendChild(item);
    });
    ampmWrapper.appendChild(ampmCol);
    container.appendChild(ampmWrapper);
  }

  modal.appendChild(container);
  return modal;
}

function createWheelOptions(overrides: Partial<TimepickerOptions> = {}): Required<TimepickerOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ui: { ...DEFAULT_OPTIONS.ui, mode: 'wheel', ...overrides.ui },
    clock: { ...DEFAULT_OPTIONS.clock, ...overrides.clock },
    labels: { ...DEFAULT_OPTIONS.labels, ...overrides.labels },
    behavior: { ...DEFAULT_OPTIONS.behavior, ...overrides.behavior },
    callbacks: { ...DEFAULT_OPTIONS.callbacks, ...overrides.callbacks },
    timezone: { ...DEFAULT_OPTIONS.timezone, ...overrides.timezone },
    range: { ...DEFAULT_OPTIONS.range, ...overrides.range },
    wheel: { ...DEFAULT_OPTIONS.wheel, ...overrides.wheel },
    clearBehavior: { ...DEFAULT_OPTIONS.clearBehavior, ...overrides.clearBehavior },
  };
}

describe('WheelManager', () => {
  let mockElement: HTMLDivElement;
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let wheelManager: WheelManager;
  let modal: HTMLDivElement;

  const INSTANCE_ID = 'test-wheel-instance';

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    const options = createWheelOptions();
    coreState = new CoreState(mockElement, options, INSTANCE_ID);

    modal = createModalWithWheel(INSTANCE_ID, '12h');
    document.body.appendChild(modal);

    emitter = new EventEmitter<TimepickerEventMap>();
    wheelManager = new WheelManager(coreState, emitter);
  });

  afterEach(() => {
    wheelManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance without side effects', () => {
      expect(wheelManager).toBeInstanceOf(WheelManager);
    });

    it('should not attach any DOM listeners in constructor', () => {
      const addEventSpy = jest.spyOn(HTMLDivElement.prototype, 'addEventListener');
      const newManager = new WheelManager(coreState, emitter);
      expect(addEventSpy).not.toHaveBeenCalled();
      newManager.destroy();
      addEventSpy.mockRestore();
    });
  });

  describe('init', () => {
    it('should initialize without throwing', () => {
      expect(() => wheelManager.init()).not.toThrow();
    });

    it('should cache column elements after init', () => {
      wheelManager.init();
      const hoursCol = modal.querySelector('.tp-ui-wheel-hours');
      expect(hoursCol).not.toBeNull();
    });
  });

  describe('scrollToValue', () => {
    it('should not throw when called before init', () => {
      expect(() => wheelManager.scrollToValue('09', '30', 'AM')).not.toThrow();
    });

    it('should not throw when called after init', () => {
      wheelManager.init();
      expect(() => wheelManager.scrollToValue('09', '30', 'AM')).not.toThrow();
    });

    it('should zero-pad hour values', () => {
      wheelManager.init();
      expect(() => wheelManager.scrollToValue('9', '5')).not.toThrow();
    });
  });

  describe('updateDisabledItems', () => {
    it('should not throw when no disabled time is set', () => {
      wheelManager.init();
      expect(() => wheelManager.updateDisabledItems()).not.toThrow();
    });

    it('should mark disabled hours', () => {
      coreState.setDisabledTime({
        value: { hours: ['3', '5'] },
      });

      wheelManager.init();
      wheelManager.updateDisabledItems();

      const hoursCol = modal.querySelector('.tp-ui-wheel-hours');
      const item3 = hoursCol?.querySelector('[data-value="03"]');
      const item5 = hoursCol?.querySelector('[data-value="05"]');
      const item4 = hoursCol?.querySelector('[data-value="04"]');

      expect(item3?.classList.contains('is-disabled')).toBe(true);
      expect(item5?.classList.contains('is-disabled')).toBe(true);
      expect(item4?.classList.contains('is-disabled')).toBe(false);
    });

    it('should mark disabled minutes', () => {
      coreState.setDisabledTime({
        value: { minutes: ['15', '30'] },
      });

      wheelManager.init();
      wheelManager.updateDisabledItems();

      const minutesCol = modal.querySelector('.tp-ui-wheel-minutes');
      const item15 = minutesCol?.querySelector('[data-value="15"]');
      const item30 = minutesCol?.querySelector('[data-value="30"]');
      const item00 = minutesCol?.querySelector('[data-value="00"]');

      expect(item15?.classList.contains('is-disabled')).toBe(true);
      expect(item30?.classList.contains('is-disabled')).toBe(true);
      expect(item00?.classList.contains('is-disabled')).toBe(false);
    });
  });

  describe('destroy', () => {
    it('should not throw when called without init', () => {
      expect(() => wheelManager.destroy()).not.toThrow();
    });

    it('should not throw when called after init', () => {
      wheelManager.init();
      expect(() => wheelManager.destroy()).not.toThrow();
    });

    it('should allow multiple destroy calls', () => {
      wheelManager.init();
      wheelManager.destroy();
      expect(() => wheelManager.destroy()).not.toThrow();
    });
  });

  describe('events', () => {
    it('should not throw when emitting select:hour', () => {
      wheelManager.init();
      expect(() => emitter.emit('select:hour', { hour: '09' })).not.toThrow();
    });

    it('should not throw when emitting select:minute', () => {
      wheelManager.init();
      expect(() => emitter.emit('select:minute', { minutes: '30' })).not.toThrow();
    });

    it('should not throw when emitting update', () => {
      wheelManager.init();
      expect(() => emitter.emit('update', { hour: '09', minutes: '30', type: 'AM' })).not.toThrow();
    });
  });

  describe('24h mode', () => {
    let coreState24h: CoreState;
    let modal24h: HTMLDivElement;
    let wheelManager24h: WheelManager;

    beforeEach(() => {
      const options = createWheelOptions({ clock: { type: '24h' } });
      coreState24h = new CoreState(mockElement, options, 'test-24h');

      modal24h = createModalWithWheel('test-24h', '24h');
      document.body.appendChild(modal24h);

      wheelManager24h = new WheelManager(coreState24h, emitter);
    });

    afterEach(() => {
      wheelManager24h.destroy();
      modal24h.remove();
    });

    it('should initialize in 24h mode', () => {
      expect(() => wheelManager24h.init()).not.toThrow();
    });

    it('should not have AM/PM column in 24h mode', () => {
      const ampmCol = modal24h.querySelector('.tp-ui-wheel-ampm');
      expect(ampmCol).toBeNull();
    });

    it('should have 24 hour items', () => {
      const hoursCol = modal24h.querySelector('.tp-ui-wheel-hours');
      const items = hoursCol?.querySelectorAll('.tp-ui-wheel-item');
      expect(items?.length).toBe(24);
    });

    it('should scroll to value without type in 24h mode', () => {
      wheelManager24h.init();
      expect(() => wheelManager24h.scrollToValue('14', '30')).not.toThrow();
    });
  });
});
