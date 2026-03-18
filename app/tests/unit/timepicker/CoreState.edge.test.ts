import { CoreState } from '../../../src/timepicker/CoreState';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('CoreState edge cases', () => {
  let element: HTMLDivElement;
  let coreState: CoreState;

  beforeEach(() => {
    element = document.createElement('div');
    element.innerHTML = '<input type="text" />';
    document.body.appendChild(element);
    coreState = new CoreState(element, DEFAULT_OPTIONS, 'edge-test-id');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('updateOptions() partial merging', () => {
    it('should preserve unrelated option groups when updating one group', () => {
      coreState.updateOptions({ clock: { type: '24h' } });

      expect(coreState.options.clock.type).toBe('24h');
      expect(coreState.options.ui.mode).toBe('clock');
      expect(coreState.options.labels.am).toBe('AM');
      expect(coreState.options.behavior.focusTrap).toBe(true);
    });

    it('should handle empty update without corrupting state', () => {
      const before = { ...coreState.options };
      coreState.updateOptions({});

      expect(coreState.options.clock.type).toBe(before.clock.type);
      expect(coreState.options.ui.mode).toBe(before.ui.mode);
    });
  });

  describe('reset() preserves identity', () => {
    it('should preserve element reference after reset', () => {
      coreState.setIsInitialized(true);
      coreState.setDegreesHours(90);
      coreState.reset();

      expect(coreState.element).toBe(element);
      expect(coreState.instanceId).toBe('edge-test-id');
    });

    it('should preserve options after reset', () => {
      coreState.updateOptions({ clock: { type: '24h' } });
      coreState.reset();

      expect(coreState.options.clock.type).toBe('24h');
    });
  });

  describe('state immutability', () => {
    it('should not leak mutable internal state through options getter', () => {
      const optionsRef1 = coreState.options;
      coreState.updateOptions({ clock: { type: '24h' } });
      const optionsRef2 = coreState.options;

      expect(optionsRef1).not.toBe(optionsRef2);
      expect(optionsRef1.clock.type).toBe('12h');
      expect(optionsRef2.clock.type).toBe('24h');
    });
  });

  describe('getInput() with nested elements', () => {
    it('should return first input even when multiple inputs exist', () => {
      element.innerHTML = '<input type="text" value="first"/><input type="text" value="second"/>';

      const input = coreState.getInput();
      expect(input?.value).toBe('first');
    });

    it('should find input inside deeply nested structure', () => {
      element.innerHTML = '<div><div><div><input type="text" value="deep"/></div></div></div>';

      const input = coreState.getInput();
      expect(input?.value).toBe('deep');
    });
  });

  describe('getModalElement() with multiple modals', () => {
    it('should return only the modal matching its own instanceId', () => {
      const modalA = document.createElement('div');
      modalA.setAttribute('data-owner-id', 'other-id');
      document.body.appendChild(modalA);

      const modalB = document.createElement('div');
      modalB.setAttribute('data-owner-id', 'edge-test-id');
      document.body.appendChild(modalB);

      expect(coreState.getModalElement()).toBe(modalB);
    });
  });

  describe('rapid sequential state changes', () => {
    it('should reflect only the latest state after multiple rapid changes', () => {
      coreState.setDegreesHours(10);
      coreState.setDegreesHours(20);
      coreState.setDegreesHours(30);

      expect(coreState.degreesHours).toBe(30);
    });

    it('should handle alternating boolean toggles correctly', () => {
      coreState.setIsMobileView(true);
      coreState.setIsMobileView(false);
      coreState.setIsMobileView(true);
      coreState.setIsMobileView(false);

      expect(coreState.isMobileView).toBe(false);
    });
  });

  describe('setDisabledTime with null', () => {
    it('should accept null to clear disabled time', () => {
      coreState.setDisabledTime({ value: { hours: ['1', '2'] } });
      expect(coreState.disabledTime).not.toBeNull();

      coreState.setDisabledTime(null);
      expect(coreState.disabledTime).toBeNull();
    });
  });

  describe('getClockFace in mobile vs desktop', () => {
    it('should return mobile clock face when isMobileView is true', () => {
      const modal = document.createElement('div');
      modal.setAttribute('data-owner-id', 'edge-test-id');
      const mobileFace = document.createElement('div');
      mobileFace.className = 'tp-ui-clock-face mobile';
      modal.appendChild(mobileFace);
      const desktopFace = document.createElement('div');
      desktopFace.className = 'tp-ui-clock-face';
      modal.appendChild(desktopFace);
      document.body.appendChild(modal);

      coreState.setIsMobileView(true);
      expect(coreState.getClockFace()).toBe(mobileFace);

      coreState.setIsMobileView(false);
      expect(coreState.getClockFace()).toBe(desktopFace);
    });
  });
});

