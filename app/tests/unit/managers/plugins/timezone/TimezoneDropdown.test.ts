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
  let combobox: HTMLSpanElement;
  let menu: HTMLDivElement;

  beforeEach(() => {
    mockCore = createMockCoreState();
    emitter = new EventEmitter<TimepickerEventMap>();

    modal = document.createElement('div');
    dropdown = document.createElement('div');
    dropdown.classList.add('tp-ui-timezone-dropdown');

    combobox = document.createElement('span');
    combobox.classList.add('tp-ui-timezone-selected');
    dropdown.appendChild(combobox);

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

  describe('getCombobox', () => {
    it('should return the selected-display element inside the dropdown', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getCombobox()).toBe(combobox);
    });

    it('should return null when modal not found', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getCombobox()).toBeNull();
    });
  });

  describe('getSelectedIndex', () => {
    const addOption = (value: string): HTMLDivElement => {
      const option = document.createElement('div');
      option.classList.add('tp-ui-timezone-option');
      option.setAttribute('data-value', value);
      option.textContent = value;
      menu.appendChild(option);
      return option;
    };

    it('should be -1 before a zone is selected', () => {
      addOption('Europe/London');
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.getSelectedIndex()).toBe(-1);
    });

    it('should follow selectTimezone', () => {
      addOption('Europe/London');
      addOption('Europe/Paris');
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      tz.selectTimezone('Europe/Paris', false);
      expect(tz.getSelectedIndex()).toBe(1);

      tz.selectTimezone('Europe/London', false);
      expect(tz.getSelectedIndex()).toBe(0);
    });

    it('should be -1 again after clearSelection', () => {
      addOption('Europe/London');
      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.selectTimezone('Europe/London', false);

      tz.clearSelection();

      expect(tz.getSelectedIndex()).toBe(-1);
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

    it('should give each option a stable id, option role and aria-selected', () => {
      dropdown.setAttribute('data-tz-id', 'inst');
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      tz.populateOptions();

      const options = menu.querySelectorAll('.tp-ui-timezone-option');
      options.forEach((option, index) => {
        expect(option.getAttribute('role')).toBe('option');
        expect(option.getAttribute('id')).toBe(`tp-tz-opt-inst-${index}`);
        expect(option.getAttribute('aria-selected')).toBe('false');
      });
    });
  });

  describe('setOpen', () => {
    it('should set aria-expanded to true on the combobox and mark the wrapper open', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      tz.setOpen(true);

      expect(combobox.getAttribute('aria-expanded')).toBe('true');
      expect(dropdown.classList.contains('tp-ui-timezone-dropdown--open')).toBe(true);
      expect(dropdown.hasAttribute('aria-expanded')).toBe(false);
    });

    it('should set aria-expanded to false and unmark the wrapper when closed', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.setOpen(true);

      tz.setOpen(false);

      expect(combobox.getAttribute('aria-expanded')).toBe('false');
      expect(dropdown.classList.contains('tp-ui-timezone-dropdown--open')).toBe(false);
    });

    it('should remove aria-activedescendant from the combobox when closing', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.setOpen(true);
      combobox.setAttribute('aria-activedescendant', 'tp-tz-opt-x-1');

      tz.setOpen(false);

      expect(combobox.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('should not throw when the combobox is missing', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(() => tz.setOpen(true)).not.toThrow();
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
    it('should return true when the wrapper carries the open class', () => {
      dropdown.classList.add('tp-ui-timezone-dropdown--open');
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.isOpen()).toBe(true);
    });

    it('should return false when the wrapper does not carry the open class', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      expect(tz.isOpen()).toBe(false);
    });

    it('should follow setOpen', () => {
      const tz = new TimezoneDropdown(mockCore as never, emitter);

      tz.setOpen(true);
      expect(tz.isOpen()).toBe(true);

      tz.setOpen(false);
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
      expect(option.getAttribute('aria-selected')).toBe('true');
      const selectedDisplay = dropdown.querySelector('.tp-ui-timezone-selected');
      expect(selectedDisplay?.textContent).toBe('New York (EST)');
    });

    it('should set aria-selected to false on non-selected options', () => {
      const selected = document.createElement('div');
      selected.classList.add('tp-ui-timezone-option');
      selected.setAttribute('data-value', 'America/New_York');
      selected.textContent = 'New York (EST)';
      menu.appendChild(selected);

      const other = document.createElement('div');
      other.classList.add('tp-ui-timezone-option');
      other.setAttribute('data-value', 'Europe/London');
      other.textContent = 'London (GMT)';
      menu.appendChild(other);

      const tz = new TimezoneDropdown(mockCore as never, emitter);
      tz.selectTimezone('America/New_York');

      expect(selected.getAttribute('aria-selected')).toBe('true');
      expect(other.getAttribute('aria-selected')).toBe('false');
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
