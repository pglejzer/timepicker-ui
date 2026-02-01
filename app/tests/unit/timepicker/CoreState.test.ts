import { CoreState } from '../../../src/timepicker/CoreState';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('CoreState', () => {
  let coreState: CoreState;
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    element.innerHTML = '<input type="text" />';
    document.body.appendChild(element);

    coreState = new CoreState(element, DEFAULT_OPTIONS, 'test-instance-id', 'custom-id');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should initialize with provided values', () => {
      expect(coreState.element).toBe(element);
      expect(coreState.instanceId).toBe('test-instance-id');
      expect(coreState.customId).toBe('custom-id');
      expect(coreState.options).toEqual(DEFAULT_OPTIONS);
    });

    it('should initialize with default state values', () => {
      expect(coreState.degreesHours).toBeNull();
      expect(coreState.degreesMinutes).toBeNull();
      expect(coreState.isMobileView).toBe(false);
      expect(coreState.isTouchMouseMove).toBe(false);
      expect(coreState.disabledTime).toBeNull();
      expect(coreState.cloned).toBeNull();
      expect(coreState.isModalRemove).toBe(true);
      expect(coreState.isInitialized).toBe(false);
      expect(coreState.eventHandlersRegistered).toBe(false);
      expect(coreState.isDestroyed).toBe(false);
    });
  });

  describe('setters', () => {
    it('should set degreesHours', () => {
      coreState.setDegreesHours(90);
      expect(coreState.degreesHours).toBe(90);
    });

    it('should set degreesMinutes', () => {
      coreState.setDegreesMinutes(180);
      expect(coreState.degreesMinutes).toBe(180);
    });

    it('should set isMobileView', () => {
      coreState.setIsMobileView(true);
      expect(coreState.isMobileView).toBe(true);
    });

    it('should set isTouchMouseMove', () => {
      coreState.setIsTouchMouseMove(true);
      expect(coreState.isTouchMouseMove).toBe(true);
    });

    it('should set disabledTime', () => {
      const disabledTime = { value: { hours: ['12', '13'] } };
      coreState.setDisabledTime(disabledTime);
      expect(coreState.disabledTime).toEqual(disabledTime);
    });

    it('should set cloned', () => {
      const clonedNode = document.createElement('div');
      coreState.setCloned(clonedNode);
      expect(coreState.cloned).toBe(clonedNode);
    });

    it('should set isModalRemove', () => {
      coreState.setIsModalRemove(false);
      expect(coreState.isModalRemove).toBe(false);
    });

    it('should set isInitialized', () => {
      coreState.setIsInitialized(true);
      expect(coreState.isInitialized).toBe(true);
    });

    it('should set eventHandlersRegistered', () => {
      coreState.setEventHandlersRegistered(true);
      expect(coreState.eventHandlersRegistered).toBe(true);
    });

    it('should set isDestroyed', () => {
      coreState.setIsDestroyed(true);
      expect(coreState.isDestroyed).toBe(true);
    });
  });

  describe('setOptions', () => {
    it('should replace entire options object', () => {
      const newOptions = {
        ...DEFAULT_OPTIONS,
        clock: { ...DEFAULT_OPTIONS.clock, type: '24h' as const },
      };
      coreState.setOptions(newOptions);
      expect(coreState.options.clock.type).toBe('24h');
    });
  });

  describe('updateOptions', () => {
    it('should merge clock options', () => {
      coreState.updateOptions({ clock: { type: '24h' } });
      expect(coreState.options.clock.type).toBe('24h');
      expect(coreState.options.clock.autoSwitchToMinutes).toBe(true);
    });

    it('should merge ui options', () => {
      coreState.updateOptions({ ui: { theme: 'dark' } });
      expect(coreState.options.ui.theme).toBe('dark');
      expect(coreState.options.ui.animation).toBe(true);
    });

    it('should merge labels options', () => {
      coreState.updateOptions({ labels: { am: 'A.M.' } });
      expect(coreState.options.labels.am).toBe('A.M.');
      expect(coreState.options.labels.pm).toBe('PM');
    });

    it('should merge behavior options', () => {
      coreState.updateOptions({ behavior: { focusTrap: false } });
      expect(coreState.options.behavior.focusTrap).toBe(false);
    });

    it('should merge callbacks options', () => {
      const onOpen = jest.fn();
      coreState.updateOptions({ callbacks: { onOpen } });
      expect(coreState.options.callbacks.onOpen).toBe(onOpen);
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', () => {
      coreState.setDegreesHours(90);
      coreState.setDegreesMinutes(180);
      coreState.setIsTouchMouseMove(true);
      coreState.setIsInitialized(true);

      coreState.reset();

      expect(coreState.degreesHours).toBeNull();
      expect(coreState.degreesMinutes).toBeNull();
      expect(coreState.isTouchMouseMove).toBe(false);
      expect(coreState.isInitialized).toBe(false);
      expect(coreState.isDestroyed).toBe(true);
    });
  });

  describe('getInput', () => {
    it('should return input element', () => {
      const input = coreState.getInput();
      expect(input).toBeInstanceOf(HTMLInputElement);
    });

    it('should return null when no input exists', () => {
      element.innerHTML = '';
      const input = coreState.getInput();
      expect(input).toBeNull();
    });
  });

  describe('getModalElement', () => {
    it('should return null when modal not in DOM', () => {
      const modal = coreState.getModalElement();
      expect(modal).toBeNull();
    });

    it('should return modal when present in DOM', () => {
      const modalEl = document.createElement('div');
      modalEl.setAttribute('data-owner-id', 'test-instance-id');
      document.body.appendChild(modalEl);

      const modal = coreState.getModalElement();
      expect(modal).toBe(modalEl);
    });
  });

  describe('DOM element getters with modal', () => {
    beforeEach(() => {
      const modalEl = document.createElement('div');
      modalEl.setAttribute('data-owner-id', 'test-instance-id');
      modalEl.innerHTML = `
        <div class="tp-ui-clock-face"></div>
        <div class="tp-ui-clock-hand"></div>
        <div class="tp-ui-circle-hand"></div>
        <div class="tp-ui-tips-wrapper"></div>
        <input class="tp-ui-hour" />
        <input class="tp-ui-minutes" />
        <div class="tp-ui-am"></div>
        <div class="tp-ui-pm"></div>
        <div class="tp-ui-cancel-btn"></div>
        <div class="tp-ui-ok-btn"></div>
        <div class="tp-ui-header"></div>
        <div class="tp-ui-footer"></div>
        <div class="tp-ui-wrapper"></div>
      `;
      document.body.appendChild(modalEl);
    });

    it('should get clock face', () => {
      expect(coreState.getClockFace()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get clock hand', () => {
      expect(coreState.getClockHand()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get circle', () => {
      expect(coreState.getCircle()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get tips wrapper', () => {
      expect(coreState.getTipsWrapper()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get hour input', () => {
      expect(coreState.getHour()).toBeInstanceOf(HTMLInputElement);
    });

    it('should get minutes input', () => {
      expect(coreState.getMinutes()).toBeInstanceOf(HTMLInputElement);
    });

    it('should get AM element', () => {
      expect(coreState.getAM()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get PM element', () => {
      expect(coreState.getPM()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get cancel button', () => {
      expect(coreState.getCancelButton()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get OK button', () => {
      expect(coreState.getOkButton()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get header', () => {
      expect(coreState.getHeader()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get footer', () => {
      expect(coreState.getFooter()).toBeInstanceOf(HTMLDivElement);
    });

    it('should get wrapper', () => {
      expect(coreState.getWrapper()).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('DOM element getters in mobile view', () => {
    let modalEl: HTMLDivElement;

    beforeEach(() => {
      modalEl = document.createElement('div');
      modalEl.setAttribute('data-owner-id', 'test-instance-id');
      modalEl.innerHTML = `
        <div class="tp-ui-clock-face mobile"></div>
        <div class="tp-ui-mobile-clock-wrapper">
          <div class="tp-ui-clock-hand"></div>
          <div class="tp-ui-circle-hand"></div>
          <div class="tp-ui-tips-wrapper"></div>
          <div class="tp-ui-tips-wrapper-24h"></div>
        </div>
      `;
      document.body.appendChild(modalEl);
      coreState.setIsMobileView(true);
    });

    it('should get mobile clock face when isMobileView is true', () => {
      const clockFace = coreState.getClockFace();
      expect(clockFace).toBeInstanceOf(HTMLDivElement);
      expect(clockFace?.classList.contains('mobile')).toBe(true);
    });

    it('should get mobile clock hand when isMobileView is true', () => {
      const clockHand = coreState.getClockHand();
      expect(clockHand).toBeInstanceOf(HTMLDivElement);
    });

    it('should get mobile circle when isMobileView is true', () => {
      const circle = coreState.getCircle();
      expect(circle).toBeInstanceOf(HTMLDivElement);
    });

    it('should get mobile tips wrapper when isMobileView is true', () => {
      const tips = coreState.getTipsWrapper();
      expect(tips).toBeInstanceOf(HTMLDivElement);
    });

    it('should get mobile tips wrapper for 24h when isMobileView is true', () => {
      const tips = coreState.getTipsWrapperFor24h();
      expect(tips).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('element getters return null when modal missing', () => {
    it('should return null for getClockFace when no modal', () => {
      expect(coreState.getClockFace()).toBeNull();
    });

    it('should return null for getClockHand when no modal', () => {
      expect(coreState.getClockHand()).toBeNull();
    });

    it('should return null for getCircle when no modal', () => {
      expect(coreState.getCircle()).toBeNull();
    });

    it('should return null for getTipsWrapper when no modal', () => {
      expect(coreState.getTipsWrapper()).toBeNull();
    });

    it('should return null for getHour when no modal', () => {
      expect(coreState.getHour()).toBeNull();
    });

    it('should return null for getMinutes when no modal', () => {
      expect(coreState.getMinutes()).toBeNull();
    });

    it('should return null for getAM when no modal', () => {
      expect(coreState.getAM()).toBeNull();
    });

    it('should return null for getPM when no modal', () => {
      expect(coreState.getPM()).toBeNull();
    });

    it('should return null for getCancelButton when no modal', () => {
      expect(coreState.getCancelButton()).toBeNull();
    });

    it('should return null for getOkButton when no modal', () => {
      expect(coreState.getOkButton()).toBeNull();
    });

    it('should return null for getHeader when no modal', () => {
      expect(coreState.getHeader()).toBeNull();
    });

    it('should return null for getFooter when no modal', () => {
      expect(coreState.getFooter()).toBeNull();
    });

    it('should return null for getWrapper when no modal', () => {
      expect(coreState.getWrapper()).toBeNull();
    });
  });

  describe('getActiveTypeMode', () => {
    it('should return null when no modal', () => {
      expect(coreState.getActiveTypeMode()).toBeNull();
    });

    it('should return null when no active type mode element', () => {
      const modalEl = document.createElement('div');
      modalEl.setAttribute('data-owner-id', 'test-instance-id');
      document.body.appendChild(modalEl);
      expect(coreState.getActiveTypeMode()).toBeNull();
    });

    it('should return active type mode element when present', () => {
      const modalEl = document.createElement('div');
      modalEl.setAttribute('data-owner-id', 'test-instance-id');
      const typeMode = document.createElement('button');
      typeMode.className = 'tp-ui-type-mode active';
      typeMode.textContent = 'AM';
      modalEl.appendChild(typeMode);
      document.body.appendChild(modalEl);

      expect(coreState.getActiveTypeMode()).toBe(typeMode);
    });
  });
});
