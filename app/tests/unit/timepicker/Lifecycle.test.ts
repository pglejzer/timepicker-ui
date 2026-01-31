import { Lifecycle } from '../../../src/timepicker/Lifecycle';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { Managers } from '../../../src/timepicker/Managers';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('Lifecycle', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let managers: Managers;
  let lifecycle: Lifecycle;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    managers = new Managers(coreState, emitter);
    lifecycle = new Lifecycle(coreState, managers, emitter);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState, EventEmitter, and Managers', () => {
      expect(lifecycle).toBeInstanceOf(Lifecycle);
    });
  });

  describe('init', () => {
    it('should initialize lifecycle without throwing', () => {
      expect(() => lifecycle.init()).not.toThrow();
    });

    it('should set isInitialized to true after init', () => {
      lifecycle.init();
      expect(coreState.isInitialized).toBe(true);
    });

    it('should not initialize twice', () => {
      lifecycle.init();
      const firstInit = coreState.isInitialized;
      lifecycle.init();
      expect(firstInit).toBe(true);
    });

    it('should not initialize when destroyed', () => {
      coreState.setIsDestroyed(true);
      lifecycle.init();
      expect(coreState.isInitialized).toBe(false);
    });
  });

  describe('mount', () => {
    it('should mount without throwing', () => {
      expect(() => lifecycle.mount()).not.toThrow();
    });

    it('should initialize if not yet initialized', () => {
      lifecycle.mount();
      expect(coreState.isInitialized).toBe(true);
    });

    it('should not mount when destroyed', () => {
      coreState.setIsDestroyed(true);
      expect(() => lifecycle.mount()).not.toThrow();
    });
  });

  describe('unmount', () => {
    it('should not throw when unmounting without mount', () => {
      expect(() => lifecycle.unmount()).not.toThrow();
    });

    it('should call callback after unmount', (done) => {
      lifecycle.init();
      lifecycle.mount();

      lifecycle.unmount(() => {
        done();
      });
    });
  });

  describe('destroy', () => {
    it('should destroy without throwing', () => {
      lifecycle.init();
      expect(() => lifecycle.destroy()).not.toThrow();
    });

    it('should set isDestroyed to true', () => {
      lifecycle.init();
      lifecycle.destroy();
      expect(coreState.isDestroyed).toBe(true);
    });

    it('should accept callback function', () => {
      lifecycle.init();
      const callback = jest.fn();
      lifecycle.destroy(callback);
      expect(callback).toHaveBeenCalled();
    });

    it('should accept options object with callback', () => {
      lifecycle.init();
      const callback = jest.fn();
      lifecycle.destroy({ callback });
      expect(callback).toHaveBeenCalled();
    });

    it('should not throw when destroyed twice', () => {
      lifecycle.init();
      lifecycle.destroy();
      expect(() => lifecycle.destroy()).not.toThrow();
    });
  });

  describe('callback bridge setup', () => {
    it('should setup onOpen callback', () => {
      const onOpen = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onOpen },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('open', undefined);

      expect(onOpen).toHaveBeenCalled();
    });

    it('should setup onCancel callback', () => {
      const onCancel = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onCancel },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('cancel', undefined);

      expect(onCancel).toHaveBeenCalled();
    });

    it('should setup onConfirm callback', () => {
      const onConfirm = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onConfirm },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('confirm', { hour: '10', minutes: '30', type: 'AM' });

      expect(onConfirm).toHaveBeenCalled();
    });

    it('should setup onUpdate callback', () => {
      const onUpdate = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onUpdate },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('update', undefined);

      expect(onUpdate).toHaveBeenCalled();
    });

    it('should setup onSelectHour callback', () => {
      const onSelectHour = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onSelectHour },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('select:hour', { hour: '10' });

      expect(onSelectHour).toHaveBeenCalled();
    });

    it('should setup onSelectMinute callback', () => {
      const onSelectMinute = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onSelectMinute },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('select:minute', { minutes: '30' });

      expect(onSelectMinute).toHaveBeenCalled();
    });

    it('should setup onError callback', () => {
      const onError = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onError },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('error', { error: 'Test error' });

      expect(onError).toHaveBeenCalled();
    });
  });
});

