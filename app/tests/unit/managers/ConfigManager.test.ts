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

    it('should set isMobileView to true when mobile option is true without rewriting the options', () => {
      const mobileOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          mobile: true,
        },
      };
      const mobileCore = new CoreState(mockElement, mobileOptions, 'test-mobile');
      const mobileManager = new ConfigManager(mobileCore, emitter);
      const optionsBefore = mobileCore.options;

      const setSpy = jest.spyOn(mobileCore, 'setIsMobileView');
      const updateSpy = jest.spyOn(mobileCore, 'updateOptions');

      mobileManager.checkMobileOption();

      expect(setSpy).toHaveBeenCalledWith(true);
      expect(mobileCore.isMobileView).toBe(true);
      expect(updateSpy).not.toHaveBeenCalled();
      expect(mobileCore.options).toBe(optionsBefore);
      expect(mobileCore.options.ui.editable).toBe(false);

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

  describe('updateClockFaceAccessibility', () => {
    const createDial = (): { clockFace: HTMLDivElement; tipsWrapper: HTMLDivElement } => {
      const clockFace = document.createElement('div');
      clockFace.setAttribute('role', 'slider');
      clockFace.tabIndex = 0;
      const tipsWrapper = document.createElement('div');
      tipsWrapper.classList.add('tp-ui-tips-wrapper');
      clockFace.appendChild(tipsWrapper);

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      return { clockFace, tipsWrapper };
    };

    it('should hide the dial and take it out of the tab order when hiding', () => {
      const { clockFace, tipsWrapper } = createDial();

      configManager.updateClockFaceAccessibility(true);

      expect(clockFace.getAttribute('aria-hidden')).toBe('true');
      expect(clockFace.tabIndex).toBe(-1);
      expect(tipsWrapper).not.toHaveAttribute('aria-hidden');
    });

    it('should expose the dial and make it focusable again when showing, leaving the tips wrapper alone', () => {
      const { clockFace, tipsWrapper } = createDial();
      configManager.updateClockFaceAccessibility(true);

      configManager.updateClockFaceAccessibility(false);

      expect(clockFace.hasAttribute('aria-hidden')).toBe(false);
      expect(clockFace.tabIndex).toBe(0);
      expect(tipsWrapper).not.toHaveAttribute('aria-hidden');
    });

    it('should not throw when clockFace is null', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);

      expect(() => configManager.updateClockFaceAccessibility(true)).not.toThrow();
    });
  });

  describe('syncInputFormat', () => {
    it('should rewrite the input in the clock format the options changed to', () => {
      const previousOptions = coreState.options;
      coreState.updateOptions({ clock: { type: '24h' } });
      mockInput.value = '03:45 PM';

      configManager.syncInputFormat(previousOptions);

      expect(mockInput.value).toBe('15:45');
    });
  });

  describe('destroy', () => {
    it('should not throw on destroy', () => {
      expect(() => configManager.destroy()).not.toThrow();
    });
  });
});
