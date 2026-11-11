import TimezoneManager from '../../../../../src/managers/plugins/timezone/TimezoneManager';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { TIMINGS } from '../../../../../src/constants/timings';

const createMockCoreState = (
  enabled = true,
): {
  getModalElement: jest.Mock;
  isOpen: boolean;
  options: { timezone: { enabled: boolean; whitelist?: string[] } };
} => ({
  getModalElement: jest.fn(),
  isOpen: true,
  options: { timezone: { enabled } },
});

const createTimezoneDOM = (): {
  modal: HTMLDivElement;
  dropdown: HTMLDivElement;
  combobox: HTMLDivElement;
  arrow: SVGElement;
  menu: HTMLDivElement;
} => {
  const modal = document.createElement('div');
  const dropdown = document.createElement('div');
  dropdown.classList.add('tp-ui-timezone-dropdown');
  dropdown.setAttribute('data-tz-id', 'tz');

  const combobox = document.createElement('div');
  combobox.classList.add('tp-ui-timezone-selected');
  combobox.setAttribute('role', 'combobox');
  combobox.setAttribute('tabindex', '0');
  combobox.setAttribute('aria-expanded', 'false');
  dropdown.appendChild(combobox);

  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.classList.add('tp-ui-timezone-arrow');
  dropdown.appendChild(arrow);

  const menu = document.createElement('div');
  menu.classList.add('tp-ui-timezone-menu');
  dropdown.appendChild(menu);

  modal.appendChild(dropdown);
  document.body.appendChild(modal);

  return { modal, dropdown, combobox, arrow, menu };
};

describe('TimezoneManager', () => {
  let mockCore: ReturnType<typeof createMockCoreState>;
  let emitter: EventEmitter<TimepickerEventMap>;
  let dom: ReturnType<typeof createTimezoneDOM>;

  const options = (): HTMLElement[] =>
    Array.from(dom.menu.querySelectorAll<HTMLElement>('.tp-ui-timezone-option'));

  const isOpen = (): boolean => dom.combobox.getAttribute('aria-expanded') === 'true';

  const press = (key: string, init: KeyboardEventInit = {}): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    dom.combobox.dispatchEvent(event);
    return event;
  };

  const activeOption = (): HTMLElement | null => {
    const id = dom.combobox.getAttribute('aria-activedescendant');
    return id ? dom.menu.querySelector<HTMLElement>(`[id="${id}"]`) : null;
  };

  let created: TimezoneManager[] = [];

  const initManager = (): TimezoneManager => {
    const manager = new TimezoneManager(mockCore as never, emitter);
    manager.init();
    created.push(manager);
    return manager;
  };

  beforeEach(() => {
    created = [];
    mockCore = createMockCoreState();
    emitter = new EventEmitter<TimepickerEventMap>();
    dom = createTimezoneDOM();
    mockCore.getModalElement.mockReturnValue(dom.modal);
  });

  afterEach(() => {
    created.forEach((manager) => manager.destroy());
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should create TimezoneManager instance', () => {
      expect(() => new TimezoneManager(mockCore as never, emitter)).not.toThrow();
    });
  });

  describe('init', () => {
    it('should not initialize when timezone is disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new TimezoneManager(mockCore as never, emitter);

      manager.init();

      expect(dom.menu.children.length).toBe(0);
    });

    it('should initialize when timezone is enabled', () => {
      initManager();

      expect(options().length).toBeGreaterThan(0);
    });

    it('should not throw when modal is not found', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const manager = new TimezoneManager(mockCore as never, emitter);

      expect(() => manager.init()).not.toThrow();
    });
  });

  describe('getSelectedTimezone', () => {
    it('should return null when no timezone selected', () => {
      const manager = initManager();

      expect(manager.getSelectedTimezone()).toBeNull();
    });
  });

  describe('setTimezone', () => {
    it('should not set timezone when disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new TimezoneManager(mockCore as never, emitter);

      expect(() => manager.setTimezone('America/New_York')).not.toThrow();
    });

    it('should set timezone when enabled', () => {
      const manager = initManager();

      manager.setTimezone('UTC');

      expect(manager.getSelectedTimezone()).toBe('UTC');
    });
  });

  describe('keyboard navigation on the combobox', () => {
    it.each([
      ['Enter', { key: 'Enter' }],
      ['Space', { key: ' ' }],
      ['ArrowDown', { key: 'ArrowDown' }],
      ['Alt+ArrowDown', { key: 'ArrowDown', altKey: true }],
    ])('%s opens a closed menu on the first zone when none is selected', (_name, { key, ...init }) => {
      initManager();

      press(key, init);

      expect(isOpen()).toBe(true);
      expect(dom.dropdown.classList.contains('tp-ui-timezone-dropdown--open')).toBe(true);
      expect(activeOption()).toBe(options()[0]);
    });

    it.each([
      ['Enter', { key: 'Enter' }],
      ['Space', { key: ' ' }],
      ['ArrowDown', { key: 'ArrowDown' }],
      ['Alt+ArrowDown', { key: 'ArrowDown', altKey: true }],
    ])('%s opens on the selected zone', (_name, { key, ...init }) => {
      const manager = initManager();
      const target = options()[4];
      manager.setTimezone(target.getAttribute('data-value') as string);

      press(key, init);

      expect(isOpen()).toBe(true);
      expect(dom.combobox.getAttribute('aria-activedescendant')).toBe(target.id);
    });

    it('should not react to keydown dispatched on the dropdown wrapper', () => {
      initManager();

      dom.dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(isOpen()).toBe(false);
    });

    it('ArrowDown and ArrowUp move the active descendant while open', () => {
      initManager();
      press('ArrowDown');
      expect(activeOption()).toBe(options()[0]);

      press('ArrowDown');
      expect(activeOption()).toBe(options()[1]);

      press('ArrowUp');
      expect(activeOption()).toBe(options()[0]);
    });

    it('Home and End jump to the first and last zone while open', () => {
      initManager();
      press('ArrowDown');

      press('End');
      expect(activeOption()).toBe(options()[options().length - 1]);

      press('Home');
      expect(activeOption()).toBe(options()[0]);
    });

    it('Home and End do nothing while closed', () => {
      initManager();

      const home = press('Home');
      const end = press('End');

      expect(isOpen()).toBe(false);
      expect(home.defaultPrevented).toBe(false);
      expect(end.defaultPrevented).toBe(false);
    });

    it('Enter on the active zone selects it, closes the menu and emits timezone:change', () => {
      const onChange = jest.fn();
      emitter.on('timezone:change', onChange);
      const manager = initManager();
      press('Enter');
      press('ArrowDown');

      press('Enter');

      const expected = options()[1].getAttribute('data-value');
      expect(isOpen()).toBe(false);
      expect(manager.getSelectedTimezone()).toBe(expected);
      expect(onChange).toHaveBeenCalledWith({ timezone: expected });
      expect(dom.combobox.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('Space on the active zone selects it when not typing', () => {
      const manager = initManager();
      press('ArrowDown');
      press('ArrowDown');

      press(' ');

      expect(isOpen()).toBe(false);
      expect(manager.getSelectedTimezone()).toBe(options()[1].getAttribute('data-value'));
    });

    it('Escape closes an open menu and is consumed', () => {
      initManager();
      press('Enter');

      const event = press('Escape');

      expect(event.defaultPrevented).toBe(true);
      expect(isOpen()).toBe(false);
    });

    it('Escape is left alone while the menu is closed', () => {
      initManager();

      const event = press('Escape');

      expect(event.defaultPrevented).toBe(false);
      expect(isOpen()).toBe(false);
    });

    it('Tab with the menu open selects the active zone, closes and does not preventDefault', () => {
      const manager = initManager();
      press('ArrowDown');
      press('ArrowDown');

      const event = press('Tab');

      expect(event.defaultPrevented).toBe(false);
      expect(isOpen()).toBe(false);
      expect(manager.getSelectedTimezone()).toBe(options()[1].getAttribute('data-value'));
    });

    it('Tab with the menu closed does nothing', () => {
      const manager = initManager();

      const event = press('Tab');

      expect(event.defaultPrevented).toBe(false);
      expect(manager.getSelectedTimezone()).toBeNull();
    });
  });

  describe('type-ahead', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('a printable key opens a closed menu and moves to a matching zone', () => {
      initManager();
      const character = (options()[5].textContent ?? '').charAt(0).toLowerCase();

      const event = press(character);

      expect(event.defaultPrevented).toBe(true);
      expect(isOpen()).toBe(true);
      expect((activeOption()?.textContent ?? '').toLowerCase().startsWith(character)).toBe(true);
    });

    it('a printable key without a match keeps the menu open on the current zone', () => {
      initManager();
      press('ArrowDown');

      press('#');

      expect(isOpen()).toBe(true);
      expect(activeOption()).toBe(options()[0]);
    });

    it('Space is a search character while typing and does not select', () => {
      const manager = initManager();
      press('a');
      expect(isOpen()).toBe(true);

      const event = press(' ');

      expect(event.defaultPrevented).toBe(true);
      expect(isOpen()).toBe(true);
      expect(manager.getSelectedTimezone()).toBeNull();
    });

    it('Space selects again once the type-ahead window has passed', () => {
      const manager = initManager();
      press('a');

      jest.advanceTimersByTime(TIMINGS.TYPEAHEAD_RESET);
      press(' ');

      expect(isOpen()).toBe(false);
      expect(manager.getSelectedTimezone()).not.toBeNull();
    });

    it('modified keys are not type-ahead', () => {
      initManager();

      const event = press('a', { ctrlKey: true });

      expect(event.defaultPrevented).toBe(false);
      expect(isOpen()).toBe(false);
    });
  });

  describe('click events', () => {
    it('should open the menu on click, on the first zone, and focus the combobox', () => {
      initManager();

      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(isOpen()).toBe(true);
      expect(activeOption()).toBe(options()[0]);
      expect(document.activeElement).toBe(dom.combobox);
    });

    it('should open on the selected zone when one is selected', () => {
      const manager = initManager();
      const target = options()[3];
      manager.setTimezone(target.getAttribute('data-value') as string);

      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(activeOption()).toBe(target);
    });

    it('should close the menu on a second click', () => {
      initManager();

      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(isOpen()).toBe(false);
    });

    it('a click on the arrow icon toggles the menu and focuses the combobox', () => {
      initManager();

      dom.arrow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(isOpen()).toBe(true);
      expect(document.activeElement).toBe(dom.combobox);

      dom.arrow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(isOpen()).toBe(false);
    });

    it('should select an option on click, close the menu and focus the combobox', () => {
      const manager = initManager();
      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const option = options()[2];

      option.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(isOpen()).toBe(false);
      expect(manager.getSelectedTimezone()).toBe(option.getAttribute('data-value'));
      expect(document.activeElement).toBe(dom.combobox);
    });
  });

  describe('destroy', () => {
    it('should clean up event handlers', () => {
      const manager = initManager();

      expect(() => manager.destroy()).not.toThrow();
    });

    it('should stop reacting to keys after destroy', () => {
      const manager = initManager();
      manager.destroy();

      press('Enter');

      expect(isOpen()).toBe(false);
    });

    it('should clear pending timers', () => {
      jest.useFakeTimers();
      const manager = initManager();

      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      manager.destroy();

      expect(jest.getTimerCount()).toBe(0);
      jest.useRealTimers();
    });

    it('should be safe to call multiple times', () => {
      const manager = initManager();
      manager.destroy();

      expect(() => manager.destroy()).not.toThrow();
    });
  });

  describe('click outside', () => {
    it('should close the menu when clicking outside', () => {
      jest.useFakeTimers();
      initManager();

      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(isOpen()).toBe(true);

      jest.advanceTimersByTime(TIMINGS.DROPDOWN_CLICK_DELAY);
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(isOpen()).toBe(false);
      jest.useRealTimers();
    });
  });

  describe('option click with target validation', () => {
    it('should not select when target is not HTMLElement', () => {
      const manager = initManager();
      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: null });
      dom.menu.dispatchEvent(event);

      expect(manager.getSelectedTimezone()).toBeNull();
    });

    it('should not select when clicking on a non-option element', () => {
      const manager = initManager();
      dom.dropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const nonOption = document.createElement('div');
      dom.menu.appendChild(nonOption);
      nonOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(isOpen()).toBe(true);
      expect(manager.getSelectedTimezone()).toBeNull();
    });
  });
});
