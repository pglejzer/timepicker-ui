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
      const onError = jest.fn();
      timepicker.on('error', onError);

      expect(() => timepicker.setValue('invalid')).not.toThrow();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith({ error: 'Invalid 12h format. Expected HH:MM AM/PM' });

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
      const onError = jest.fn();
      timepicker.on('error', onError);

      expect(() => timepicker.setValue('25:00')).not.toThrow();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith({ error: 'Invalid 24h format. Expected HH:MM' });

      timepicker.destroy();
    });

    it('should handle invalid 12h format gracefully', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      const onError = jest.fn();
      timepicker.on('error', onError);

      expect(() => timepicker.setValue('13:00 AM')).not.toThrow();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith({ error: 'Invalid 12h format. Expected HH:MM AM/PM' });

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
      expect(() => TimepickerUI.destroyAll()).not.toThrow();
    });
  });

  describe('inline mode', () => {
    const addInlineHost = (): HTMLElement => {
      const host = document.createElement('div');
      host.id = 'inline-container';
      document.body.appendChild(host);
      return host;
    };

    const inlineModalIn = (host: HTMLElement): Element | null =>
      host.querySelector('.tp-ui-modal.tp-ui--inline');

    it('should throw when inline mode has neither container nor containerId', () => {
      expect(() => {
        new TimepickerUI(input, {
          ui: { inline: { enabled: true } },
        });
      }).toThrow('inline.container is required');
    });

    it('should throw when container element not found', () => {
      expect(() => {
        new TimepickerUI(input, {
          ui: { inline: { enabled: true, containerId: 'non-existent-container' } },
        });
      }).toThrow('Inline container not found');
    });

    it('should throw when inline.container matches no element', () => {
      expect(() => {
        new TimepickerUI(input, {
          ui: { inline: { enabled: true, container: '#non-existent-container' } },
        });
      }).toThrow('Inline container not found');
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

    it.each<{ name: string; container: (host: HTMLElement) => string | HTMLElement }>([
      { name: 'a selector', container: () => '#inline-container' },
      { name: 'an element', container: (host) => host },
    ])('renders inline into a container given as $name', ({ container: containerFor }) => {
      const host = addInlineHost();
      const timepicker = new TimepickerUI(input, {
        ui: { animation: false, inline: { enabled: true, container: containerFor(host) } },
      });

      timepicker.create();

      expect(inlineModalIn(host)).not.toBeNull();
    });

    it('still accepts inline.containerId', () => {
      const host = addInlineHost();
      const timepicker = new TimepickerUI(input, {
        ui: { animation: false, inline: { enabled: true, containerId: 'inline-container' } },
      });

      timepicker.create();

      expect(inlineModalIn(host)).not.toBeNull();
    });
  });

  describe('modal placement', () => {
    const addModalHost = (): HTMLElement => {
      const host = document.createElement('section');
      host.id = 'modal-host';
      document.body.appendChild(host);
      return host;
    };

    it('appends the modal to an element passed as ui.appendTo', () => {
      const host = addModalHost();
      const timepicker = new TimepickerUI(input, { ui: { animation: false, appendTo: host } });
      timepicker.create();

      timepicker.open();

      expect(document.querySelectorAll('.tp-ui-modal')).toHaveLength(1);
      expect(document.querySelector('.tp-ui-modal')?.parentElement).toBe(host);
    });

    it('still appends the modal to the element matched by ui.appendModalSelector', () => {
      const host = addModalHost();
      const timepicker = new TimepickerUI(input, {
        ui: { animation: false, appendModalSelector: '#modal-host' },
      });
      timepicker.create();

      timepicker.open();

      expect(document.querySelector('.tp-ui-modal')?.parentElement).toBe(host);
    });
  });

  describe('setOptions', () => {
    it('applies options like update', () => {
      const otherInput = document.createElement('input');
      document.body.appendChild(otherInput);
      const viaSetOptions = new TimepickerUI(input);
      const viaUpdate = new TimepickerUI(otherInput);
      viaSetOptions.create();
      viaUpdate.create();

      viaSetOptions.setOptions({ ui: { viewSwitch: true }, labels: { hour: 'Godzina' } });
      viaUpdate.update({ options: { ui: { viewSwitch: true }, labels: { hour: 'Godzina' } } });

      expect(viaSetOptions.options.ui.enableSwitchIcon).toBe(true);
      expect(viaSetOptions.options.labels.hourLabel).toBe('Godzina');
      expect(viaSetOptions.options).toEqual(viaUpdate.options);
    });

    it('a new name passed to setOptions overrides an old name from the constructor', () => {
      const timepicker = new TimepickerUI(input, { ui: { enableSwitchIcon: true } });
      timepicker.create();

      timepicker.setOptions({ ui: { viewSwitch: false } });

      expect(timepicker.options.ui.enableSwitchIcon).toBe(false);

      timepicker.setOptions({ ui: { enableSwitchIcon: true } });

      expect(timepicker.options.ui.enableSwitchIcon).toBe(true);
    });

    it('turns options off with a new name over old values from the constructor', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', currentTime: true, smoothHourSnap: false },
        ui: { mobile: true },
      });
      timepicker.create();

      timepicker.setOptions({
        clock: { defaultTime: undefined, discreteHourJump: false },
        ui: { initialView: 'clock' },
      });

      expect(timepicker.options.clock.currentTime).toBeUndefined();
      expect(timepicker.options.clock.smoothHourSnap).toBe(true);
      expect(timepicker.options.ui.mobile).toBe(false);
    });

    it('re-renders an open picker with the new options', () => {
      const timepicker = new TimepickerUI(input, { ui: { animation: false } });
      timepicker.create();
      timepicker.open();

      timepicker.setOptions({ labels: { ok: 'Zapisz' } });

      expect(document.querySelectorAll('.tp-ui-modal')).toHaveLength(1);
      expect(document.querySelector('.tp-ui-modal .tp-ui-ok-btn')?.textContent).toBe('Zapisz');
    });
  });

  describe('clock.type auto', () => {
    const mockLocaleHour12 = (hour12: boolean): void => {
      const format = { resolvedOptions: () => ({ hour12 }) } as unknown as Intl.DateTimeFormat;
      jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => format);
    };

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each([
      { hour12: true, type: '12h', other: '24h' as const },
      { hour12: false, type: '24h', other: '12h' as const },
    ])(
      'follows a $type locale when the picker is created and when its options are set',
      ({ hour12, type, other }) => {
        mockLocaleHour12(hour12);
        const timepicker = new TimepickerUI(input, { clock: { type: 'auto' } });
        timepicker.create();

        expect(timepicker.options.clock.type).toBe(type);

        timepicker.setOptions({ clock: { type: other } });
        timepicker.setOptions({ clock: { type: 'auto' } });

        expect(timepicker.options.clock.type).toBe(type);
      },
    );
  });

  describe('select:period', () => {
    it('emits select:period with the selected period next to select:am and select:pm', () => {
      const onSelectPeriod = jest.fn();
      const timepicker = new TimepickerUI(input, { ui: { animation: false }, callbacks: { onSelectPeriod } });
      timepicker.create();
      timepicker.open();
      const period = jest.fn();
      const pm = jest.fn();
      const am = jest.fn();
      timepicker.on('select:period', period);
      timepicker.on('select:pm', pm);
      timepicker.on('select:am', am);

      (document.querySelector('.tp-ui-modal .tp-ui-pm') as HTMLElement).click();

      expect(pm).toHaveBeenCalledTimes(1);
      expect(period).toHaveBeenCalledTimes(1);
      expect(period).toHaveBeenCalledWith({ type: 'PM' });
      expect(onSelectPeriod).toHaveBeenCalledWith({ type: 'PM' });

      (document.querySelector('.tp-ui-modal .tp-ui-am') as HTMLElement).click();

      expect(am).toHaveBeenCalledTimes(1);
      expect(period).toHaveBeenCalledTimes(2);
      expect(period).toHaveBeenLastCalledWith({ type: 'AM' });
      expect(onSelectPeriod).toHaveBeenLastCalledWith({ type: 'AM' });
    });
  });

  describe('switch:face', () => {
    it('emits switch:face when a field click changes the face, and not for the face already shown', () => {
      input.value = '10:30:15';
      const onSwitchFace = jest.fn();
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', showSeconds: true },
        ui: { animation: false },
        callbacks: { onSwitchFace },
      });
      timepicker.create();
      timepicker.open();
      const switchFace = jest.fn();
      timepicker.on('switch:face', switchFace);
      const click = (selector: string): void =>
        (document.querySelector(`.tp-ui-modal ${selector}`) as HTMLElement).click();

      click('.tp-ui-hour');

      expect(switchFace).not.toHaveBeenCalled();

      click('.tp-ui-minutes');
      click('.tp-ui-minutes');
      click('.tp-ui-seconds');
      click('.tp-ui-hour');

      expect(switchFace.mock.calls).toEqual([
        [{ face: 'minutes' }],
        [{ face: 'seconds' }],
        [{ face: 'hours' }],
      ]);
      expect(onSwitchFace.mock.calls).toEqual(switchFace.mock.calls);
    });
  });

  describe('labels.second', () => {
    it('names the seconds field', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { showSeconds: true },
        ui: { animation: false },
        labels: { second: 'Sekunda' },
      });
      timepicker.create();

      timepicker.open();
      const seconds = document.querySelector('.tp-ui-modal .tp-ui-seconds');

      expect(seconds?.getAttribute('aria-label')).toBe('Sekunda');
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

    it('should create wrapper element if input has no tp-ui parent', () => {
      const standaloneInput = document.createElement('input');
      document.body.appendChild(standaloneInput);

      const timepicker = new TimepickerUI(standaloneInput);

      const wrapperElement = timepicker.getElement();
      expect(wrapperElement.classList.contains('tp-ui')).toBe(true);

      timepicker.destroy();
    });
  });

  describe('setValue with modal elements', () => {
    it('should update clock hand transform when modal is open', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      timepicker.setValue('10:30 AM');

      timepicker.destroy();
    });

    it('should set AM active and PM inactive for AM time', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      timepicker.setValue('10:30 AM');

      timepicker.destroy();
    });

    it('should set PM active and AM inactive for PM time', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();

      timepicker.setValue('10:30 PM');

      timepicker.destroy();
    });
  });

  describe('getValue with modal elements', () => {
    it('should get time string in 24h format', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '24h' } });
      timepicker.create();
      timepicker.open();
      timepicker.setValue('14:30');

      const value = timepicker.getValue();

      expect(value.type).toBeUndefined();

      timepicker.destroy();
    });

    it('should get time string in 12h format', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.open();
      timepicker.setValue('10:30 AM');

      const value = timepicker.getValue();

      expect(value.type).toBeDefined();

      timepicker.destroy();
    });
  });

  describe('confirm event without type', () => {
    it('should handle confirm event without type field', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '24h' } });
      timepicker.create();
      timepicker.open();

      (timepicker as unknown as { emitter: { emit: (event: string, data: unknown) => void } }).emitter.emit(
        'confirm',
        {
          hour: '14',
          minutes: '30',
        },
      );

      expect(input.value).toBe('14:30');

      timepicker.destroy();
    });
  });

  describe('internal event handling edge cases', () => {
    it('should not mount on open:request when destroyed', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      expect(() => {
        (timepicker as unknown as { emitter: { emit: (event: string, data: unknown) => void } }).emitter.emit(
          'open:request',
          undefined,
        );
      }).not.toThrow();
      expect(document.querySelector('.tp-ui-modal')).toBeNull();
    });

    it('should not unmount on cancel event when destroyed', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      expect(() => {
        (timepicker as unknown as { emitter: { emit: (event: string, data: unknown) => void } }).emitter.emit(
          'cancel',
          undefined,
        );
      }).not.toThrow();
    });

    it('should not update input on confirm event when destroyed', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      expect(() => {
        (timepicker as unknown as { emitter: { emit: (event: string, data: unknown) => void } }).emitter.emit(
          'confirm',
          { hour: '10', minutes: '30', type: 'AM' },
        );
      }).not.toThrow();
    });

    it('should not update input on range:confirm event when destroyed', () => {
      const timepicker = new TimepickerUI(input, { range: { enabled: true } });
      timepicker.create();
      timepicker.destroy();

      expect(() => {
        (timepicker as unknown as { emitter: { emit: (event: string, data: unknown) => void } }).emitter.emit(
          'range:confirm',
          { from: '10:00 AM', to: '12:00 PM', duration: 120 },
        );
      }).not.toThrow();
    });
  });

  describe('isAvailable edge cases', () => {
    it('should return false for invalid input', () => {
      expect(TimepickerUI.isAvailable(null as unknown as HTMLElement)).toBe(false);
    });
  });

  describe('setValue with null/undefined', () => {
    it('should handle null value gracefully', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.setValue(null as unknown as string)).not.toThrow();

      timepicker.destroy();
    });

    it('should handle non-string value gracefully', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.setValue(123 as unknown as string)).not.toThrow();

      timepicker.destroy();
    });
  });
});
