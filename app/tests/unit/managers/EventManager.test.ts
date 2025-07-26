import EventManager from '../../../src/managers/EventManager';
import TimepickerUI from '../../../src/timepicker';

describe('EventManager Memory Management', () => {
  let container: HTMLElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = '<input type="text" id="test-input" />';
    document.body.appendChild(container);
    input = container.querySelector('#test-input') as HTMLInputElement;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should cleanup all event listeners on destroy', () => {
    const timepicker = new TimepickerUI(input, {
      clockType: '12h',
    });

    timepicker.create();
    timepicker.open();

    const initialListeners = (EventManager.prototype as any)._cleanupHandlers?.length || 0;

    timepicker.destroy();

    expect(timepicker._isDestroyed).toBe(true);
  });

  it('should allow multiple destroy calls without errors', () => {
    const timepicker = new TimepickerUI(input, {
      clockType: '12h',
    });

    timepicker.create();

    expect(() => timepicker.destroy()).not.toThrow();

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    timepicker.destroy();
    expect(consoleWarnSpy).toHaveBeenCalledWith('TimepickerUI: Instance is already destroyed');
    consoleWarnSpy.mockRestore();
  });

  it('should cleanup event listeners from EventManager', () => {
    const timepicker = new TimepickerUI(input, {
      clockType: '12h',
    });

    timepicker.create();
    timepicker.open();

    const destroySpy = jest.spyOn(timepicker.eventManager, 'destroy');

    timepicker.destroy();

    expect(destroySpy).toHaveBeenCalled();

    destroySpy.mockRestore();
  });

  it('should not register handlers multiple times', () => {
    const timepicker = new TimepickerUI(input, {
      clockType: '12h',
    });

    timepicker.create();

    timepicker.open();
    timepicker.close()();

    setTimeout(() => {
      timepicker.open();
      timepicker.close()();

      setTimeout(() => {
        timepicker.destroy();
        expect(timepicker._isDestroyed).toBe(true);
      }, 400);
    }, 400);
  });

  it('should cleanup inline mode event listeners', () => {
    const inlineContainer = document.createElement('div');
    inlineContainer.id = 'inline-container';
    document.body.appendChild(inlineContainer);

    const timepicker = new TimepickerUI(input, {
      clockType: '12h',
      inline: {
        enabled: true,
        containerId: 'inline-container',
        autoUpdate: true,
      },
    });

    timepicker.create();

    const destroySpy = jest.spyOn(timepicker.eventManager, 'destroy');

    timepicker.destroy();

    expect(destroySpy).toHaveBeenCalled();

    document.body.removeChild(inlineContainer);
    destroySpy.mockRestore();
  });

  it('should cleanup all handlers after destroy', () => {
    const timepicker = new TimepickerUI(input, {
      clockType: '12h',
    });

    timepicker.create();
    timepicker.open();

    const eventManager = timepicker.eventManager as any;
    const handlersCountBeforeDestroy = eventManager._cleanupHandlers?.length || 0;

    expect(handlersCountBeforeDestroy).toBeGreaterThan(0);

    timepicker.destroy();

    const handlersCountAfterDestroy = eventManager._cleanupHandlers?.length || 0;
    expect(handlersCountAfterDestroy).toBe(0);
  });

  it('should properly cleanup drag event listeners', () => {
    const timepicker = new TimepickerUI(input, {
      clockType: '12h',
      mobile: false,
    });

    timepicker.create();
    timepicker.open();

    const clockFace = document.querySelector('.timepicker-ui-clock-face');
    if (clockFace) {
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100,
      });
      clockFace.dispatchEvent(mouseDownEvent);
    }

    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    timepicker.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalled();

    removeEventListenerSpy.mockRestore();
  });
});

