import RangeManager from '../../../../../src/managers/plugins/range/RangeManager';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';

const createMockCoreState = (enabled = true, clockType: '12h' | '24h' = '12h') => {
  const createMockInput = () => {
    const el = document.createElement('input');
    el.value = '12';
    return el;
  };

  const createMockDiv = () => {
    const el = document.createElement('div');
    return el;
  };

  const createMockButton = () => {
    const el = document.createElement('button');
    return el;
  };

  return {
    getModalElement: jest.fn(),
    getInput: jest.fn().mockReturnValue({ value: '' }),
    getHour: jest.fn().mockReturnValue(createMockInput()),
    getMinutes: jest.fn().mockReturnValue(createMockInput()),
    getActiveTypeMode: jest.fn().mockReturnValue({ textContent: 'AM' }),
    getAM: jest.fn().mockReturnValue(createMockDiv()),
    getPM: jest.fn().mockReturnValue(createMockDiv()),
    getOkButton: jest.fn().mockReturnValue(createMockButton()),
    options: {
      range: { enabled, minDuration: undefined, maxDuration: undefined },
      clock: { type: clockType },
    },
  };
};

const createRangeDOM = (): HTMLDivElement => {
  const modal = document.createElement('div');

  const fromTab = document.createElement('button');
  fromTab.classList.add('tp-ui-range-tab', 'tp-ui-range-from');
  modal.appendChild(fromTab);

  const toTab = document.createElement('button');
  toTab.classList.add('tp-ui-range-tab', 'tp-ui-range-to');
  modal.appendChild(toTab);

  const fromDisplay = document.createElement('span');
  fromDisplay.classList.add('tp-ui-range-from-display');
  modal.appendChild(fromDisplay);

  const toDisplay = document.createElement('span');
  toDisplay.classList.add('tp-ui-range-to-display');
  modal.appendChild(toDisplay);

  const durationDisplay = document.createElement('span');
  durationDisplay.classList.add('tp-ui-range-duration');
  modal.appendChild(durationDisplay);

  return modal;
};

describe('RangeManager', () => {
  let mockCore: ReturnType<typeof createMockCoreState>;
  let emitter: EventEmitter<TimepickerEventMap>;
  let modal: HTMLDivElement;

  beforeEach(() => {
    mockCore = createMockCoreState();
    emitter = new EventEmitter<TimepickerEventMap>();
    modal = createRangeDOM();
    mockCore.getModalElement.mockReturnValue(modal);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create RangeManager instance', () => {
      expect(() => new RangeManager(mockCore as never, emitter)).not.toThrow();
    });
  });

  describe('init', () => {
    it('should not initialize when range is disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new RangeManager(mockCore as never, emitter);

      expect(() => manager.init()).not.toThrow();
    });

    it('should initialize when range is enabled', () => {
      const manager = new RangeManager(mockCore as never, emitter);

      expect(() => manager.init()).not.toThrow();
      expect(manager.getActivePart()).toBe('from');
    });

    it('should parse input value on init', () => {
      mockCore.getInput.mockReturnValue({ value: '10:30 AM - 11:45 AM' });
      const manager = new RangeManager(mockCore as never, emitter);

      manager.init();

      const fromValue = manager.getFromValue();
      expect(fromValue).not.toBeNull();
    });
  });

  describe('getActivePart', () => {
    it('should return from by default', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(manager.getActivePart()).toBe('from');
    });
  });

  describe('setActivePart', () => {
    it('should not change part when range is disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new RangeManager(mockCore as never, emitter);

      manager.setActivePart('to');

      expect(manager.getActivePart()).toBe('from');
    });

    it('should switch to to part after from is complete', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '30', type: 'AM' });

      expect(manager.getActivePart()).toBe('to');
    });

    it('should emit range:switch event when part changes', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      const switchHandler = jest.fn();
      emitter.on('range:switch', switchHandler);

      emitter.emit('range:minute:commit', { hour: '10', minutes: '30', type: 'AM' });

      expect(switchHandler).toHaveBeenCalled();
    });
  });

  describe('getFromValue and getToValue', () => {
    it('should return null when no value set', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(manager.getFromValue()).toBeNull();
      expect(manager.getToValue()).toBeNull();
    });

    it('should return from value after commit', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '30', type: 'AM' });

      const fromValue = manager.getFromValue();
      expect(fromValue).not.toBeNull();
      expect(fromValue?.hour).toBe('10');
      expect(fromValue?.minutes).toBe('30');
    });
  });

  describe('getDisabledTimeForEndPart', () => {
    it('should return null when range is disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new RangeManager(mockCore as never, emitter);

      expect(manager.getDisabledTimeForEndPart()).toBeNull();
    });

    it('should return disabled time config when range is enabled', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '30', type: 'AM' });

      const disabledTime = manager.getDisabledTimeForEndPart();
      expect(disabledTime).toBeDefined();
    });
  });

  describe('getDuration', () => {
    it('should return 0 when no values set', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(manager.getDuration()).toBe(0);
    });

    it('should calculate duration when both values set', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });
      emitter.emit('range:minute:commit', { hour: '11', minutes: '00', type: 'AM' });

      const duration = manager.getDuration();
      expect(duration).toBe(60);
    });
  });

  describe('validateRange', () => {
    it('should return valid true when range is disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new RangeManager(mockCore as never, emitter);

      const result = manager.validateRange();

      expect(result.valid).toBe(true);
      expect(result.duration).toBe(0);
    });

    it('should validate range when enabled', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });
      emitter.emit('range:minute:commit', { hour: '11', minutes: '00', type: 'AM' });

      const result = manager.validateRange();
      expect(result.valid).toBe(true);
    });
  });

  describe('canConfirm', () => {
    it('should return true when range is disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new RangeManager(mockCore as never, emitter);

      expect(manager.canConfirm()).toBe(true);
    });

    it('should return false when range is incomplete', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(manager.canConfirm()).toBe(false);
    });

    it('should return true when range is complete', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });
      emitter.emit('range:minute:commit', { hour: '11', minutes: '00', type: 'AM' });

      expect(manager.canConfirm()).toBe(true);
    });
  });

  describe('getFormattedRange', () => {
    it('should return null when values not set', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(manager.getFormattedRange()).toBeNull();
    });

    it('should return formatted range when both values set', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });
      emitter.emit('range:minute:commit', { hour: '11', minutes: '00', type: 'AM' });

      const formatted = manager.getFormattedRange();
      expect(formatted).not.toBeNull();
      expect(formatted?.from).toBeDefined();
      expect(formatted?.to).toBeDefined();
    });
  });

  describe('confirm handling', () => {
    it('should emit range:confirm event on confirm', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      const confirmHandler = jest.fn();
      emitter.on('range:confirm', confirmHandler);

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });
      emitter.emit('range:minute:commit', { hour: '11', minutes: '00', type: 'AM' });
      emitter.emit('confirm', { hour: '11', minutes: '00', type: 'AM' });

      expect(confirmHandler).toHaveBeenCalled();
    });

    it('should not emit when range is disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      const confirmHandler = jest.fn();
      emitter.on('range:confirm', confirmHandler);

      emitter.emit('confirm', { hour: '11', minutes: '00', type: 'AM' });

      expect(confirmHandler).not.toHaveBeenCalled();
    });
  });

  describe('update handling', () => {
    it('should update preview on update event', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(() => emitter.emit('update', undefined)).not.toThrow();
    });

    it('should not update when range is disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(() => emitter.emit('update', undefined)).not.toThrow();
    });
  });

  describe('AM/PM handling', () => {
    it('should handle select:am event', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'PM' });

      mockCore.getActiveTypeMode.mockReturnValue({ textContent: 'AM' });
      expect(() => emitter.emit('select:am', undefined)).not.toThrow();
    });

    it('should handle select:pm event', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });

      mockCore.getActiveTypeMode.mockReturnValue({ textContent: 'PM' });
      expect(() => emitter.emit('select:pm', undefined)).not.toThrow();
    });

    it('should not handle AM/PM in 24h mode', () => {
      mockCore = createMockCoreState(true, '24h');
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(() => emitter.emit('select:am', undefined)).not.toThrow();
    });

    it('should update to value when active part is to', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });
      emitter.emit('range:minute:commit', { hour: '11', minutes: '00', type: 'AM' });

      mockCore.getActiveTypeMode.mockReturnValue({ textContent: 'PM' });
      expect(() => emitter.emit('select:pm', undefined)).not.toThrow();
    });
  });

  describe('tab click handling', () => {
    it('should switch to from part on from tab click', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });

      const fromTab = modal.querySelector('.tp-ui-range-from');
      fromTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(manager.getActivePart()).toBe('from');
    });

    it('should switch to to part on to tab click when from is complete', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });

      const toTab = modal.querySelector('.tp-ui-range-to');
      toTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(manager.getActivePart()).toBe('to');
    });
  });

  describe('reset', () => {
    it('should reset state', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '10', minutes: '00', type: 'AM' });

      manager.reset();

      expect(manager.getFromValue()).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should clean up event handlers', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(() => manager.destroy()).not.toThrow();
    });

    it('should be safe to call multiple times', () => {
      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();
      manager.destroy();

      expect(() => manager.destroy()).not.toThrow();
    });
  });
});

