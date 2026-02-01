import { MobileViewHandler } from '../../../../src/managers/config/MobileViewHandler';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../../src/utils/options/defaults';

describe('MobileViewHandler', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let handler: MobileViewHandler;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    const mockInput = document.createElement('input');
    mockInput.type = 'text';
    mockElement.appendChild(mockInput);
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    handler = new MobileViewHandler(coreState, emitter);
  });

  afterEach(() => {
    handler.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('should create instance', () => {
      expect(handler).toBeInstanceOf(MobileViewHandler);
    });

    it('should setup switch:view event listener', () => {
      const toggleSpy = jest.spyOn(handler, 'toggleMobileClockFace');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      emitter.emit('switch:view', {});

      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('checkMobileOption', () => {
    it('should set mobile view based on options', () => {
      handler.checkMobileOption();
      expect(coreState.isMobileView).toBe(false);
    });
  });

  describe('toggleMobileClockFace', () => {
    it('should not throw when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);
      expect(() => handler.toggleMobileClockFace()).not.toThrow();
    });
  });

  describe('updateClockFaceAccessibility', () => {
    it('should not throw when clockFace is null', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);
      expect(() => handler.updateClockFaceAccessibility(true)).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should not throw on destroy', () => {
      expect(() => handler.destroy()).not.toThrow();
    });
  });
});

