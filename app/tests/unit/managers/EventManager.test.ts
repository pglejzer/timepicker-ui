import EventManager from '../../../src/managers/EventManager';
import ClearButtonManager from '../../../src/managers/ClearButtonManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS, mergeOptions } from '../../../src/utils/options/defaults';
import type { TimepickerOptions } from '../../../src/types/options';
import type { UpdateEventData } from '../../../src/types/types';

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

    it('should emit show and then open:request when an open element is clicked', () => {
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
      expect(emitSpy.mock.calls.map(([event]) => event)).toEqual(['show', 'open:request']);
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

    it('should emit show and then open:request on Enter key', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOpenOnEnterFocus();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      mockInput.dispatchEvent(enterEvent);

      expect(emitSpy).toHaveBeenCalledWith('show', {});
      expect(emitSpy.mock.calls.map(([event]) => event)).toEqual(['show', 'open:request']);
    });

    it('should not emit on Enter when the picker is already open', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      coreState.setIsOpen(true);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOpenOnEnterFocus();

      mockInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit on Enter while the closed picker still has its modal in the DOM', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);
      coreState.setIsOpen(false);
      coreState.setIsModalRemove(false);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleOpenOnEnterFocus();

      mockInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(emitSpy).not.toHaveBeenCalled();

      coreState.setIsModalRemove(true);
      mockInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(emitSpy.mock.calls.map(([event]) => event)).toEqual(['show', 'open:request']);
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
      amButton.dataset.type = 'AM';
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

    describe('press that moves between the dialog and the backdrop', () => {
      const mountModal = (): { modal: HTMLDivElement; content: HTMLDivElement } => {
        const modal = document.createElement('div');
        const content = document.createElement('div');
        modal.appendChild(content);
        jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
        return { modal, content };
      };

      const press = (down: HTMLElement, up: HTMLElement, modal: HTMLElement): void => {
        down.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        up.dispatchEvent(new Event('pointerup', { bubbles: true }));
        modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      };

      it('should not emit cancel when a press inside the dialog is released over the backdrop', () => {
        const { modal, content } = mountModal();
        const emitSpy = jest.spyOn(emitter, 'emit');

        eventManager.handleBackdropClick();
        press(content, modal, modal);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when a press on the backdrop is released inside the dialog', () => {
        const { modal, content } = mountModal();
        const emitSpy = jest.spyOn(emitter, 'emit');

        eventManager.handleBackdropClick();
        press(modal, content, modal);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should emit cancel when the press starts and ends on the backdrop', () => {
        const { modal } = mountModal();
        const emitSpy = jest.spyOn(emitter, 'emit');

        eventManager.handleBackdropClick();
        press(modal, modal, modal);

        expect(emitSpy).toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when a click inside the dialog comes before the release click', () => {
        const { modal, content } = mountModal();
        const emitSpy = jest.spyOn(emitter, 'emit');

        eventManager.handleBackdropClick();
        content.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        modal.dispatchEvent(new Event('pointerup', { bubbles: true }));
        content.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should still close on a backdrop click that follows a drag released over the backdrop', () => {
        const { modal, content } = mountModal();
        const emitSpy = jest.spyOn(emitter, 'emit');

        eventManager.handleBackdropClick();
        press(content, modal, modal);
        press(modal, modal, modal);

        expect(emitSpy.mock.calls.filter(([event]) => event === 'cancel')).toHaveLength(1);
      });
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

  describe('handlePointerModality', () => {
    const POINTER = 'tp-ui-pointer';

    const mountModal = (): { modal: HTMLDivElement; child: HTMLButtonElement } => {
      const modal = document.createElement('div');
      const child = document.createElement('button');
      modal.appendChild(child);
      document.body.appendChild(modal);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      return { modal, child };
    };

    const pointerDown = (target: HTMLElement): void => {
      target.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    };

    it('should do nothing when no modal exists', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);
      expect(() => eventManager.handlePointerModality()).not.toThrow();
    });

    it('should add the pointer class to the modal on pointerdown inside it', () => {
      const { modal, child } = mountModal();

      eventManager.handlePointerModality();
      pointerDown(child);

      expect(modal.classList.contains(POINTER)).toBe(true);
    });

    it.each(['detach', 'destroy'] as const)(
      'should stop tracking the pointer class after %s()',
      (teardown) => {
        const { modal, child } = mountModal();
        eventManager.handlePointerModality();

        eventManager[teardown]();

        pointerDown(child);
        expect(modal.classList.contains(POINTER)).toBe(false);

        modal.classList.add(POINTER);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        expect(modal.classList.contains(POINTER)).toBe(true);
      },
    );
  });

  describe('handleEscClick', () => {
    it('should emit cancel on Escape key when open', () => {
      coreState.setIsOpen(true);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleEscClick();

      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escEvent);

      expect(emitSpy).toHaveBeenCalledWith('cancel', {});
    });

    it('should not emit cancel on Escape key when closed', () => {
      coreState.setIsOpen(false);
      const emitSpy = jest.spyOn(emitter, 'emit');

      eventManager.handleEscClick();

      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escEvent);

      expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
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
      expect(amBtn.getAttribute('aria-pressed')).toBe('true');
      expect(pmBtn.getAttribute('aria-pressed')).toBe('false');
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
      expect(pmBtn.getAttribute('aria-pressed')).toBe('true');
      expect(amBtn.getAttribute('aria-pressed')).toBe('false');
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
      typeMode.dataset.type = 'AM';

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
      hourInput.setAttribute('max', '12');

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
      hourInput.setAttribute('max', '12');

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

    it('should skip aria-disabled and aria-hidden elements when wrapping focus', () => {
      const wrapper = document.createElement('div');
      const first = document.createElement('button');
      const disabled = document.createElement('button');
      disabled.setAttribute('aria-disabled', 'true');
      const hidden = document.createElement('button');
      hidden.setAttribute('aria-hidden', 'true');
      const last = document.createElement('button');

      [first, disabled, hidden, last].forEach((el) => {
        wrapper.appendChild(el);
        jest
          .spyOn(el, 'getClientRects')
          .mockReturnValue([{ width: 1, height: 1 } as DOMRect] as unknown as DOMRectList);
      });
      document.body.appendChild(wrapper);

      jest.spyOn(coreState, 'getWrapper').mockReturnValue(wrapper);

      eventManager.focusTrapHandler();

      last.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      wrapper.dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(first);
      expect(document.activeElement).not.toBe(disabled);
      expect(document.activeElement).not.toBe(hidden);
    });

    it('should land on the last actionable control on Shift+Tab, skipping disabled/hidden', () => {
      const wrapper = document.createElement('div');
      const first = document.createElement('button');
      const disabled = document.createElement('button');
      disabled.setAttribute('aria-disabled', 'true');
      const hidden = document.createElement('button');
      hidden.setAttribute('aria-hidden', 'true');
      const last = document.createElement('button');

      [first, disabled, hidden, last].forEach((el) => {
        wrapper.appendChild(el);
        jest
          .spyOn(el, 'getClientRects')
          .mockReturnValue([{ width: 1, height: 1 } as DOMRect] as unknown as DOMRectList);
      });
      document.body.appendChild(wrapper);

      jest.spyOn(coreState, 'getWrapper').mockReturnValue(wrapper);

      eventManager.focusTrapHandler();

      first.focus();
      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      wrapper.dispatchEvent(shiftTabEvent);

      expect(document.activeElement).toBe(last);
      expect(document.activeElement).not.toBe(disabled);
      expect(document.activeElement).not.toBe(hidden);
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

describe('EventManager blocks OK on a disabled time', () => {
  type DisabledValue = NonNullable<CoreState['disabledTime']>['value'];

  interface Header {
    hour: string;
    minutes: string;
    period?: 'AM' | 'PM';
  }

  const OWNER_ID = 'ok-guard-instance';
  const BLOCKED_AT_TEN: DisabledValue = { hours: ['10'] };

  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let manager: EventManager;
  let clearButtonManager: ClearButtonManager | null = null;
  let okButton: HTMLElement;
  let hourInput: HTMLInputElement;
  let confirmSpy: jest.Mock;

  const periodButtons = (period: Header['period']): string => {
    if (!period) return '';
    const active = (type: 'AM' | 'PM'): string => (type === period ? ' active' : '');
    return `
      <div class="tp-ui-type-mode tp-ui-am${active('AM')}" role="button" tabindex="0" data-type="AM">AM</div>
      <div class="tp-ui-type-mode tp-ui-pm${active('PM')}" role="button" tabindex="0" data-type="PM">PM</div>
    `;
  };

  const mount = (options: TimepickerOptions, disabled: DisabledValue, header: Header): void => {
    const host = document.createElement('div');
    const input = document.createElement('input');
    input.value = `${header.hour}:${header.minutes}`;
    host.appendChild(input);
    document.body.appendChild(host);

    document.body.insertAdjacentHTML(
      'beforeend',
      `
      <div class="tp-ui-modal" data-owner-id="${OWNER_ID}">
        <div class="tp-ui-wrapper" tabindex="0">
          <input class="tp-ui-hour" type="number" value="${header.hour}" />
          <input class="tp-ui-minutes" type="number" value="${header.minutes}" />
          ${periodButtons(header.period)}
          <div class="tp-ui-clear-btn" role="button" tabindex="0">Clear</div>
          <div class="tp-ui-ok-btn" role="button" tabindex="0">OK</div>
        </div>
        <div class="timepicker-announcer"></div>
      </div>
    `,
    );

    core = new CoreState(host, mergeOptions(options), OWNER_ID);
    core.setDisabledTime({ value: disabled });
    emitter = new EventEmitter<TimepickerEventMap>();
    manager = new EventManager(core, emitter);

    okButton = core.getOkButton() as HTMLElement;
    hourInput = core.getHour() as HTMLInputElement;
    confirmSpy = jest.fn();
    emitter.on('confirm', confirmSpy);
  };

  const press = (el: HTMLElement, key: string): void => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  };

  const okState = (): { ariaDisabled: string | null; disabledClass: boolean } => ({
    ariaDisabled: okButton.getAttribute('aria-disabled'),
    disabledClass: okButton.classList.contains('disabled'),
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    manager.destroy();
    clearButtonManager?.destroy();
    clearButtonManager = null;
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  it('blocks OK at bind when the header time is disabled and unblocks it after an update to an enabled time', () => {
    mount({ clock: { type: '24h' } }, BLOCKED_AT_TEN, { hour: '10', minutes: '15' });

    manager.handleOkButton();

    expect(okState()).toEqual({ ariaDisabled: 'true', disabledClass: true });

    hourInput.value = '11';
    emitter.emit('update', { hour: '11', minutes: '15' });

    expect(okState()).toEqual({ ariaDisabled: 'false', disabledClass: false });
  });

  it.each<[string, (el: HTMLElement) => void]>([
    ['click', (el) => el.click()],
    ['Enter', (el) => press(el, 'Enter')],
    ['Space', (el) => press(el, ' ')],
  ])('emits no confirm on %s while OK is blocked', (_, activate) => {
    mount({ clock: { type: '24h' } }, BLOCKED_AT_TEN, { hour: '10', minutes: '15' });
    manager.handleOkButton();

    activate(okButton);

    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('confirms the header time once it is enabled again', () => {
    mount({ clock: { type: '24h' } }, BLOCKED_AT_TEN, { hour: '10', minutes: '15' });
    manager.handleOkButton();

    hourInput.value = '11';
    emitter.emit('update', { hour: '11', minutes: '15' });
    press(okButton, 'Enter');

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(confirmSpy).toHaveBeenCalledWith({ hour: '11', minutes: '15', type: undefined });
  });

  it('follows the AM/PM toggle when an interval disables only the PM time', () => {
    mount(
      { clock: { type: '12h' } },
      { isInterval: true, clockType: '12h', intervals: ['10:00 PM - 11:00 PM'] },
      { hour: '10', minutes: '00', period: 'AM' },
    );
    manager.handleOkButton();
    manager.handleAmClick();
    manager.handlePmClick();

    expect(okState().ariaDisabled).not.toBe('true');
    expect(okState().disabledClass).toBe(false);

    (core.getPM() as HTMLElement).click();
    expect(okState()).toEqual({ ariaDisabled: 'true', disabledClass: true });

    (core.getAM() as HTMLElement).click();
    expect(okState()).toEqual({ ariaDisabled: 'false', disabledClass: false });
  });

  it('never touches OK when range is enabled', () => {
    mount({ clock: { type: '24h' }, range: { enabled: true } }, BLOCKED_AT_TEN, {
      hour: '10',
      minutes: '15',
    });

    manager.handleOkButton();
    expect(okState()).toEqual({ ariaDisabled: null, disabledClass: false });

    emitter.emit('update', { hour: '10', minutes: '15' });
    expect(okState()).toEqual({ ariaDisabled: null, disabledClass: false });
  });

  it('keeps OK disabled through Clear and re-enables it once an enabled time is chosen', () => {
    mount({ clock: { type: '24h' }, ui: { clearButton: true } }, BLOCKED_AT_TEN, {
      hour: '10',
      minutes: '15',
    });
    manager.handleOkButton();
    manager.handleHourEvents();
    manager.handleMinutesEvents();
    manager.handleKeyboardInput();
    clearButtonManager = new ClearButtonManager(core, emitter);
    clearButtonManager.init();

    expect(okState()).toEqual({ ariaDisabled: 'true', disabledClass: true });

    (document.querySelector('.tp-ui-clear-btn') as HTMLElement).click();

    expect(hourInput.value).toBe('12');
    expect(okState()).toEqual({ ariaDisabled: 'true', disabledClass: true });
    okButton.click();
    expect(confirmSpy).not.toHaveBeenCalled();

    press(hourInput, 'ArrowUp');

    expect(hourInput.value).toBe('13');
    expect(okState()).toEqual({ ariaDisabled: 'false', disabledClass: false });
    okButton.click();
    expect(confirmSpy).toHaveBeenCalledWith({ hour: '13', minutes: '00', type: undefined });
  });

  it.each<[string, UpdateEventData]>([
    ['an empty payload', {}],
    ['a payload without an hour', { minutes: '15' }],
  ])('ignores an update with %s', (_, payload) => {
    mount({ clock: { type: '24h' } }, BLOCKED_AT_TEN, { hour: '10', minutes: '15' });
    manager.handleOkButton();
    hourInput.value = '11';

    emitter.emit('update', payload);
    expect(okState()).toEqual({ ariaDisabled: 'true', disabledClass: true });

    emitter.emit('update', { hour: '11', minutes: '15' });
    expect(okState()).toEqual({ ariaDisabled: 'false', disabledClass: false });
  });
});

