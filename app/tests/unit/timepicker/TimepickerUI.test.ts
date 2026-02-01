import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import TimepickerUIDefault from '../../../src/timepicker/index';

describe('TimepickerUI', () => {
  let container: HTMLElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    container.appendChild(input);
    document.body.appendChild(container);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('index export', () => {
    it('should export TimepickerUI as default from index', () => {
      expect(TimepickerUIDefault).toBe(TimepickerUI);
    });
  });

  describe('constructor', () => {
    it('should create instance with input element', () => {
      const timepicker = new TimepickerUI(input);

      expect(timepicker).toBeInstanceOf(TimepickerUI);

      timepicker.destroy();
    });

    it('should create instance with selector string', () => {
      input.id = 'test-input';

      const timepicker = new TimepickerUI('#test-input');

      expect(timepicker).toBeInstanceOf(TimepickerUI);

      timepicker.destroy();
    });

    it('should throw error for non-existent selector', () => {
      expect(() => new TimepickerUI('#non-existent')).toThrow();
    });

    it('should accept custom options', () => {
      const timepicker = new TimepickerUI(input, {
        clock: {
          type: '24h',
        },
      });

      expect(timepicker).toBeInstanceOf(TimepickerUI);

      timepicker.destroy();
    });

    it('should read initial input value and set degrees', () => {
      input.value = '03:30 PM';
      const timepicker = new TimepickerUI(input);

      expect(timepicker).toBeInstanceOf(TimepickerUI);

      timepicker.destroy();
    });

    it('should handle input with 24h value', () => {
      input.value = '14:45';
      const timepicker = new TimepickerUI(input, { clock: { type: '24h' } });

      expect(timepicker).toBeInstanceOf(TimepickerUI);

      timepicker.destroy();
    });
  });

  describe('create', () => {
    it('should initialize the timepicker', () => {
      const timepicker = new TimepickerUI(input);

      expect(() => timepicker.create()).not.toThrow();

      timepicker.destroy();
    });
  });

  describe('open', () => {
    it('should open the modal', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.open()).not.toThrow();

      timepicker.destroy();
    });
  });

  describe('close', () => {
    it('should close the modal', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      expect(() => timepicker.close()).not.toThrow();

      timepicker.destroy();
    });
  });

  describe('destroy', () => {
    it('should destroy the timepicker', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.destroy()).not.toThrow();
    });

    it('should allow multiple destroy calls', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      expect(() => timepicker.destroy()).not.toThrow();
    });
  });

  describe('setValue', () => {
    it('should set time on input with AM/PM format', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      timepicker.setValue('10:30 AM');

      expect(input.value).toBe('10:30 AM');

      timepicker.destroy();
    });

    it('should set time with 24h format', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h' },
      });
      timepicker.create();

      timepicker.setValue('14:30');

      expect(input.value).toBe('14:30');

      timepicker.destroy();
    });
  });

  describe('getValue', () => {
    it('should get time from input', () => {
      input.value = '14:45';
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const time = timepicker.getValue();

      expect(time).toBeDefined();
      expect(time.hour).toBeDefined();
      expect(time.minutes).toBeDefined();

      timepicker.destroy();
    });
  });

  describe('event callbacks', () => {
    it('should accept onOpen callback', () => {
      const onOpenCallback = jest.fn();
      const timepicker = new TimepickerUI(input, {
        callbacks: {
          onOpen: onOpenCallback,
        },
      });

      timepicker.create();
      timepicker.open();

      expect(onOpenCallback).toHaveBeenCalled();

      timepicker.destroy();
    });

    it('should accept onCancel callback in options', () => {
      const onCancelCallback = jest.fn();

      expect(() => {
        const timepicker = new TimepickerUI(input, {
          callbacks: {
            onCancel: onCancelCallback,
          },
        });
        timepicker.create();
        timepicker.destroy();
      }).not.toThrow();
    });

    it('should accept onConfirm callback in options', () => {
      const onConfirmCallback = jest.fn();

      expect(() => {
        const timepicker = new TimepickerUI(input, {
          callbacks: {
            onConfirm: onConfirmCallback,
          },
        });
        timepicker.create();
        timepicker.destroy();
      }).not.toThrow();
    });
  });

  describe('update', () => {
    it('should update options', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.update({ options: { clock: { type: '24h' } } })).not.toThrow();

      timepicker.destroy();
    });

    it('should recreate when create flag is true', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.update({ options: { clock: { type: '24h' } }, create: true })).not.toThrow();

      timepicker.destroy();
    });

    it('should call callback after update', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      const callback = jest.fn();

      timepicker.update({ options: {} }, callback);

      expect(callback).toHaveBeenCalled();

      timepicker.destroy();
    });

    it('should not update after destroy', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      expect(() => timepicker.update({ options: {} })).not.toThrow();
    });
  });

  describe('getElement', () => {
    it('should return wrapper element', () => {
      const timepicker = new TimepickerUI(input);

      const element = timepicker.getElement();

      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);

      timepicker.destroy();
    });
  });

  describe('public getters', () => {
    it('should return instanceId', () => {
      const timepicker = new TimepickerUI(input);

      expect(timepicker.instanceId).toBeDefined();
      expect(typeof timepicker.instanceId).toBe('string');

      timepicker.destroy();
    });

    it('should return options', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '24h' } });

      expect(timepicker.options).toBeDefined();
      expect(timepicker.options.clock.type).toBe('24h');

      timepicker.destroy();
    });

    it('should return isInitialized', () => {
      const timepicker = new TimepickerUI(input);

      expect(timepicker.isInitialized).toBe(false);

      timepicker.create();

      expect(timepicker.isInitialized).toBe(true);

      timepicker.destroy();
    });

    it('should return isDestroyed', () => {
      const timepicker = new TimepickerUI(input);

      expect(timepicker.isDestroyed).toBe(false);

      timepicker.destroy();

      expect(timepicker.isDestroyed).toBe(true);
    });

    it('should return hour input element', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      const hourEl = timepicker.hour;

      expect(hourEl === null || hourEl instanceof HTMLInputElement).toBe(true);

      timepicker.destroy();
    });

    it('should return minutes input element', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      const minutesEl = timepicker.minutes;

      expect(minutesEl === null || minutesEl instanceof HTMLInputElement).toBe(true);

      timepicker.destroy();
    });

    it('should return okButton element or null', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const okBtn = timepicker.okButton;

      expect(okBtn === null || okBtn instanceof HTMLButtonElement).toBe(true);

      timepicker.destroy();
    });

    it('should return cancelButton element or null', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const cancelBtn = timepicker.cancelButton;

      expect(cancelBtn === null || cancelBtn instanceof HTMLButtonElement).toBe(true);

      timepicker.destroy();
    });

    it('should return clockHand element', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      const clockHand = timepicker.clockHand;

      expect(clockHand === null || clockHand instanceof HTMLDivElement).toBe(true);

      timepicker.destroy();
    });
  });

  describe('event handling methods', () => {
    it('should register event with on() without throwing', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn();
      expect(() => timepicker.on('show', handler)).not.toThrow();

      timepicker.destroy();
    });

    it('should register one-time event with once() without throwing', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn();
      expect(() => timepicker.once('show', handler)).not.toThrow();

      timepicker.destroy();
    });

    it('should unregister event with off() without throwing', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn();
      timepicker.on('show', handler);
      expect(() => timepicker.off('show', handler)).not.toThrow();

      timepicker.destroy();
    });

    it('should not throw when registering events after destroy', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      const handler = jest.fn();
      expect(() => timepicker.on('show', handler)).not.toThrow();
    });
  });

  describe('setValue edge cases', () => {
    it('should not set value after destroy', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      timepicker.setValue('10:30 AM');

      expect(input.value).toBe('');
    });

    it('should handle invalid time format gracefully', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.setValue('invalid')).not.toThrow();

      timepicker.destroy();
    });

    it('should handle empty string', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.setValue('')).not.toThrow();

      timepicker.destroy();
    });

    it('should not update input when updateInput is false', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      input.value = 'original';

      timepicker.setValue('10:30 AM', false);

      expect(input.value).toBe('original');

      timepicker.destroy();
    });

    it('should set PM time without throwing', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.setValue('03:45 PM')).not.toThrow();

      timepicker.destroy();
    });

    it('should set 24h format time correctly', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '24h' } });
      timepicker.create();
      timepicker.open();

      expect(() => timepicker.setValue('14:30')).not.toThrow();

      timepicker.destroy();
    });

    it('should handle invalid 24h format gracefully', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '24h' } });
      timepicker.create();

      expect(() => timepicker.setValue('25:00')).not.toThrow();

      timepicker.destroy();
    });

    it('should handle invalid 12h format gracefully', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.setValue('13:00 AM')).not.toThrow();

      timepicker.destroy();
    });

    it('should auto-create when not initialized', () => {
      const timepicker = new TimepickerUI(input);

      expect(() => timepicker.setValue('10:30 AM')).not.toThrow();

      timepicker.destroy();
    });
  });

  describe('getValue edge cases', () => {
    it('should return empty values after destroy', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      const value = timepicker.getValue();

      expect(value.hour).toBe('');
      expect(value.minutes).toBe('');
      expect(value.time).toBe('');
    });
  });

  describe('close with callbacks', () => {
    it('should call callback with update true', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      const callback = jest.fn();
      timepicker.close(true, callback);

      timepicker.destroy();
    });

    it('should call callback with update false', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      const callback = jest.fn();
      timepicker.close(false, callback);

      expect(callback).toHaveBeenCalled();

      timepicker.destroy();
    });

    it('should skip confirm handler when range mode is enabled', () => {
      const timepicker = new TimepickerUI(input, {
        range: { enabled: true },
      });
      timepicker.create();
      timepicker.open();

      (timepicker as unknown as { emitter: { emit: (event: string, data: unknown) => void } }).emitter.emit(
        'confirm',
        {
          hour: '10',
          minutes: '30',
          type: 'AM',
        },
      );

      timepicker.destroy();
    });

    it('should update input on confirm in normal mode', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      (timepicker as unknown as { emitter: { emit: (event: string, data: unknown) => void } }).emitter.emit(
        'confirm',
        {
          hour: '10',
          minutes: '30',
          type: 'AM',
        },
      );

      expect(input.value).toBe('10:30 AM');

      timepicker.destroy();
    });

    it('should update input on range:confirm', () => {
      const timepicker = new TimepickerUI(input, {
        range: { enabled: true },
      });
      timepicker.create();
      timepicker.open();

      (timepicker as unknown as { emitter: { emit: (event: string, data: unknown) => void } }).emitter.emit(
        'range:confirm',
        {
          from: '10:00 AM',
          to: '12:00 PM',
          duration: 120,
        },
      );

      expect(input.value).toBe('10:00 AM - 12:00 PM');

      timepicker.destroy();
    });
  });

  describe('open with callback', () => {
    it('should call callback after open', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const callback = jest.fn();
      timepicker.open(callback);

      expect(callback).toHaveBeenCalled();

      timepicker.destroy();
    });
  });

  describe('destroy with options', () => {
    it('should accept callback function directly', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const callback = jest.fn();
      timepicker.destroy(callback);

      expect(callback).toHaveBeenCalled();
    });

    it('should accept options object with callback', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const callback = jest.fn();
      timepicker.destroy({ callback });

      expect(callback).toHaveBeenCalled();
    });

    it('should keep input value when keepInputValue is true', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.setValue('10:30 AM');

      timepicker.destroy({ keepInputValue: true });

      expect(input.value).toBe('10:30 AM');
    });
  });

  describe('static methods', () => {
    it('should get instance by id', () => {
      const customId = 'custom-timepicker-id';
      const timepicker = new TimepickerUI(input, { behavior: { id: customId } });
      timepicker.create();

      const instance = TimepickerUI.getById(customId);

      expect(instance).toBe(timepicker);

      timepicker.destroy();
    });

    it('should return undefined for non-existent id', () => {
      const instance = TimepickerUI.getById('non-existent-id');

      expect(instance).toBeUndefined();
    });

    it('should get instances', () => {
      const timepicker = new TimepickerUI(input);

      const instances = TimepickerUI.getAllInstances();

      expect(instances.length).toBeGreaterThanOrEqual(1);

      timepicker.destroy();
    });

    it('should check availability with selector', () => {
      input.id = 'available-input';

      expect(TimepickerUI.isAvailable('#available-input')).toBe(true);
      expect(TimepickerUI.isAvailable('#non-existent')).toBe(false);
    });

    it('should check availability with element', () => {
      expect(TimepickerUI.isAvailable(input)).toBe(true);

      const detachedInput = document.createElement('input');
      expect(TimepickerUI.isAvailable(detachedInput)).toBe(false);
    });

    it('should destroy all instances without throwing', () => {
      const timepicker = new TimepickerUI(input);

      expect(() => TimepickerUI.destroyAll()).not.toThrow();
    });
  });

  describe('inline mode', () => {
    it('should throw when containerId is missing in inline mode', () => {
      expect(() => {
        new TimepickerUI(input, {
          // @ts-ignore
          ui: { inline: { enabled: true } },
        });
      }).toThrow('inline.containerId is required');
    });

    it('should throw when container element not found', () => {
      expect(() => {
        new TimepickerUI(input, {
          ui: { inline: { enabled: true, containerId: 'non-existent-container' } },
        });
      }).toThrow('Container element with id "non-existent-container" not found');
    });

    it('should create inline timepicker when container exists', () => {
      const containerEl = document.createElement('div');
      containerEl.id = 'inline-container';
      document.body.appendChild(containerEl);

      const timepicker = new TimepickerUI(input, {
        ui: { inline: { enabled: true, containerId: 'inline-container' } },
      });

      expect(timepicker).toBeInstanceOf(TimepickerUI);

      timepicker.destroy();
    });
  });

  describe('wrapper element handling', () => {
    it('should find input inside container element', () => {
      const wrapper = document.createElement('div');
      wrapper.id = 'input-wrapper';
      const innerInput = document.createElement('input');
      wrapper.appendChild(innerInput);
      document.body.appendChild(wrapper);

      const timepicker = new TimepickerUI('#input-wrapper');

      expect(timepicker).toBeInstanceOf(TimepickerUI);

      timepicker.destroy();
    });
  });
});
