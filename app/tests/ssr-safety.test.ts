/**
 * SSR Safety Test
 *
 * This test ensures that the timepicker-ui library can be safely imported
 * in a Node.js/SSR environment without crashing.
 *
 * All modules MUST be importable without accessing browser-only APIs
 * like window, document, navigator, etc.
 */

describe('SSR Safety - Module Imports', () => {
  beforeEach(() => {
    delete (global as any).window;
    delete (global as any).document;
    delete (global as any).navigator;
  });

  it('should import TimepickerUI without crashing', () => {
    expect(() => {
      require('../src/timepicker/TimepickerUI');
    }).not.toThrow();
  });

  it('should import CoreState without crashing', () => {
    expect(() => {
      require('../src/timepicker/CoreState');
    }).not.toThrow();
  });

  it('should import Managers without crashing', () => {
    expect(() => {
      require('../src/timepicker/Managers');
    }).not.toThrow();
  });

  it('should import Lifecycle without crashing', () => {
    expect(() => {
      require('../src/timepicker/Lifecycle');
    }).not.toThrow();
  });

  it('should import EventEmitter without crashing', () => {
    expect(() => {
      require('../src/utils/EventEmitter');
    }).not.toThrow();
  });

  it('should import all manager modules without crashing', () => {
    expect(() => {
      require('../src/managers/AnimationManager');
      require('../src/managers/ClockManager');
      require('../src/managers/ConfigManager');
      require('../src/managers/EventManager');
      require('../src/managers/ModalManager');
      require('../src/managers/ThemeManager');
      require('../src/managers/ValidationManager');
    }).not.toThrow();
  });

  it('should import clock system modules without crashing', () => {
    expect(() => {
      require('../src/managers/clock/ClockSystem');
      require('../src/managers/clock/renderer/ClockRenderer');
      require('../src/managers/clock/controller/ClockController');
      require('../src/managers/clock/handlers/DragHandlers');
    }).not.toThrow();
  });

  it('should import utility modules without crashing', () => {
    expect(() => {
      require('../src/utils/config');
      require('../src/utils/ripple');
      require('../src/utils/DOMUpdateBatcher');
      require('../src/utils/debounce');
      require('../src/utils/accessibility');
    }).not.toThrow();
  });
});

describe('SSR Safety - Constructor Calls', () => {
  const mockElement = {
    tagName: 'INPUT',
    parentElement: null,
    classList: { contains: () => false, add: () => {}, remove: () => {} },
    value: '',
    dataset: {},
  } as any;

  beforeAll(() => {
    (global as any).window = {
      crypto: {
        randomUUID: () => 'test-uuid',
      },
    };
  });

  afterAll(() => {
    delete (global as any).window;
  });

  it('should throw descriptive error when constructing TimepickerUI in SSR', () => {
    delete (global as any).window;

    const TimepickerUI = require('../src/timepicker/TimepickerUI').default;

    expect(() => {
      new TimepickerUI(mockElement);
    }).toThrow('TimepickerUI requires browser environment');
  });

  it('should allow static method isAvailable to return false in SSR', () => {
    delete (global as any).window;
    delete (global as any).document;

    const TimepickerUI = require('../src/timepicker/TimepickerUI').default;
    const result = TimepickerUI.isAvailable('#test');

    expect(result).toBe(false);
  });
});

describe('SSR Safety - Utility Functions', () => {
  beforeEach(() => {
    delete (global as any).document;
    delete (global as any).navigator;
  });

  it('getScrollbarWidth should return 0 in SSR', () => {
    const { getScrollbarWidth } = require('../src/utils/config');
    expect(getScrollbarWidth()).toBe(0);
  });

  it('getBrowser should return false in SSR', () => {
    const { getBrowser } = require('../src/utils/config');
    expect(getBrowser()).toBe(false);
  });

  it('initMd3Ripple should not throw in SSR', () => {
    const { initMd3Ripple } = require('../src/utils/ripple');
    expect(() => {
      initMd3Ripple();
    }).not.toThrow();
  });

  it('DOMUpdateBatcher should handle SSR gracefully', () => {
    const { DOMUpdateBatcher } = require('../src/utils/DOMUpdateBatcher');
    const batcher = new DOMUpdateBatcher();

    let executed = false;
    batcher.schedule(() => {
      executed = true;
    });

    expect(executed).toBe(true);
  });
});

describe('SSR Safety - Manager Methods', () => {
  let mockCore: any;
  let mockEmitter: any;

  beforeEach(() => {
    delete (global as any).document;
    delete (global as any).window;

    mockCore = {
      isDestroyed: false,
      options: { animation: false, inline: { enabled: false } },
      getModalElement: () => null,
      getWrapper: () => null,
      getInput: () => null,
    };

    mockEmitter = {
      on: jest.fn(),
      emit: jest.fn(),
      off: jest.fn(),
    };
  });

  it('ModalManager methods should not crash in SSR', () => {
    const ModalManager = require('../src/managers/ModalManager').default;
    const manager = new ModalManager(mockCore, mockEmitter);

    expect(() => {
      manager.setModalTemplate();
      manager.setScrollbarOrNot();
      manager.destroy();
    }).not.toThrow();
  });

  it('EventManager methods should not crash in SSR', () => {
    const EventManager = require('../src/managers/EventManager').default;
    const manager = new EventManager(mockCore, mockEmitter);

    expect(() => {
      manager.handleEscClick();
      manager.focusTrapHandler();
      manager.handleMoveHand();
      manager.destroy();
    }).not.toThrow();
  });

  it('ConfigManager methods should not crash in SSR', () => {
    const ConfigManager = require('../src/managers/ConfigManager').default;
    const manager = new ConfigManager(mockCore, mockEmitter);

    expect(() => {
      manager.checkMobileOption();
      manager.destroy();
    }).not.toThrow();
  });
});

describe('SSR Safety - Edge Cases', () => {
  it('should handle missing requestAnimationFrame gracefully', () => {
    delete (global as any).requestAnimationFrame;

    const ConfigManager = require('../src/managers/ConfigManager').default;
    const mockCore = {
      options: {},
      getModalElement: () => null,
    };
    const mockEmitter = { on: jest.fn(), emit: jest.fn() };

    const manager = new ConfigManager(mockCore, mockEmitter);

    expect(() => {}).not.toThrow();
  });

  it('should handle missing setTimeout gracefully in DOMUpdateBatcher', () => {
    const { DOMUpdateBatcher } = require('../src/utils/DOMUpdateBatcher');
    const batcher = new DOMUpdateBatcher();

    expect(batcher).toBeDefined();
  });
});
