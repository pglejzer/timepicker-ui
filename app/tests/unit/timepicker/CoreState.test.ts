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
});

