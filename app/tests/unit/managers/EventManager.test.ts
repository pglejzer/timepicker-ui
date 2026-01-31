import EventManager from '../../../src/managers/EventManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('EventManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let eventManager: EventManager;
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
    eventManager = new EventManager(coreState, emitter);
  });

  afterEach(() => {
    eventManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(eventManager).toBeInstanceOf(EventManager);
    });
  });

  describe('handleOpenOnClick', () => {
    it('should do nothing when no open element exists', () => {
      const emptyNodeList = document.querySelectorAll('.non-existent');
      jest.spyOn(coreState, 'getOpenElement').mockReturnValue(emptyNodeList);
      expect(() => eventManager.handleOpenOnClick()).not.toThrow();
    });

    it('should return early when getOpenElement returns null', () => {
      jest.spyOn(coreState, 'getOpenElement').mockReturnValue(null as unknown as NodeListOf<Element>);
      expect(() => eventManager.handleOpenOnClick()).not.toThrow();
    });

    it('should attach click handler to open elements', () => {
      const openBtn = document.createElement('button');
      openBtn.classList.add('timepicker-ui-open-element');
      openBtn.setAttribute('data-open', 'test');
      mockElement.appendChild(openBtn);

      const nodeList = mockElement.querySelectorAll('[data-open]');
      jest.spyOn(coreState, 'getOpenElement').mockReturnValue(nodeList);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOpenOnClick();
      openBtn.click();

      expect(emitSpy).toHaveBeenCalledWith('show', {});
    });

    it('should not emit when destroyed', () => {
      const openBtn = document.createElement('button');
      openBtn.setAttribute('data-open', 'test');
      mockElement.appendChild(openBtn);
      const nodeList = mockElement.querySelectorAll('[data-open]');
      jest.spyOn(coreState, 'getOpenElement').mockReturnValue(nodeList);
      const emitSpy = jest.spyOn(emitter, 'emit');

      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      eventManager.handleOpenOnClick();
      openBtn.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleOpenOnEnterFocus', () => {
    it('should do nothing when no input exists', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(null);
      expect(() => eventManager.handleOpenOnEnterFocus()).not.toThrow();
    });

    it('should emit show on Enter key', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOpenOnEnterFocus();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      mockInput.dispatchEvent(enterEvent);

      expect(emitSpy).toHaveBeenCalledWith('show', {});
    });

    it('should not emit on other keys', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOpenOnEnterFocus();

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      mockInput.dispatchEvent(tabEvent);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when destroyed', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOpenOnEnterFocus();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      mockInput.dispatchEvent(enterEvent);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleCancelButton', () => {
    it('should do nothing when no cancel button exists', () => {
      jest.spyOn(coreState, 'getCancelButton').mockReturnValue(null);
      expect(() => eventManager.handleCancelButton()).not.toThrow();
    });

    it('should emit cancel on click', () => {
      const cancelBtn = document.createElement('button');
      jest.spyOn(coreState, 'getCancelButton').mockReturnValue(cancelBtn);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleCancelButton();
      cancelBtn.click();

      expect(emitSpy).toHaveBeenCalledWith('cancel', {});
    });

    it('should not emit when destroyed', () => {
      const cancelBtn = document.createElement('button');
      jest.spyOn(coreState, 'getCancelButton').mockReturnValue(cancelBtn);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleCancelButton();
      cancelBtn.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleOkButton', () => {
    it('should do nothing when no OK button exists', () => {
      jest.spyOn(coreState, 'getOkButton').mockReturnValue(null);
      expect(() => eventManager.handleOkButton()).not.toThrow();
    });

    it('should emit confirm with time values on click', () => {
      const okBtn = document.createElement('button');
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';
      const amButton = document.createElement('button');
      amButton.textContent = 'AM';
      amButton.classList.add('active');

      jest.spyOn(coreState, 'getOkButton').mockReturnValue(okBtn);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(amButton);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOkButton();
      okBtn.click();

      expect(emitSpy).toHaveBeenCalledWith('confirm', {
        hour: '09',
        minutes: '30',
        type: 'AM',
      });
    });

    it('should emit confirm with undefined type when no activeTypeMode', () => {
      const okBtn = document.createElement('button');
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '14';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getOkButton').mockReturnValue(okBtn);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOkButton();
      okBtn.click();

      expect(emitSpy).toHaveBeenCalledWith('confirm', {
        hour: '14',
        minutes: '30',
        type: undefined,
      });
    });

    it('should not emit when destroyed', () => {
      const okBtn = document.createElement('button');
      jest.spyOn(coreState, 'getOkButton').mockReturnValue(okBtn);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOkButton();
      okBtn.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleBackdropClick', () => {
    it('should do nothing when no modal exists', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);
      expect(() => eventManager.handleBackdropClick()).not.toThrow();
    });

    it('should emit cancel when clicking on modal backdrop', () => {
      const modal = document.createElement('div');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleBackdropClick();

      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: modal });
      modal.dispatchEvent(clickEvent);

      expect(emitSpy).toHaveBeenCalledWith('cancel', {});
    });

    it('should not emit when clicking inside modal content', () => {
      const modal = document.createElement('div');
      const content = document.createElement('div');
      modal.appendChild(content);

      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleBackdropClick();

      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: content });
      modal.dispatchEvent(clickEvent);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when destroyed', () => {
      const modal = document.createElement('div');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleBackdropClick();

      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: modal });
      modal.dispatchEvent(clickEvent);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleEscClick', () => {
    it('should emit cancel on Escape key', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleEscClick();

      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escEvent);

      expect(emitSpy).toHaveBeenCalledWith('cancel', {});
    });

    it('should not emit on other keys', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleEscClick();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when destroyed', () => {
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleEscClick();

      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escEvent);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleAmClick', () => {
    it('should do nothing when no AM button exists', () => {
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      expect(() => eventManager.handleAmClick()).not.toThrow();
    });

    it('should activate AM and deactivate PM on click', () => {
      const amBtn = document.createElement('div') as HTMLDivElement;
      const pmBtn = document.createElement('div') as HTMLDivElement;
      pmBtn.classList.add('active');

      const modalEl = document.createElement('div') as HTMLDivElement;

      jest.spyOn(coreState, 'getAM').mockReturnValue(amBtn);
      jest.spyOn(coreState, 'getPM').mockReturnValue(pmBtn);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modalEl);
      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleAmClick();
      amBtn.click();

      expect(amBtn.classList.contains('active')).toBe(true);
      expect(pmBtn.classList.contains('active')).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('select:am', {});
    });

    it('should emit update event with hour and minute values', () => {
      const amBtn = document.createElement('div') as HTMLDivElement;
      const pmBtn = document.createElement('div') as HTMLDivElement;
      const modalEl = document.createElement('div') as HTMLDivElement;
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getAM').mockReturnValue(amBtn);
      jest.spyOn(coreState, 'getPM').mockReturnValue(pmBtn);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modalEl);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleAmClick();
      amBtn.click();

      expect(emitSpy).toHaveBeenCalledWith('update', {
        hour: '09',
        minutes: '30',
        type: 'AM',
      });
    });

    it('should not emit when destroyed', () => {
      const amBtn = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getAM').mockReturnValue(amBtn);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleAmClick();
      amBtn.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handlePmClick', () => {
    it('should do nothing when no PM button exists', () => {
      jest.spyOn(coreState, 'getPM').mockReturnValue(null);
      expect(() => eventManager.handlePmClick()).not.toThrow();
    });

    it('should activate PM and deactivate AM on click', () => {
      const amBtn = document.createElement('div') as HTMLDivElement;
      amBtn.classList.add('active');
      const pmBtn = document.createElement('div') as HTMLDivElement;

      const modalEl = document.createElement('div') as HTMLDivElement;

      jest.spyOn(coreState, 'getAM').mockReturnValue(amBtn);
      jest.spyOn(coreState, 'getPM').mockReturnValue(pmBtn);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modalEl);
      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handlePmClick();
      pmBtn.click();

      expect(pmBtn.classList.contains('active')).toBe(true);
      expect(amBtn.classList.contains('active')).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('select:pm', {});
    });

    it('should emit update event with hour and minute values', () => {
      const amBtn = document.createElement('div') as HTMLDivElement;
      const pmBtn = document.createElement('div') as HTMLDivElement;
      const modalEl = document.createElement('div') as HTMLDivElement;
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '05';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '45';

      jest.spyOn(coreState, 'getAM').mockReturnValue(amBtn);
      jest.spyOn(coreState, 'getPM').mockReturnValue(pmBtn);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modalEl);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handlePmClick();
      pmBtn.click();

      expect(emitSpy).toHaveBeenCalledWith('update', {
        hour: '05',
        minutes: '45',
        type: 'PM',
      });
    });

    it('should not emit when destroyed', () => {
      const pmBtn = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getPM').mockReturnValue(pmBtn);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handlePmClick();
      pmBtn.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleHourEvents', () => {
    it('should do nothing when no hour input exists', () => {
      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      expect(() => eventManager.handleHourEvents()).not.toThrow();
    });

    it('should activate hour and deactivate minutes on click', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';
      minutesInput.classList.add('active');

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleHourEvents();
      hourInput.click();

      expect(hourInput.classList.contains('active')).toBe(true);
      expect(minutesInput.classList.contains('active')).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('select:hour', { hour: '09' });
    });

    it('should emit update event with type', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';
      const typeMode = document.createElement('button') as HTMLButtonElement;
      typeMode.textContent = 'AM';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(typeMode);

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleHourEvents();
      hourInput.click();

      expect(emitSpy).toHaveBeenCalledWith('update', {
        hour: '09',
        minutes: '30',
        type: 'AM',
      });
    });

    it('should handle editable blur event', () => {
      const editableOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          editable: true,
        },
      };

      const editableCore = new CoreState(mockElement, editableOptions, 'test-editable');
      const editableManager = new EventManager(editableCore, emitter);

      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(editableCore, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(editableCore, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(editableCore, 'getActiveTypeMode').mockReturnValue(null);

      const emitSpy = jest.spyOn(emitter, 'emit');

      editableManager.handleHourEvents();

      hourInput.value = '10';
      hourInput.dispatchEvent(new Event('blur'));

      expect(emitSpy).toHaveBeenCalledWith('select:hour', { hour: '10' });

      editableManager.destroy();
    });

    it('should not emit on blur when value unchanged', () => {
      const editableOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          editable: true,
        },
      };

      const editableCore = new CoreState(mockElement, editableOptions, 'test-editable');
      const editableManager = new EventManager(editableCore, emitter);

      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(editableCore, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(editableCore, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(editableCore, 'getActiveTypeMode').mockReturnValue(null);

      editableManager.handleHourEvents();

      const emitSpy = jest.spyOn(emitter, 'emit');
      emitSpy.mockClear();

      hourInput.dispatchEvent(new Event('blur'));

      expect(emitSpy).not.toHaveBeenCalledWith('animation:clock', {});

      editableManager.destroy();
    });

    it('should not emit when destroyed', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleHourEvents();
      hourInput.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleMinutesEvents', () => {
    it('should do nothing when no minutes input exists', () => {
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);
      expect(() => eventManager.handleMinutesEvents()).not.toThrow();
    });

    it('should activate minutes and deactivate hour on click', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      hourInput.classList.add('active');
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleMinutesEvents();
      minutesInput.click();

      expect(minutesInput.classList.contains('active')).toBe(true);
      expect(hourInput.classList.contains('active')).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('select:minute', { minutes: '30' });
    });

    it('should not emit when destroyed', () => {
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleMinutesEvents();
      minutesInput.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyboardInput', () => {
    it('should not throw when hour is null', () => {
      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);

      expect(() => eventManager.handleKeyboardInput()).not.toThrow();
    });

    it('should increment hour on ArrowUp', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      hourInput.dispatchEvent(arrowUpEvent);

      expect(hourInput.value).toBe('10');
    });

    it('should decrement hour on ArrowDown', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      hourInput.dispatchEvent(arrowDownEvent);

      expect(hourInput.value).toBe('08');
    });

    it('should wrap hour from 12 to 1 on ArrowUp in 12h mode', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '12';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      hourInput.dispatchEvent(arrowUpEvent);

      expect(hourInput.value).toBe('01');
    });

    it('should wrap hour from 1 to 12 on ArrowDown in 12h mode', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '01';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      hourInput.dispatchEvent(arrowDownEvent);

      expect(hourInput.value).toBe('12');
    });

    it('should wrap hour from 23 to 0 on ArrowUp in 24h mode', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h');
      const manager24h = new EventManager(core24h, emitter);

      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '23';
      hourInput.setAttribute('max', '23');

      jest.spyOn(core24h, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(core24h, 'getMinutes').mockReturnValue(null);
      jest.spyOn(core24h, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(core24h, 'getModalElement').mockReturnValue(null);

      manager24h.handleKeyboardInput();

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      hourInput.dispatchEvent(arrowUpEvent);

      expect(hourInput.value).toBe('00');

      manager24h.destroy();
    });

    it('should wrap hour from 0 to max on ArrowDown in 24h mode', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h');
      const manager24h = new EventManager(core24h, emitter);

      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '00';
      hourInput.setAttribute('max', '23');

      jest.spyOn(core24h, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(core24h, 'getMinutes').mockReturnValue(null);
      jest.spyOn(core24h, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(core24h, 'getModalElement').mockReturnValue(null);

      manager24h.handleKeyboardInput();

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      hourInput.dispatchEvent(arrowDownEvent);

      expect(hourInput.value).toBe('23');

      manager24h.destroy();
    });

    it('should increment minutes on ArrowUp', () => {
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      minutesInput.dispatchEvent(arrowUpEvent);

      expect(minutesInput.value).toBe('31');
    });

    it('should decrement minutes on ArrowDown', () => {
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      minutesInput.dispatchEvent(arrowDownEvent);

      expect(minutesInput.value).toBe('29');
    });

    it('should wrap minutes from 59 to 0 on ArrowUp', () => {
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '59';

      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      minutesInput.dispatchEvent(arrowUpEvent);

      expect(minutesInput.value).toBe('00');
    });

    it('should wrap minutes from 0 to 59 on ArrowDown', () => {
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.value = '00';

      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      minutesInput.dispatchEvent(arrowDownEvent);

      expect(minutesInput.value).toBe('59');
    });

    it('should not do anything on non-arrow keys', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);

      eventManager.handleKeyboardInput();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      hourInput.dispatchEvent(enterEvent);

      expect(hourInput.value).toBe('09');
    });

    it('should not emit when destroyed', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      hourInput.value = '09';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      eventManager.handleKeyboardInput();

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      hourInput.dispatchEvent(arrowUpEvent);

      expect(hourInput.value).toBe('09');
    });
  });

  describe('focusTrapHandler', () => {
    it('should not throw when wrapper is null', () => {
      jest.spyOn(coreState, 'getWrapper').mockReturnValue(null);
      expect(() => eventManager.focusTrapHandler()).not.toThrow();
    });

    it('should trap focus within wrapper on Tab', () => {
      const wrapper = document.createElement('div');
      const firstBtn = document.createElement('button');
      const lastBtn = document.createElement('button');
      wrapper.appendChild(firstBtn);
      wrapper.appendChild(lastBtn);
      document.body.appendChild(wrapper);

      jest.spyOn(coreState, 'getWrapper').mockReturnValue(wrapper);

      eventManager.focusTrapHandler();

      lastBtn.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      wrapper.dispatchEvent(tabEvent);
    });

    it('should trap focus on Shift+Tab from first element', () => {
      const wrapper = document.createElement('div');
      const firstBtn = document.createElement('button');
      const lastBtn = document.createElement('button');
      wrapper.appendChild(firstBtn);
      wrapper.appendChild(lastBtn);
      document.body.appendChild(wrapper);

      jest.spyOn(coreState, 'getWrapper').mockReturnValue(wrapper);

      eventManager.focusTrapHandler();

      firstBtn.focus();
      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      wrapper.dispatchEvent(shiftTabEvent);
    });

    it('should not do anything on non-Tab keys', () => {
      const wrapper = document.createElement('div');
      const btn = document.createElement('button');
      wrapper.appendChild(btn);

      jest.spyOn(coreState, 'getWrapper').mockReturnValue(wrapper);

      eventManager.focusTrapHandler();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      wrapper.dispatchEvent(enterEvent);
    });

    it('should not trap when destroyed', () => {
      const wrapper = document.createElement('div');
      const btn = document.createElement('button');
      wrapper.appendChild(btn);

      jest.spyOn(coreState, 'getWrapper').mockReturnValue(wrapper);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      eventManager.focusTrapHandler();

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      wrapper.dispatchEvent(tabEvent);
    });
  });

  describe('handleMoveHand', () => {
    it('should attach drag handlers', () => {
      expect(() => eventManager.handleMoveHand()).not.toThrow();
    });

    it('should not do anything when destroyed', () => {
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      eventManager.handleMoveHand();

      const mouseEvent = new MouseEvent('mousedown');
      document.dispatchEvent(mouseEvent);
    });
  });

  describe('handleSwitchViewButton', () => {
    it('should do nothing when no switch button exists', () => {
      jest.spyOn(coreState, 'getKeyboardClockIcon').mockReturnValue(null);
      expect(() => eventManager.handleSwitchViewButton()).not.toThrow();
    });

    it('should emit switch:view on click', () => {
      const switchBtn = document.createElement('button');
      jest.spyOn(coreState, 'getKeyboardClockIcon').mockReturnValue(switchBtn);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleSwitchViewButton();
      switchBtn.click();

      expect(emitSpy).toHaveBeenCalledWith('switch:view', {});
    });

    it('should not emit when destroyed', () => {
      const switchBtn = document.createElement('button');
      jest.spyOn(coreState, 'getKeyboardClockIcon').mockReturnValue(switchBtn);
      Object.defineProperty(coreState, 'isDestroyed', { value: true, writable: true });

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleSwitchViewButton();
      switchBtn.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should remove all event listeners', () => {
      const openBtn = document.createElement('button');
      openBtn.setAttribute('data-open', 'test');
      mockElement.appendChild(openBtn);
      const nodeList = mockElement.querySelectorAll('[data-open]');
      jest.spyOn(coreState, 'getOpenElement').mockReturnValue(nodeList);

      eventManager.handleOpenOnClick();

      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.destroy();

      openBtn.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should remove all cleanup handlers', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      eventManager.handleOpenOnEnterFocus();
      eventManager.handleEscClick();

      expect(() => eventManager.destroy()).not.toThrow();
    });
  });
});

