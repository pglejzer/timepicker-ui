import TimezoneManager from '../../../../../src/managers/plugins/timezone/TimezoneManager';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';

const createMockCoreState = (
  enabled = true,
): {
  getModalElement: jest.Mock;
  options: { timezone: { enabled: boolean; whitelist?: string[] } };
} => ({
  getModalElement: jest.fn(),
  options: { timezone: { enabled } },
});

const createTimezoneDOM = (): {
  modal: HTMLDivElement;
  dropdown: HTMLDivElement;
  menu: HTMLDivElement;
} => {
  const modal = document.createElement('div');
  const dropdown = document.createElement('div');
  dropdown.classList.add('tp-ui-timezone-dropdown');
  dropdown.setAttribute('tabindex', '0');

  const selectedDisplay = document.createElement('span');
  selectedDisplay.classList.add('tp-ui-timezone-selected');
  dropdown.appendChild(selectedDisplay);

  const menu = document.createElement('div');
  menu.classList.add('tp-ui-timezone-menu');
  dropdown.appendChild(menu);

  modal.appendChild(dropdown);

  return { modal, dropdown, menu };
};

describe('TimezoneManager', () => {
  let mockCore: ReturnType<typeof createMockCoreState>;
  let emitter: EventEmitter<TimepickerEventMap>;
  let dom: ReturnType<typeof createTimezoneDOM>;

  beforeEach(() => {
    mockCore = createMockCoreState();
    emitter = new EventEmitter<TimepickerEventMap>();
    dom = createTimezoneDOM();
    mockCore.getModalElement.mockReturnValue(dom.modal);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      const manager = new TimezoneManager(mockCore as never, emitter);

      manager.init();

      expect(dom.menu.querySelectorAll('.tp-ui-timezone-option').length).toBeGreaterThan(0);
    });

    it('should not throw when modal is not found', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const manager = new TimezoneManager(mockCore as never, emitter);

      expect(() => manager.init()).not.toThrow();
    });
  });

  describe('getSelectedTimezone', () => {
    it('should return null when no timezone selected', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      const result = manager.getSelectedTimezone();

      expect(result).toBeNull();
    });
  });

  describe('setTimezone', () => {
    it('should not set timezone when disabled', () => {
      mockCore = createMockCoreState(false);
      const manager = new TimezoneManager(mockCore as never, emitter);

      expect(() => manager.setTimezone('America/New_York')).not.toThrow();
    });

    it('should set timezone when enabled', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      manager.setTimezone('UTC');

      const selected = manager.getSelectedTimezone();
      expect(selected).toBe('UTC');
    });
  });

  describe('keyboard navigation', () => {
    it('should handle Enter key to open dropdown', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      dom.dropdown.dispatchEvent(event);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');
    });

    it('should handle Space key to open dropdown', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      dom.dropdown.dispatchEvent(event);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');
    });

    it('should handle Escape key to close dropdown', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      dom.dropdown.dispatchEvent(event);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('false');
    });

    it('should handle ArrowDown key when closed', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      dom.dropdown.dispatchEvent(event);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');
    });

    it('should handle ArrowDown key when open', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      dom.dropdown.dispatchEvent(event);

      const options = dom.menu.querySelectorAll('.tp-ui-timezone-option');
      expect(options.length).toBeGreaterThan(0);
    });

    it('should handle ArrowUp key when open', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      dom.dropdown.dispatchEvent(downEvent);

      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      dom.dropdown.dispatchEvent(upEvent);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');
    });

    it('should handle Home key when open', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      dom.dropdown.dispatchEvent(event);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');
    });

    it('should handle End key when open', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      dom.dropdown.dispatchEvent(event);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('click events', () => {
    it('should toggle dropdown on click', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      const event = new MouseEvent('click', { bubbles: true });
      dom.dropdown.dispatchEvent(event);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');
    });

    it('should close dropdown on second click', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      const event1 = new MouseEvent('click', { bubbles: true });
      dom.dropdown.dispatchEvent(event1);

      const event2 = new MouseEvent('click', { bubbles: true });
      dom.dropdown.dispatchEvent(event2);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('false');
    });

    it('should select option on click', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');
      const options = dom.menu.querySelectorAll('.tp-ui-timezone-option');

      if (options.length > 0) {
        const option = options[0] as HTMLElement;
        const event = new MouseEvent('click', { bubbles: true });
        option.dispatchEvent(event);

        expect(dom.dropdown.getAttribute('aria-expanded')).toBe('false');
      }
    });
  });

  describe('destroy', () => {
    it('should clean up event handlers', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      expect(() => manager.destroy()).not.toThrow();
    });

    it('should clear pending timers', () => {
      jest.useFakeTimers();
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      const event = new MouseEvent('click', { bubbles: true });
      dom.dropdown.dispatchEvent(event);

      manager.destroy();

      jest.runAllTimers();
      jest.useRealTimers();
    });

    it('should be safe to call multiple times', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();
      manager.destroy();

      expect(() => manager.destroy()).not.toThrow();
    });
  });

  describe('keyboard selection', () => {
    it('should select option on Enter when focused', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');

      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      dom.dropdown.dispatchEvent(downEvent);

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      dom.dropdown.dispatchEvent(enterEvent);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('false');
    });

    it('should select option on Space when focused', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');

      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      dom.dropdown.dispatchEvent(downEvent);

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      dom.dropdown.dispatchEvent(spaceEvent);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('click outside', () => {
    it('should close dropdown when clicking outside', () => {
      jest.useFakeTimers();
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      const clickEvent = new MouseEvent('click', { bubbles: true });
      dom.dropdown.dispatchEvent(clickEvent);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');

      jest.advanceTimersByTime(100);

      const outsideClick = new MouseEvent('click', { bubbles: true });
      document.dispatchEvent(outsideClick);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('false');
      jest.useRealTimers();
    });
  });

  describe('option click with target validation', () => {
    it('should not select when target is not HTMLElement', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: null });
      dom.menu.dispatchEvent(event);

      expect(manager.getSelectedTimezone()).toBeNull();
    });

    it('should not select when clicking on non-option element', () => {
      const manager = new TimezoneManager(mockCore as never, emitter);
      manager.init();

      dom.dropdown.setAttribute('aria-expanded', 'true');

      const nonOption = document.createElement('div');
      dom.menu.appendChild(nonOption);

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: nonOption });
      nonOption.dispatchEvent(event);

      expect(dom.dropdown.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
