import { DisabledTimeHandler } from '../../../../src/managers/config/DisabledTimeHandler';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { DEFAULT_OPTIONS } from '../../../../src/utils/options/defaults';

describe('DisabledTimeHandler', () => {
  let coreState: CoreState;
  let handler: DisabledTimeHandler;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    const mockInput = document.createElement('input');
    mockInput.type = 'text';
    mockElement.appendChild(mockInput);
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    handler = new DisabledTimeHandler(coreState);
  });

  afterEach(() => {
    handler.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance', () => {
      expect(handler).toBeInstanceOf(DisabledTimeHandler);
    });
  });

  describe('getDisableTime', () => {
    it('should not throw', () => {
      expect(() => handler.getDisableTime()).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should not throw on destroy', () => {
      expect(() => handler.destroy()).not.toThrow();
    });
  });
});

