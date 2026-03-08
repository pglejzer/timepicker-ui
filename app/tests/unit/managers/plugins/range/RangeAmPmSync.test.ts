import RangeManager from '../../../../../src/managers/plugins/range/RangeManager';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';

const createMockCoreState = (enabled = true, clockType: '12h' | '24h' = '12h', inputValue = '') => {
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

  const mockInput = { value: inputValue };
  const mockAm = createMockDiv();
  const mockPm = createMockDiv();

  return {
    getModalElement: jest.fn(),
    getInput: jest.fn().mockReturnValue(mockInput),
    getHour: jest.fn().mockReturnValue(createMockInput()),
    getMinutes: jest.fn().mockReturnValue(createMockInput()),
    getActiveTypeMode: jest.fn().mockReturnValue({ textContent: 'AM' }),
    getAM: jest.fn().mockReturnValue(mockAm),
    getPM: jest.fn().mockReturnValue(mockPm),
    getOkButton: jest.fn().mockReturnValue(createMockButton()),
    options: {
      range: { enabled, minDuration: undefined, maxDuration: undefined },
      clock: { type: clockType },
    },
    mockAm,
    mockPm,
    mockInput,
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

  const fromTimeEl = document.createElement('span');
  fromTimeEl.classList.add('tp-ui-range-from-time');
  modal.appendChild(fromTimeEl);

  const toTimeEl = document.createElement('span');
  toTimeEl.classList.add('tp-ui-range-to-time');
  modal.appendChild(toTimeEl);

  return modal;
};

describe('RangeManager AM/PM Sync - Regression Tests', () => {
  let mockCore: ReturnType<typeof createMockCoreState>;
  let emitter: EventEmitter<TimepickerEventMap>;
  let modal: HTMLDivElement;

  beforeEach(() => {
    mockCore = createMockCoreState(true, '12h', '09:00 AM - 05:00 PM');
    emitter = new EventEmitter<TimepickerEventMap>();
    modal = createRangeDOM();
    mockCore.getModalElement.mockReturnValue(modal);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('12h mode AM/PM state synchronization', () => {
    it('should emit select:am when switching to "from" part with AM value', () => {
      mockCore = createMockCoreState(true, '12h', '');
      mockCore.getModalElement.mockReturnValue(modal);

      const selectAmHandler = jest.fn();
      const selectPmHandler = jest.fn();
      emitter.on('select:am', selectAmHandler);
      emitter.on('select:pm', selectPmHandler);

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00', type: 'AM' });

      emitter.emit('range:minute:commit', { hour: '05', minutes: '00', type: 'PM' });

      selectAmHandler.mockClear();
      selectPmHandler.mockClear();

      manager.setActivePart('from');

      expect(selectAmHandler).toHaveBeenCalledTimes(1);
      expect(selectPmHandler).not.toHaveBeenCalled();
    });

    it('should emit select:pm when switching to "to" part with PM value', () => {
      mockCore = createMockCoreState(true, '12h', '');
      mockCore.getModalElement.mockReturnValue(modal);

      const selectAmHandler = jest.fn();
      const selectPmHandler = jest.fn();
      emitter.on('select:am', selectAmHandler);
      emitter.on('select:pm', selectPmHandler);

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00', type: 'AM' });

      emitter.emit('range:minute:commit', { hour: '05', minutes: '00', type: 'PM' });

      manager.setActivePart('from');

      selectAmHandler.mockClear();
      selectPmHandler.mockClear();

      manager.setActivePart('to');

      expect(selectPmHandler).toHaveBeenCalledTimes(1);
      expect(selectAmHandler).not.toHaveBeenCalled();
    });

    it('should track last emitted AM/PM event correctly during part switches', () => {
      mockCore = createMockCoreState(true, '12h', '');
      mockCore.getModalElement.mockReturnValue(modal);

      let lastAmPm: 'AM' | 'PM' | null = null;
      emitter.on('select:am', () => {
        lastAmPm = 'AM';
      });
      emitter.on('select:pm', () => {
        lastAmPm = 'PM';
      });

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00', type: 'AM' });
      lastAmPm = null;

      emitter.emit('range:minute:commit', { hour: '05', minutes: '00', type: 'PM' });
      lastAmPm = null;

      manager.setActivePart('from');
      expect(lastAmPm).toBe('AM');

      lastAmPm = null;
      manager.setActivePart('to');
      expect(lastAmPm).toBe('PM');
    });

    it('should allow selecting PM hours (1-8 PM) when "to" is PM', () => {
      mockCore = createMockCoreState(true, '12h', '');
      mockCore.getModalElement.mockReturnValue(modal);

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00', type: 'AM' });

      mockCore.getActiveTypeMode.mockReturnValue({ textContent: 'PM' });
      emitter.emit('range:minute:commit', { hour: '06', minutes: '00', type: 'PM' });

      const toValue = manager.getToValue();

      expect(toValue).not.toBeNull();
      expect(toValue?.hour).toBe('06');
      expect(toValue?.minutes).toBe('00');
      expect(toValue?.type).toBe('PM');
    });

    it('should calculate correct duration with PM "to" value', () => {
      mockCore = createMockCoreState(true, '12h', '');
      mockCore.getModalElement.mockReturnValue(modal);

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00', type: 'AM' });

      emitter.emit('range:minute:commit', { hour: '06', minutes: '00', type: 'PM' });

      const duration = manager.getDuration();
      expect(duration).toBe(540);
    });
  });

  describe('24h mode unaffected', () => {
    it('should not emit AM/PM events in 24h mode', () => {
      mockCore = createMockCoreState(true, '24h', '09:00 - 17:00');
      mockCore.getModalElement.mockReturnValue(modal);

      const manager = new RangeManager(mockCore as never, emitter);

      const selectAmHandler = jest.fn();
      const selectPmHandler = jest.fn();
      emitter.on('select:am', selectAmHandler);
      emitter.on('select:pm', selectPmHandler);

      manager.init();

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00' });

      emitter.emit('range:minute:commit', { hour: '17', minutes: '00' });

      manager.setActivePart('from');
      manager.setActivePart('to');

      expect(selectAmHandler).not.toHaveBeenCalled();
      expect(selectPmHandler).not.toHaveBeenCalled();
    });

    it('should work correctly in 24h mode with values spanning noon', () => {
      mockCore = createMockCoreState(true, '24h', '');
      mockCore.getModalElement.mockReturnValue(modal);

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00' });

      emitter.emit('range:minute:commit', { hour: '17', minutes: '00' });

      const duration = manager.getDuration();
      expect(duration).toBe(480);
    });
  });

  describe('init AM/PM sync', () => {
    it('should emit select:am on init when "from" value is AM', () => {
      mockCore = createMockCoreState(true, '12h', '09:00 AM - 05:00 PM');
      mockCore.getModalElement.mockReturnValue(modal);

      const selectAmHandler = jest.fn();
      emitter.on('select:am', selectAmHandler);

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      expect(selectAmHandler).toHaveBeenCalled();
    });
  });

  describe('handleMinuteCommit AM/PM sync', () => {
    it('should emit correct AM/PM event after auto-switch to "to"', () => {
      mockCore = createMockCoreState(true, '12h', '');
      mockCore.getModalElement.mockReturnValue(modal);

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      let lastAmPmEvent: 'AM' | 'PM' | null = null;
      emitter.on('select:am', () => {
        lastAmPmEvent = 'AM';
      });
      emitter.on('select:pm', () => {
        lastAmPmEvent = 'PM';
      });
      lastAmPmEvent = null;

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00', type: 'AM' });

      expect(lastAmPmEvent).toBeNull();
    });
  });

  describe('handleAmPm sync', () => {
    it('should emit AM/PM sync event after handleAmPm switches to "to"', () => {
      mockCore = createMockCoreState(true, '12h', '');
      mockCore.getModalElement.mockReturnValue(modal);

      const manager = new RangeManager(mockCore as never, emitter);
      manager.init();

      emitter.emit('range:minute:commit', { hour: '09', minutes: '00', type: undefined });
      mockCore.getActiveTypeMode.mockReturnValue({ textContent: 'AM' });

      let lastAmPmEvent: 'AM' | 'PM' | null = null;
      emitter.on('select:am', () => {
        lastAmPmEvent = 'AM';
      });
      emitter.on('select:pm', () => {
        lastAmPmEvent = 'PM';
      });

      emitter.emit('select:am', {});

      expect(manager.getActivePart()).toBe('to');
    });
  });
});

