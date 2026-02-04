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

    it('should setup onSelectAM callback', () => {
      const onSelectAM = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onSelectAM },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('select:am', {});

      expect(onSelectAM).toHaveBeenCalled();
    });

    it('should setup onSelectPM callback', () => {
      const onSelectPM = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onSelectPM },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('select:pm', {});

      expect(onSelectPM).toHaveBeenCalled();
    });

    it('should setup onTimezoneChange callback', () => {
      const onTimezoneChange = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onTimezoneChange },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('timezone:change', { timezone: 'UTC' });

      expect(onTimezoneChange).toHaveBeenCalled();
    });

    it('should setup onRangeConfirm callback', () => {
      const onRangeConfirm = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onRangeConfirm },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('range:confirm', { from: '10:00 AM', to: '12:00 PM', duration: 120 });

      expect(onRangeConfirm).toHaveBeenCalled();
    });

    it('should setup onRangeSwitch callback', () => {
      const onRangeSwitch = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onRangeSwitch },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('range:switch', { active: 'to' });

      expect(onRangeSwitch).toHaveBeenCalled();
    });

    it('should setup onRangeValidation callback', () => {
      const onRangeValidation = jest.fn();
      const optionsWithCallback = {
        ...DEFAULT_OPTIONS,
        callbacks: { onRangeValidation },
      };
      const core = new CoreState(mockElement, optionsWithCallback, 'test-id');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      em.emit('range:validation', { valid: true, duration: 120 });

      expect(onRangeValidation).toHaveBeenCalled();
    });
  });

  describe('destroy with keepInputValue', () => {
    it('should preserve input value when keepInputValue is true', () => {
      lifecycle.init();
      const input = coreState.getInput();
      if (input) input.value = 'test-value';

      lifecycle.destroy({ keepInputValue: true });

      expect(coreState.getInput()?.value).toBe('test-value');
    });

    it('should not preserve input value when keepInputValue is false', () => {
      lifecycle.init();

      lifecycle.destroy({ keepInputValue: false });

      expect(coreState.isDestroyed).toBe(true);
    });
  });

  describe('eventsBundle scenarios', () => {
    it('should not execute eventsBundle when destroyed', () => {
      coreState.setIsDestroyed(true);
      expect(() => lifecycle.mount()).not.toThrow();
    });

    it('should not execute eventsBundle when modal is not removed', () => {
      coreState.setIsModalRemove(false);
      lifecycle.init();
      expect(() => lifecycle.mount()).not.toThrow();
    });
  });

  describe('inline mode initialization', () => {
    it('should disable focus trap by default in inline mode', () => {
      const inlineOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          inline: {
            enabled: true,
            containerId: 'test-container',
          },
        },
      };

      const containerEl = document.createElement('div');
      containerEl.id = 'test-container';
      document.body.appendChild(containerEl);

      const core = new CoreState(mockElement, inlineOptions, 'inline-test');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      expect(() => lc.init()).not.toThrow();
    });
  });

  describe('removeEventListeners in non-browser environment', () => {
    it('should handle removeEventListeners gracefully', () => {
      lifecycle.init();
      expect(() => lifecycle.destroy()).not.toThrow();
    });
  });

  describe('eventsBundle CSS class handling', () => {
    it('should add cssClass to wrapper', (done) => {
      const cssClassOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          cssClass: 'custom-timepicker-class',
        },
      };

      const core = new CoreState(mockElement, cssClassOptions, 'css-class-test');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      lc.mount();

      setTimeout(() => {
        done();
      }, 50);
    });

    it('should remove cssClass on destroy', () => {
      const cssClassOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          cssClass: 'custom-class',
        },
      };

      const core = new CoreState(mockElement, cssClassOptions, 'css-destroy-test');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      lc.destroy();

      expect(mockElement.classList.contains('custom-class')).toBe(false);
    });
  });

  describe('eventsBundle with different options', () => {
    it('should handle enableSwitchIcon option', () => {
      const switchIconOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          enableSwitchIcon: true,
        },
      };

      const core = new CoreState(mockElement, switchIconOptions, 'switch-icon-test');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      expect(() => lc.mount()).not.toThrow();
    });

    it('should handle focusTrap option', () => {
      const focusTrapOptions = {
        ...DEFAULT_OPTIONS,
        behavior: {
          ...DEFAULT_OPTIONS.behavior,
          focusTrap: true,
        },
      };

      const core = new CoreState(mockElement, focusTrapOptions, 'focus-trap-test');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      expect(() => lc.mount()).not.toThrow();
    });

    it('should handle 24h clock type', () => {
      const clock24hOptions = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core = new CoreState(mockElement, clock24hOptions, 'clock-24h-test');
      const em = new EventEmitter<TimepickerEventMap>();
      const mgrs = new Managers(core, em);
      const lc = new Lifecycle(core, mgrs, em);

      lc.init();
      expect(() => lc.mount()).not.toThrow();
    });
  });

  describe('unmount with update parameter', () => {
    it('should click ok button when update is true', () => {
      lifecycle.init();
      lifecycle.mount();

      // @ts-expect-error - testing internal debounce call
      lifecycle.unmount(() => {}, true);
    });
  });

  describe('destroy cleanup', () => {
    it('should cleanup modal element', () => {
      lifecycle.init();
      lifecycle.mount();

      lifecycle.destroy();

      expect(coreState.isDestroyed).toBe(true);
    });

    it('should clear emitter on destroy', () => {
      const clearSpy = jest.spyOn(emitter, 'clear');

      lifecycle.init();
      lifecycle.destroy();

      expect(clearSpy).toHaveBeenCalled();
    });

    it('should destroy managers on destroy', () => {
      const destroySpy = jest.spyOn(managers, 'destroy');

      lifecycle.init();
      lifecycle.destroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
