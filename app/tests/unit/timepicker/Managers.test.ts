import { Managers } from '../../../src/timepicker/Managers';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('Managers', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let managers: Managers;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    managers = new Managers(coreState, emitter);
  });

  afterEach(() => {
    managers.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(managers).toBeInstanceOf(Managers);
    });
  });

  describe('manager accessors', () => {
    it('should provide access to modal manager', () => {
      expect(managers.modal).toBeDefined();
    });

    it('should provide access to clock manager', () => {
      expect(managers.clock).toBeDefined();
    });

    it('should provide access to animation manager', () => {
      expect(managers.animation).toBeDefined();
    });

    it('should provide access to config manager', () => {
      expect(managers.config).toBeDefined();
    });

    it('should provide access to theme manager', () => {
      expect(managers.theme).toBeDefined();
    });

    it('should provide access to validation manager', () => {
      expect(managers.validation).toBeDefined();
    });

    it('should provide access to events manager', () => {
      expect(managers.events).toBeDefined();
    });
  });

  describe('destroy', () => {
    it('should not throw on destroy', () => {
      expect(() => managers.destroy()).not.toThrow();
    });
  });
});

