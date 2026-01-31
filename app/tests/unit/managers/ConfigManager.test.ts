import ConfigManager from '../../../src/managers/ConfigManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('ConfigManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let configManager: ConfigManager;
  let mockElement: HTMLElement;
  let mockInput: HTMLInputElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockInput = document.createElement('input');
    mockInput.type = 'text';
    mockElement.appendChild(mockInput);
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    configManager = new ConfigManager(coreState, emitter);
  });

  afterEach(() => {
    configManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(configManager).toBeInstanceOf(ConfigManager);
    });

    it('should setup event listeners', () => {
      const newEmitter = new EventEmitter<TimepickerEventMap>();
      const onSpy = jest.spyOn(newEmitter, 'on');

      const newManager = new ConfigManager(coreState, newEmitter);

      expect(onSpy).toHaveBeenCalledWith('switch:view', expect.any(Function));

      newManager.destroy();
    });
  });

  describe('preventClockTypeByCurrentTime', () => {
    it('should not throw when called', () => {
      expect(() => configManager.preventClockTypeByCurrentTime()).not.toThrow();
    });

    it('should not update when currentTime is false', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          currentTime: false,
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);
      const updateSpy = jest.spyOn(core, 'updateOptions');

      manager.preventClockTypeByCurrentTime();

      expect(updateSpy).not.toHaveBeenCalled();
      manager.destroy();
    });

    it('should update clock type when currentTime preventClockType is enabled', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          currentTime: { preventClockType: true, updateInput: false },
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);

      jest.spyOn(core, 'getInput').mockReturnValue(mockInput);

      expect(() => manager.preventClockTypeByCurrentTime()).not.toThrow();
      manager.destroy();
    });

    it('should handle boolean currentTime true', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          currentTime: true,
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);

      jest.spyOn(core, 'getInput').mockReturnValue(mockInput);

      expect(() => manager.preventClockTypeByCurrentTime()).not.toThrow();
      manager.destroy();
    });

    it('should return early when input is null', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          currentTime: true,
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);

      jest.spyOn(core, 'getInput').mockReturnValue(null);
      const updateSpy = jest.spyOn(core, 'updateOptions');

      manager.preventClockTypeByCurrentTime();

      expect(updateSpy).not.toHaveBeenCalled();
      manager.destroy();
    });
  });

  describe('updateInputValueWithCurrentTimeOnStart', () => {
    it('should not throw when called', () => {
      expect(() => configManager.updateInputValueWithCurrentTimeOnStart()).not.toThrow();
    });

    it('should not update when currentTime is false', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          currentTime: false,
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);

      jest.spyOn(core, 'getInput').mockReturnValue(mockInput);

      manager.updateInputValueWithCurrentTimeOnStart();

      expect(mockInput.value).toBe('');
      manager.destroy();
    });

    it('should update input value when updateInput is enabled', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          currentTime: { updateInput: true, preventClockType: false },
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);

      jest.spyOn(core, 'getInput').mockReturnValue(mockInput);

      manager.updateInputValueWithCurrentTimeOnStart();

      expect(mockInput.value).not.toBe('');
      manager.destroy();
    });

    it('should update input value when currentTime is boolean true', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          currentTime: true,
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);

      jest.spyOn(core, 'getInput').mockReturnValue(mockInput);

      manager.updateInputValueWithCurrentTimeOnStart();

      expect(mockInput.value).toMatch(/\d{2}:\d{2}/);
      manager.destroy();
    });

    it('should return early when input is null', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          currentTime: true,
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);

      jest.spyOn(core, 'getInput').mockReturnValue(null);

      expect(() => manager.updateInputValueWithCurrentTimeOnStart()).not.toThrow();
      manager.destroy();
    });

    it('should format 24h time without AM/PM', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
          currentTime: true,
        },
      };
      const core = new CoreState(mockElement, options, 'test-id');
      const manager = new ConfigManager(core, emitter);

      const freshInput = document.createElement('input') as HTMLInputElement;
      freshInput.value = '';
      jest.spyOn(core, 'getInput').mockReturnValue(freshInput);

      manager.updateInputValueWithCurrentTimeOnStart();

      expect(freshInput.value).toMatch(/^\d{2}:\d{2}$/);
      manager.destroy();
    });
  });

  describe('checkMobileOption', () => {
    it('should set isMobileView to false when mobile option is false', () => {
      const setSpy = jest.spyOn(coreState, 'setIsMobileView');

      configManager.checkMobileOption();

      expect(setSpy).toHaveBeenCalledWith(false);
    });

    it('should set isMobileView to true when mobile option is true', () => {
      const mobileOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          mobile: true,
        },
      };
      const mobileCore = new CoreState(mockElement, mobileOptions, 'test-mobile');
      const mobileManager = new ConfigManager(mobileCore, emitter);

      const setSpy = jest.spyOn(mobileCore, 'setIsMobileView');
      const updateSpy = jest.spyOn(mobileCore, 'updateOptions');

      mobileManager.checkMobileOption();

      expect(setSpy).toHaveBeenCalledWith(true);
      expect(updateSpy).toHaveBeenCalledWith({ ui: { editable: true } });

      mobileManager.destroy();
    });
  });

  describe('getDisableTime', () => {
    it('should set disabledTime to null when no disabled config', () => {
      const setSpy = jest.spyOn(coreState, 'setDisabledTime');

      configManager.getDisableTime();

      expect(setSpy).toHaveBeenCalledWith(null);
    });

    it('should set disabledTime when disabled hours configured', () => {
      const options = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          disabledTime: {
            hours: ['01', '02', '03'],
          },
        },
      };
      const core = new CoreState(mockElement, options, 'test-disabled');
      const manager = new ConfigManager(core, emitter);

      const setSpy = jest.spyOn(core, 'setDisabledTime');

      manager.getDisableTime();

      expect(setSpy).toHaveBeenCalled();
      const callArg = setSpy.mock.calls[0][0];
      expect(callArg).not.toBeNull();

      manager.destroy();
    });
  });

  describe('getInputValueOnOpenAndSet', () => {
    it('should not throw when input is null', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(null);

      expect(() => configManager.getInputValueOnOpenAndSet()).not.toThrow();
    });

    it('should emit open event with default values when input is empty', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const amButton = document.createElement('button') as HTMLButtonElement;
      amButton.dataset.type = 'AM';
      const amDiv = document.createElement('div') as HTMLDivElement;

      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(amButton);
      jest.spyOn(coreState, 'getAM').mockReturnValue(amDiv);
      const emitSpy = jest.spyOn(emitter, 'emit');

      configManager.getInputValueOnOpenAndSet();

      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({
          hour: '12',
          minutes: '00',
        }),
      );
    });

    it('should set values from input when present', () => {
      mockInput.value = '09:30 AM';

      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const modalEl = document.createElement('div');
      const typeMode = document.createElement('button') as HTMLButtonElement;
      typeMode.dataset.type = 'AM';
      modalEl.appendChild(typeMode);

      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(typeMode);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modalEl);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      const emitSpy = jest.spyOn(emitter, 'emit');

      configManager.getInputValueOnOpenAndSet();

      expect(hourInput.value).toBe('09');
      expect(minutesInput.value).toBe('30');
      expect(emitSpy).toHaveBeenCalledWith('open', expect.any(Object));
    });

    it('should add active class to typeMode when present in modal', () => {
      mockInput.value = '09:30 AM';

      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const modalEl = document.createElement('div');
      const typeMode = document.createElement('div');
      typeMode.setAttribute('data-type', 'AM');
      modalEl.appendChild(typeMode);

      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modalEl);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      configManager.getInputValueOnOpenAndSet();

      expect(typeMode.classList.contains('active')).toBe(true);
    });

    it('should handle empty input value by using returned getInputValue values', () => {
      const emptyInput = document.createElement('input') as HTMLInputElement;
      emptyInput.value = '';

      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getInput').mockReturnValue(emptyInput);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      configManager.getInputValueOnOpenAndSet();

      expect(hourInput.value).toBe('12');
      expect(minutesInput.value).toBe('00');
    });
  });

  describe('getInputValue', () => {
    it('should return input value object', () => {
      mockInput.value = '10:45 PM';

      const result = configManager.getInputValue(mockInput, '12h', false);

      expect(result).toBeDefined();
      expect(result?.hour).toBe('10');
      expect(result?.minutes).toBe('45');
    });

    it('should handle 24h format', () => {
      mockInput.value = '14:30';

      const result = configManager.getInputValue(mockInput, '24h', false);

      expect(result).toBeDefined();
      expect(result?.hour).toBe('14');
      expect(result?.minutes).toBe('30');
    });
  });

  describe('toggleMobileClockFace', () => {
    it('should not throw when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => configManager.toggleMobileClockFace()).not.toThrow();
    });

    it('should not throw when wrapper is missing', () => {
      const modal = document.createElement('div');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      expect(() => configManager.toggleMobileClockFace()).not.toThrow();
    });

    it('should expand clock face when not expanded', () => {
      jest.useFakeTimers();
      const modal = document.createElement('div');
      const wrapper = document.createElement('div');
      wrapper.classList.add('tp-ui-wrapper');
      const mobileClockWrapper = document.createElement('div');
      mobileClockWrapper.classList.add('tp-ui-mobile-clock-wrapper');
      const selectTimeLabel = document.createElement('div');
      selectTimeLabel.classList.add('tp-ui-select-time');
      const icon = document.createElement('button') as HTMLButtonElement;
      const iconButton = document.createElement('div');
      iconButton.classList.add('tp-ui-keyboard-icon');
      icon.appendChild(iconButton);

      modal.appendChild(wrapper);
      modal.appendChild(mobileClockWrapper);
      modal.appendChild(selectTimeLabel);

      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';
      const clockFace = document.createElement('div') as HTMLDivElement;

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getKeyboardClockIcon').mockReturnValue(icon);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);

      configManager.toggleMobileClockFace();

      jest.advanceTimersByTime(500);

      expect(wrapper.classList.contains('expanded')).toBe(true);
    });

    it('should collapse clock face when expanded', () => {
      jest.useFakeTimers();
      const modal = document.createElement('div');
      const wrapper = document.createElement('div');
      wrapper.classList.add('tp-ui-wrapper', 'expanded');
      const mobileClockWrapper = document.createElement('div');
      mobileClockWrapper.classList.add('tp-ui-mobile-clock-wrapper', 'expanded');
      const selectTimeLabel = document.createElement('div');
      selectTimeLabel.classList.add('tp-ui-select-time', 'expanded');

      modal.appendChild(wrapper);
      modal.appendChild(mobileClockWrapper);
      modal.appendChild(selectTimeLabel);

      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const clockFace = document.createElement('div') as HTMLDivElement;

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getKeyboardClockIcon').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);

      configManager.toggleMobileClockFace();

      jest.advanceTimersByTime(500);

      expect(wrapper.classList.contains('expanded')).toBe(false);
    });

    it('should emit select:minute when minutes is active during expand', () => {
      jest.useFakeTimers();
      const modal = document.createElement('div');
      const wrapper = document.createElement('div');
      wrapper.classList.add('tp-ui-wrapper');

      modal.appendChild(wrapper);

      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.classList.add('active');
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getKeyboardClockIcon').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);

      const emitSpy = jest.spyOn(emitter, 'emit');

      configManager.toggleMobileClockFace();

      expect(emitSpy).toHaveBeenCalledWith('select:minute', { minutes: '30' });

      jest.advanceTimersByTime(500);
    });

    it('should emit select:hour when hour is active during expand', () => {
      jest.useFakeTimers();
      const modal = document.createElement('div');
      const wrapper = document.createElement('div');
      wrapper.classList.add('tp-ui-wrapper');

      modal.appendChild(wrapper);

      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getKeyboardClockIcon').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);

      const emitSpy = jest.spyOn(emitter, 'emit');

      configManager.toggleMobileClockFace();

      expect(emitSpy).toHaveBeenCalledWith('select:hour', { hour: '09' });

      jest.advanceTimersByTime(500);
    });
  });

  describe('updateClockFaceAccessibility', () => {
    it('should set aria-hidden when hiding', () => {
      const clockFace = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      tipsWrapper.classList.add('tp-ui-tips-wrapper');
      const tip = document.createElement('div');
      tip.classList.add('tp-ui-tip');
      clockFace.appendChild(tipsWrapper);
      clockFace.appendChild(tip);

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace as HTMLDivElement);

      configManager.updateClockFaceAccessibility(true);

      expect(clockFace.getAttribute('aria-hidden')).toBe('true');
      expect(tipsWrapper.getAttribute('aria-hidden')).toBe('true');
      expect(tip.getAttribute('tabindex')).toBe('-1');
    });

    it('should remove aria-hidden when showing', () => {
      const clockFace = document.createElement('div');
      clockFace.setAttribute('aria-hidden', 'true');
      const tipsWrapper = document.createElement('div');
      tipsWrapper.classList.add('tp-ui-tips-wrapper');
      tipsWrapper.setAttribute('aria-hidden', 'true');
      const tip = document.createElement('div');
      tip.classList.add('tp-ui-tip');
      tip.setAttribute('tabindex', '-1');
      tip.setAttribute('aria-hidden', 'true');
      clockFace.appendChild(tipsWrapper);
      clockFace.appendChild(tip);

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace as HTMLDivElement);

      configManager.updateClockFaceAccessibility(false);

      expect(clockFace.hasAttribute('aria-hidden')).toBe(false);
      expect(tipsWrapper.hasAttribute('aria-hidden')).toBe(false);
      expect(tip.getAttribute('tabindex')).toBe('0');
      expect(tip.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should not throw when clockFace is null', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);

      expect(() => configManager.updateClockFaceAccessibility(true)).not.toThrow();
    });
  });

  describe('switch:view event', () => {
    it('should trigger toggleMobileClockFace on switch:view event', () => {
      const toggleSpy = jest.spyOn(configManager, 'toggleMobileClockFace');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      emitter.emit('switch:view', {});

      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should not throw on destroy', () => {
      expect(() => configManager.destroy()).not.toThrow();
    });
  });
});
