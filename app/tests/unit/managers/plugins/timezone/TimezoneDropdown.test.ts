import { TimezoneDropdown } from '../../../../../src/managers/plugins/timezone/TimezoneDropdown';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';

const createMockCoreState = (): {
  getModalElement: jest.Mock;
  options: { timezone: { whitelist?: string[] } };
} => ({
  getModalElement: jest.fn(),
  options: { timezone: {} },
});

describe('TimezoneDropdown', () => {
  let mockCore: ReturnType<typeof createMockCoreState>;
  let emitter: EventEmitter<TimepickerEventMap>;
  let modal: HTMLDivElement;
  let dropdown: HTMLDivElement;
  let menu: HTMLDivElement;

  beforeEach(() => {
    mockCore = createMockCoreState();
    emitter = new EventEmitter<TimepickerEventMap>();

    modal = document.createElement('div');
    dropdown = document.createElement('div');
    dropdown.classList.add('tp-ui-timezone-dropdown');

    const selectedDisplay = document.createElement('span');
    selectedDisplay.classList.add('tp-ui-timezone-selected');
    dropdown.appendChild(selectedDisplay);

    menu = document.createElement('div');
    menu.classList.add('tp-ui-timezone-menu');
    dropdown.appendChild(menu);

    modal.appendChild(dropdown);
    mockCore.getModalElement.mockReturnValue(modal);
  });

  describe('constructor', () => {
    it('should create TimezoneDropdown instance', () => {
      expect(() => new TimezoneDropdown(mockCore as never, emitter)).not.toThrow();
    });
  });

  describe('getDropdown', () => {
    it('should return dropdown element', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getDropdown()).toBe(dropdown);
    });

    it('should return null when modal not found', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getDropdown()).toBeNull();
    });
  });

  describe('getMenu', () => {
    it('should return menu element', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getMenu()).toBe(menu);
    });

    it('should return null when modal not found', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getMenu()).toBeNull();
    });
  });

  describe('getOptions', () => {
    it('should return empty array when no options', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getOptions()).toEqual([]);
    });

    it('should return option elements', () => {
      const option1 = document.createElement('div');
      option1.classList.add('tp-ui-timezone-option');
      const option2 = document.createElement('div');
      option2.classList.add('tp-ui-timezone-option');
      menu.appendChild(option1);
      menu.appendChild(option2);

      const tz = new TimezoneDropdown(mockCore as never, emitter);

      const options = tz.getOptions();
      expect(options.length).toBe(2);
      expect(options[0]).toBe(option1);
      expect(options[1]).toBe(option2);
    });
  });

  describe('populateOptions', () => {
    it('should populate menu with timezone options', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      tz.populateOptions();

      const options = menu.querySelectorAll('.tp-ui-timezone-option');
      expect(options.length).toBeGreaterThan(0);
    });

    it('should not throw when menu is null', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(() => tz.populateOptions()).not.toThrow();
    });
  });

  describe('setOpen', () => {
    it('should set aria-expanded to true when open', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      tz.setOpen(true);

      expect(dropdown.getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-expanded to false when closed', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      tz.setOpen(false);

      expect(dropdown.getAttribute('aria-expanded')).toBe('false');
    });

    it('should scroll selected option into view when opening', () => {
      const option = document.createElement('div');
      option.classList.add('tp-ui-timezone-option');
      option.setAttribute('data-selected', 'true');
      option.scrollIntoView = jest.fn();
      menu.appendChild(option);

      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.setOpen(true);

      expect(option.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
    });
  });

  describe('isOpen', () => {
    it('should return true when dropdown is expanded', () => {
      dropdown.setAttribute('aria-expanded', 'true');
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.isOpen()).toBe(true);
    });

    it('should return false when dropdown is collapsed', () => {
      dropdown.setAttribute('aria-expanded', 'false');
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.isOpen()).toBe(false);
    });

    it('should return false when dropdown not found', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.isOpen()).toBe(false);
    });
  });

  describe('selectTimezone', () => {
    it('should select timezone and update display', () => {
      const option = document.createElement('div');
      option.classList.add('tp-ui-timezone-option');
      option.setAttribute('data-value', 'America/New_York');
      option.textContent = 'New York (EST)';
      menu.appendChild(option);

      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.selectTimezone('America/New_York');

      expect(option.getAttribute('data-selected')).toBe('true');
      const selectedDisplay = dropdown.querySelector('.tp-ui-timezone-selected');
      expect(selectedDisplay?.textContent).toBe('New York (EST)');
    });

    it('should emit timezone:change event', () => {
      const callback = jest.fn();
      emitter.on('timezone:change', callback);

      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.selectTimezone('America/New_York');

      expect(callback).toHaveBeenCalledWith({ timezone: 'America/New_York' });
    });

    it('should not emit event when emitEvent is false', () => {
      const callback = jest.fn();
      emitter.on('timezone:change', callback);

      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.selectTimezone('America/New_York', false);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('getSelectedTimezone', () => {
    it('should return null initially', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getSelectedTimezone()).toBeNull();
    });

    it('should return selected timezone', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.selectTimezone('Europe/London', false);

      expect(tz.getSelectedTimezone()).toBe('Europe/London');
    });
  });
});

