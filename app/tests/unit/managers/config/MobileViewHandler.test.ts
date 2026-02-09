import { mergeOptions } from '../../../../src/utils/options';
import { MobileViewHandler } from '../../../../src/managers/config/MobileViewHandler';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../../src/utils/options/defaults';

describe('MobileViewHandler', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let handler: MobileViewHandler;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    const mockInput = document.createElement('input');
    mockInput.type = 'text';
    mockElement.appendChild(mockInput);
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    handler = new MobileViewHandler(coreState, emitter);
  });

  afterEach(() => {
    handler.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const createMockModal = (): HTMLDivElement => {
    const modal = document.createElement('div');
    modal.className = 'tp-ui-modal';

    const wrapper = document.createElement('div');
    wrapper.className = 'tp-ui-wrapper';

    const mobileClockWrapper = document.createElement('div');
    mobileClockWrapper.className = 'tp-ui-mobile-clock-wrapper';

    const selectTimeLabel = document.createElement('div');
    selectTimeLabel.className = 'tp-ui-select-time';
    selectTimeLabel.textContent = 'Select time';

    const hourInput = document.createElement('input');
    hourInput.type = 'text';
    hourInput.className = 'tp-ui-hour';
    hourInput.value = '12';

    const minuteInput = document.createElement('input');
    minuteInput.type = 'text';
    minuteInput.className = 'tp-ui-minutes';
    minuteInput.value = '00';

    const hourText = document.createElement('div');
    hourText.className = 'tp-ui-hour-text';

    const minuteText = document.createElement('div');
    minuteText.className = 'tp-ui-minute-text';

    const clockFace = document.createElement('div');
    clockFace.className = 'tp-ui-clock-face';

    const tipsWrapper = document.createElement('div');
    tipsWrapper.className = 'tp-ui-tips-wrapper';

    const tipsWrapper24h = document.createElement('div');
    tipsWrapper24h.className = 'tp-ui-tips-wrapper-24h';

    const tip1 = document.createElement('div');
    tip1.className = 'tp-ui-tip';
    tip1.setAttribute('tabindex', '0');

    const tip2 = document.createElement('div');
    tip2.className = 'tp-ui-tip';
    tip2.setAttribute('tabindex', '0');

    tipsWrapper.appendChild(tip1);
    tipsWrapper.appendChild(tip2);
    clockFace.appendChild(tipsWrapper);
    clockFace.appendChild(tipsWrapper24h);

    const icon = document.createElement('button');
    icon.className = 'tp-ui-keyboard-icon';

    const iconButton = document.createElement('span');
    iconButton.className = 'tp-ui-keyboard-icon';
    icon.appendChild(iconButton);

    const header = document.createElement('div');
    header.className = 'tp-ui-header';

    const wrapperTypeTime = document.createElement('div');
    wrapperTypeTime.className = 'tp-ui-wrapper-type-time';

    const amButton = document.createElement('button');
    amButton.className = 'tp-ui-am tp-ui-ripple';

    const pmButton = document.createElement('button');
    pmButton.className = 'tp-ui-pm tp-ui-ripple';

    const inputWrapper1 = document.createElement('div');
    inputWrapper1.className = 'tp-ui-input-wrapper';

    const inputWrapper2 = document.createElement('div');
    inputWrapper2.className = 'tp-ui-input-wrapper';

    const inputRippleWrapper1 = document.createElement('div');
    inputRippleWrapper1.className = 'tp-ui-input-ripple-wrapper';

    const inputRippleWrapper2 = document.createElement('div');
    inputRippleWrapper2.className = 'tp-ui-input-ripple-wrapper';

    wrapper.appendChild(mobileClockWrapper);
    wrapper.appendChild(selectTimeLabel);
    wrapper.appendChild(hourInput);
    wrapper.appendChild(minuteInput);
    wrapper.appendChild(hourText);
    wrapper.appendChild(minuteText);
    wrapper.appendChild(clockFace);
    wrapper.appendChild(icon);
    wrapper.appendChild(header);
    wrapper.appendChild(wrapperTypeTime);
    wrapper.appendChild(amButton);
    wrapper.appendChild(pmButton);
    wrapper.appendChild(inputWrapper1);
    wrapper.appendChild(inputWrapper2);
    wrapper.appendChild(inputRippleWrapper1);
    wrapper.appendChild(inputRippleWrapper2);

    modal.appendChild(wrapper);
    document.body.appendChild(modal);

    return modal;
  };

  describe('constructor', () => {
    it('should create instance', () => {
      expect(handler).toBeInstanceOf(MobileViewHandler);
    });

    it('should setup switch:view event listener', () => {
      const toggleSpy = jest.spyOn(handler, 'toggleMobileClockFace');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      emitter.emit('switch:view', {});

      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('checkMobileOption', () => {
    it('should set mobile view to false when mobile option is disabled', () => {
      handler.checkMobileOption();
      expect(coreState.isMobileView).toBe(false);
    });

    it('should set mobile view to true when mobile option is enabled', () => {
      const mobileOptions = mergeOptions({
        ui: {
          mobile: true,
        },
      });
      coreState = new CoreState(mockElement, mobileOptions, 'test-mobile');
      handler = new MobileViewHandler(coreState, emitter);

      handler.checkMobileOption();
      expect(coreState.isMobileView).toBe(true);
    });

    it('should enable editable when mobile is true', () => {
      const mobileOptions = mergeOptions({
        ui: {
          mobile: true,
        },
      });
      coreState = new CoreState(mockElement, mobileOptions, 'test-mobile');
      handler = new MobileViewHandler(coreState, emitter);

      handler.checkMobileOption();
      expect(coreState.options.ui.editable).toBe(true);
    });
  });

  describe('toggleMobileClockFace', () => {
    it('should not throw when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);
      expect(() => handler.toggleMobileClockFace()).not.toThrow();
    });

    it('should return when wrapper is not found', () => {
      const modal = document.createElement('div');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      expect(() => handler.toggleMobileClockFace()).not.toThrow();
    });

    it('should return if already animating', () => {
      const modal = createMockModal();
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getHour').mockReturnValue(modal.querySelector('.tp-ui-hour'));
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(modal.querySelector('.tp-ui-minutes'));
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(modal.querySelector('.tp-ui-clock-face'));
      jest
        .spyOn(coreState, 'getKeyboardClockIcon')
        .mockReturnValue(modal.querySelector('.tp-ui-keyboard-icon'));

      handler.toggleMobileClockFace();

      const wrapper = modal.querySelector('.tp-ui-wrapper');
      const wasExpanded = wrapper?.classList.contains('expanded');

      handler.toggleMobileClockFace();

      expect(wrapper?.classList.contains('expanded')).toBe(wasExpanded);
    });

    it('should expand clock face when not expanded', () => {
      const modal = createMockModal();
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getHour').mockReturnValue(modal.querySelector('.tp-ui-hour'));
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(modal.querySelector('.tp-ui-minutes'));
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(modal.querySelector('.tp-ui-clock-face'));
      jest
        .spyOn(coreState, 'getKeyboardClockIcon')
        .mockReturnValue(modal.querySelector('.tp-ui-keyboard-icon'));

      const selectHourSpy = jest.fn();
      emitter.on('select:hour', selectHourSpy);

      const wrapper = modal.querySelector('.tp-ui-wrapper');
      expect(wrapper?.classList.contains('expanded')).toBe(false);

      handler.toggleMobileClockFace();

      return new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          expect(wrapper?.classList.contains('expanded')).toBe(true);
          expect(selectHourSpy).toHaveBeenCalledWith({ hour: '12' });
          resolve();
        });
      });
    });

    it('should emit select:minute when minute is active on expand', () => {
      const modal = createMockModal();
      const minuteInput = modal.querySelector('.tp-ui-minutes') as HTMLInputElement;
      minuteInput.classList.add('active');

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getHour').mockReturnValue(modal.querySelector('.tp-ui-hour'));
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minuteInput);
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(modal.querySelector('.tp-ui-clock-face'));
      jest
        .spyOn(coreState, 'getKeyboardClockIcon')
        .mockReturnValue(modal.querySelector('.tp-ui-keyboard-icon'));

      const selectMinuteSpy = jest.fn();
      emitter.on('select:minute', selectMinuteSpy);

      handler.toggleMobileClockFace();

      expect(selectMinuteSpy).toHaveBeenCalledWith({ minutes: '00' });
    });

    it('should collapse clock face when expanded', () => {
      jest.useFakeTimers();

      const modal = createMockModal();
      const wrapper = modal.querySelector('.tp-ui-wrapper');
      wrapper?.classList.add('expanded');

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getHour').mockReturnValue(modal.querySelector('.tp-ui-hour'));
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(modal.querySelector('.tp-ui-minutes'));
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(modal.querySelector('.tp-ui-clock-face'));
      jest
        .spyOn(coreState, 'getKeyboardClockIcon')
        .mockReturnValue(modal.querySelector('.tp-ui-keyboard-icon'));

      handler.toggleMobileClockFace();

      jest.runAllTimers();

      expect(wrapper?.classList.contains('expanded')).toBe(false);
      jest.useRealTimers();
    });

    it('should restore mobile classes when originally mobile on collapse', () => {
      jest.useFakeTimers();

      const mobileOptions = mergeOptions({
        ui: {
          mobile: true,
        },
      });
      coreState = new CoreState(mockElement, mobileOptions, 'test-mobile');
      coreState.setIsMobileView(true);
      handler = new MobileViewHandler(coreState, emitter);

      const modal = createMockModal();
      const wrapper = modal.querySelector('.tp-ui-wrapper');
      wrapper?.classList.add('expanded');

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getHour').mockReturnValue(modal.querySelector('.tp-ui-hour'));
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(modal.querySelector('.tp-ui-minutes'));
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(modal.querySelector('.tp-ui-clock-face'));
      jest
        .spyOn(coreState, 'getKeyboardClockIcon')
        .mockReturnValue(modal.querySelector('.tp-ui-keyboard-icon'));

      handler.toggleMobileClockFace();

      jest.runAllTimers();

      const selectTimeLabel = modal.querySelector('.tp-ui-select-time');
      expect(selectTimeLabel?.classList.contains('mobile')).toBe(true);
      jest.useRealTimers();
    });

    it('should handle SSR environment without requestAnimationFrame on expand', () => {
      const originalRAF = global.requestAnimationFrame;
      delete (global as { requestAnimationFrame?: typeof requestAnimationFrame }).requestAnimationFrame;

      const modal = createMockModal();
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getHour').mockReturnValue(modal.querySelector('.tp-ui-hour'));
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(modal.querySelector('.tp-ui-minutes'));
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(modal.querySelector('.tp-ui-clock-face'));
      jest
        .spyOn(coreState, 'getKeyboardClockIcon')
        .mockReturnValue(modal.querySelector('.tp-ui-keyboard-icon'));

      expect(() => handler.toggleMobileClockFace()).not.toThrow();

      global.requestAnimationFrame = originalRAF;
    });

    it('should handle SSR environment without requestAnimationFrame on collapse', () => {
      const originalRAF = global.requestAnimationFrame;
      delete (global as { requestAnimationFrame?: typeof requestAnimationFrame }).requestAnimationFrame;

      const modal = createMockModal();
      const wrapper = modal.querySelector('.tp-ui-wrapper');
      wrapper?.classList.add('expanded');

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getHour').mockReturnValue(modal.querySelector('.tp-ui-hour'));
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(modal.querySelector('.tp-ui-minutes'));
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(modal.querySelector('.tp-ui-clock-face'));
      jest
        .spyOn(coreState, 'getKeyboardClockIcon')
        .mockReturnValue(modal.querySelector('.tp-ui-keyboard-icon'));

      expect(() => handler.toggleMobileClockFace()).not.toThrow();

      global.requestAnimationFrame = originalRAF;
    });
  });

  describe('updateClockFaceAccessibility', () => {
    it('should not throw when clockFace is null', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);
      expect(() => handler.updateClockFaceAccessibility(true)).not.toThrow();
    });

    it('should set aria-hidden to true when hidden', () => {
      const clockFace = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      tipsWrapper.className = 'tp-ui-tips-wrapper';
      const tipsWrapper24h = document.createElement('div');
      tipsWrapper24h.className = 'tp-ui-tips-wrapper-24h';
      const tip1 = document.createElement('div');
      tip1.className = 'tp-ui-tip';
      const tip2 = document.createElement('div');
      tip2.className = 'tp-ui-tip';

      tipsWrapper.appendChild(tip1);
      clockFace.appendChild(tipsWrapper);
      clockFace.appendChild(tipsWrapper24h);
      clockFace.appendChild(tip2);

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace as HTMLDivElement);

      handler.updateClockFaceAccessibility(true);

      expect(clockFace.getAttribute('aria-hidden')).toBe('true');
      expect(tipsWrapper.getAttribute('aria-hidden')).toBe('true');
      expect(tipsWrapper24h.getAttribute('aria-hidden')).toBe('true');
      expect(tip1.getAttribute('tabindex')).toBe('-1');
      expect(tip1.getAttribute('aria-hidden')).toBe('true');
      expect(tip2.getAttribute('tabindex')).toBe('-1');
      expect(tip2.getAttribute('aria-hidden')).toBe('true');
    });

    it('should remove aria-hidden when not hidden', () => {
      const clockFace = document.createElement('div');
      clockFace.setAttribute('aria-hidden', 'true');
      const tipsWrapper = document.createElement('div');
      tipsWrapper.className = 'tp-ui-tips-wrapper';
      tipsWrapper.setAttribute('aria-hidden', 'true');
      const tip1 = document.createElement('div');
      tip1.className = 'tp-ui-tip';
      tip1.setAttribute('tabindex', '-1');
      tip1.setAttribute('aria-hidden', 'true');

      tipsWrapper.appendChild(tip1);
      clockFace.appendChild(tipsWrapper);

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace as HTMLDivElement);

      handler.updateClockFaceAccessibility(false);

      expect(clockFace.hasAttribute('aria-hidden')).toBe(false);
      expect(tipsWrapper.hasAttribute('aria-hidden')).toBe(false);
      expect(tip1.getAttribute('tabindex')).toBe('0');
      expect(tip1.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  describe('destroy', () => {
    it('should not throw on destroy', () => {
      expect(() => handler.destroy()).not.toThrow();
    });
  });
});

