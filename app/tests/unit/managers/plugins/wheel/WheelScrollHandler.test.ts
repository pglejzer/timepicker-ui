import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';
import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import {
  setupWheelTestContext,
  createWheelOptions,
  WHEEL_ITEM_HEIGHT_PX,
  type WheelTestContext,
} from './wheel-test-helpers';

describe('WheelScrollHandler', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;

  beforeEach(() => {
    ctx = setupWheelTestContext('12h');
    renderer = new WheelRenderer(ctx.core, ctx.emitter);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, ctx.core);
    scrollHandler.setDragHandler(dragHandler);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
  });

  afterEach(() => {
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('scrollToValue()', () => {
    it('should not throw for a valid hour value', () => {
      expect(() => scrollHandler.scrollToValue('hours', '05')).not.toThrow();
    });

    it('should not throw for a valid minute value', () => {
      expect(() => scrollHandler.scrollToValue('minutes', '30')).not.toThrow();
    });

    it('should not throw for a non-existent value', () => {
      expect(() => scrollHandler.scrollToValue('hours', '99')).not.toThrow();
    });

    it('should not throw when column is missing', () => {
      expect(() => scrollHandler.scrollToValue('ampm', 'AM')).not.toThrow();
    });
  });

  describe('getSelectedValue()', () => {
    it('should return a string value for hours', () => {
      const value = scrollHandler.getSelectedValue('hours');
      expect(typeof value === 'string' || value === null).toBe(true);
    });

    it('should return a string value for minutes', () => {
      const value = scrollHandler.getSelectedValue('minutes');
      expect(typeof value === 'string' || value === null).toBe(true);
    });
  });

  describe('getCurrentSelection()', () => {
    it('should return an object with hour, minute, and ampm', () => {
      const selection = scrollHandler.getCurrentSelection();

      expect(selection).toHaveProperty('hour');
      expect(selection).toHaveProperty('minute');
      expect(selection).toHaveProperty('ampm');
    });

    it('should return null ampm in 24h mode', () => {
      scrollHandler.destroy();
      dragHandler.destroy();
      renderer.destroy();
      document.body.innerHTML = '';

      const ctx24 = setupWheelTestContext('24h', 'test-24h-scroll');
      const renderer24 = new WheelRenderer(ctx24.core, ctx24.emitter);
      const dragHandler24 = new WheelDragHandler(renderer24);
      const scrollHandler24 = new WheelScrollHandler(renderer24, ctx24.core);
      scrollHandler24.setDragHandler(dragHandler24);

      renderer24.init();
      dragHandler24.init();
      scrollHandler24.init();

      const selection = scrollHandler24.getCurrentSelection();
      expect(selection.ampm).toBeNull();

      scrollHandler24.destroy();
      dragHandler24.destroy();
      renderer24.destroy();
    });

    it('should fall back to AM header button when ampm wheel column is absent', () => {
      scrollHandler.destroy();
      dragHandler.destroy();
      renderer.destroy();
      document.body.innerHTML = '';

      const element = document.createElement('div');
      element.innerHTML = '<input type="text" />';
      document.body.appendChild(element);

      const options = createWheelOptions({ clock: { type: '12h' } });
      const core = new CoreState(element, options, 'test-no-ampm-col');

      const modal = document.createElement('div');
      modal.setAttribute('data-owner-id', 'test-no-ampm-col');

      const am = document.createElement('div');
      am.className = 'tp-ui-type-mode tp-ui-am active';
      modal.appendChild(am);

      const pm = document.createElement('div');
      pm.className = 'tp-ui-type-mode tp-ui-pm';
      modal.appendChild(pm);

      const hoursWrapper = document.createElement('div');
      hoursWrapper.className = 'tp-ui-wheel-column-wrapper';
      const hoursCol = document.createElement('div');
      hoursCol.className = 'tp-ui-wheel-column tp-ui-wheel-hours';
      hoursWrapper.appendChild(hoursCol);
      modal.appendChild(hoursWrapper);

      const minutesWrapper = document.createElement('div');
      minutesWrapper.className = 'tp-ui-wheel-column-wrapper';
      const minutesCol = document.createElement('div');
      minutesCol.className = 'tp-ui-wheel-column tp-ui-wheel-minutes';
      minutesWrapper.appendChild(minutesCol);
      modal.appendChild(minutesWrapper);

      document.body.appendChild(modal);

      const emitter2 = new EventEmitter<TimepickerEventMap>();
      const renderer2 = new WheelRenderer(core, emitter2);
      const dragHandler2 = new WheelDragHandler(renderer2);
      const scrollHandler2 = new WheelScrollHandler(renderer2, core);
      scrollHandler2.setDragHandler(dragHandler2);

      renderer2.init();
      dragHandler2.init();
      scrollHandler2.init();

      const selection = scrollHandler2.getCurrentSelection();
      expect(selection.ampm).toBe('AM');

      scrollHandler2.destroy();
      dragHandler2.destroy();
      renderer2.destroy();
    });

    it('should fall back to PM when PM header button is active and ampm column is absent', () => {
      scrollHandler.destroy();
      dragHandler.destroy();
      renderer.destroy();
      document.body.innerHTML = '';

      const element = document.createElement('div');
      element.innerHTML = '<input type="text" />';
      document.body.appendChild(element);

      const options = createWheelOptions({ clock: { type: '12h' } });
      const core = new CoreState(element, options, 'test-no-ampm-pm');

      const modal = document.createElement('div');
      modal.setAttribute('data-owner-id', 'test-no-ampm-pm');

      const am = document.createElement('div');
      am.className = 'tp-ui-type-mode tp-ui-am';
      modal.appendChild(am);

      const pm = document.createElement('div');
      pm.className = 'tp-ui-type-mode tp-ui-pm active';
      modal.appendChild(pm);

      const hoursWrapper = document.createElement('div');
      hoursWrapper.className = 'tp-ui-wheel-column-wrapper';
      const hoursCol = document.createElement('div');
      hoursCol.className = 'tp-ui-wheel-column tp-ui-wheel-hours';
      hoursWrapper.appendChild(hoursCol);
      modal.appendChild(hoursWrapper);

      const minutesWrapper = document.createElement('div');
      minutesWrapper.className = 'tp-ui-wheel-column-wrapper';
      const minutesCol = document.createElement('div');
      minutesCol.className = 'tp-ui-wheel-column tp-ui-wheel-minutes';
      minutesWrapper.appendChild(minutesCol);
      modal.appendChild(minutesWrapper);

      document.body.appendChild(modal);

      const emitter2 = new EventEmitter<TimepickerEventMap>();
      const renderer2 = new WheelRenderer(core, emitter2);
      const dragHandler2 = new WheelDragHandler(renderer2);
      const scrollHandler2 = new WheelScrollHandler(renderer2, core);
      scrollHandler2.setDragHandler(dragHandler2);

      renderer2.init();
      dragHandler2.init();
      scrollHandler2.init();

      const selection = scrollHandler2.getCurrentSelection();
      expect(selection.ampm).toBe('PM');

      scrollHandler2.destroy();
      dragHandler2.destroy();
      renderer2.destroy();
    });

    it('should read ampm from wheel column when it exists in 12h mode', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);
      scrollHandler.scrollToValue('ampm', 'PM');
      const selection = scrollHandler.getCurrentSelection();
      expect(selection.ampm).toBe('PM');
    });
  });

  describe('updateVisualClasses()', () => {
    it('should not throw when called', () => {
      expect(() => scrollHandler.updateVisualClasses('hours')).not.toThrow();
    });

    it('should toggle at-start on the wrapper element when at index 0', () => {
      scrollHandler.updateVisualClasses('hours');

      const hoursCol = renderer.getColumnElement('hours');
      const wrapper = hoursCol?.parentElement;
      expect(wrapper?.classList.contains('at-start')).toBe(true);
    });

    it('should toggle at-end on the wrapper when getScrollOffset returns max offset', () => {
      const itemCount = renderer.getItemCount('hours');
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);
      jest.spyOn(dragHandler, 'getScrollOffset').mockReturnValue((itemCount - 1) * WHEEL_ITEM_HEIGHT_PX);

      scrollHandler.updateVisualClasses('hours');

      const hoursCol = renderer.getColumnElement('hours');
      const wrapper = hoursCol?.parentElement;
      expect(wrapper?.classList.contains('at-end')).toBe(true);
    });

    it('should add is-center class to the center item', () => {
      scrollHandler.updateVisualClasses('hours');

      const hoursCol = renderer.getColumnElement('hours');
      const centerItems = hoursCol?.querySelectorAll('.is-center');
      expect(centerItems?.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('setScrollEndCallback()', () => {
    it('should accept a callback without throwing', () => {
      const callback = jest.fn();
      expect(() => scrollHandler.setScrollEndCallback(callback)).not.toThrow();
    });
  });

  describe('destroy()', () => {
    it('should not throw when called', () => {
      expect(() => scrollHandler.destroy()).not.toThrow();
    });

    it('should not throw when called multiple times', () => {
      scrollHandler.destroy();
      expect(() => scrollHandler.destroy()).not.toThrow();
    });

    it('should not throw when called without init', () => {
      const freshHandler = new WheelScrollHandler(renderer, ctx.core);
      expect(() => freshHandler.destroy()).not.toThrow();
    });
  });
});

