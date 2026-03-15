import { WheelEventHandler } from '../../../../../src/managers/plugins/wheel/WheelEventHandler';
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

describe('WheelEventHandler edge cases', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;
  let eventHandler: WheelEventHandler;

  beforeEach(() => {
    ctx = setupWheelTestContext('12h');
    renderer = new WheelRenderer(ctx.core, ctx.emitter);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, ctx.core);
    scrollHandler.setDragHandler(dragHandler);
    eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
    eventHandler.init();
  });

  afterEach(() => {
    eventHandler.destroy();
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('commitOnScroll debouncing', () => {
    it('should commit value to input after scroll end when commitOnScroll enabled', () => {
      jest.useFakeTimers();

      eventHandler.destroy();
      scrollHandler.destroy();
      dragHandler.destroy();
      renderer.destroy();
      document.body.innerHTML = '';

      const commitOpts = createWheelOptions({
        clock: { type: '12h' },
        ui: { mode: 'wheel', wheel: { commitOnScroll: true } },
      });
      const element = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'text';
      element.appendChild(input);
      document.body.appendChild(element);

      const core = new CoreState(element, commitOpts, 'commit-test');
      const modal = document.createElement('div');
      modal.setAttribute('data-owner-id', 'commit-test');

      const hourInput = document.createElement('input');
      hourInput.className = 'tp-ui-hour';
      modal.appendChild(hourInput);
      const minuteInput = document.createElement('input');
      minuteInput.className = 'tp-ui-minutes';
      modal.appendChild(minuteInput);

      const am = document.createElement('div');
      am.className = 'tp-ui-type-mode tp-ui-am active';
      modal.appendChild(am);
      const pm = document.createElement('div');
      pm.className = 'tp-ui-type-mode tp-ui-pm';
      modal.appendChild(pm);

      const container = document.createElement('div');
      const hoursWrapper = document.createElement('div');
      hoursWrapper.className = 'tp-ui-wheel-column-wrapper';
      const hoursCol = document.createElement('div');
      hoursCol.className = 'tp-ui-wheel-column tp-ui-wheel-hours';
      for (let i = 1; i <= 12; i++) {
        const item = document.createElement('div');
        item.className = 'tp-ui-wheel-item';
        item.setAttribute('data-value', String(i).padStart(2, '0'));
        item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
        hoursCol.appendChild(item);
      }
      hoursWrapper.appendChild(hoursCol);
      container.appendChild(hoursWrapper);

      const minutesWrapper = document.createElement('div');
      minutesWrapper.className = 'tp-ui-wheel-column-wrapper';
      const minutesCol = document.createElement('div');
      minutesCol.className = 'tp-ui-wheel-column tp-ui-wheel-minutes';
      for (let i = 0; i < 60; i++) {
        const item = document.createElement('div');
        item.className = 'tp-ui-wheel-item';
        item.setAttribute('data-value', String(i).padStart(2, '0'));
        item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
        minutesCol.appendChild(item);
      }
      minutesWrapper.appendChild(minutesCol);
      container.appendChild(minutesWrapper);

      const ampmWrapper = document.createElement('div');
      ampmWrapper.className = 'tp-ui-wheel-column-wrapper';
      const ampmCol = document.createElement('div');
      ampmCol.className = 'tp-ui-wheel-column tp-ui-wheel-ampm';
      ['AM', 'PM'].forEach((val) => {
        const item = document.createElement('div');
        item.className = 'tp-ui-wheel-item';
        item.setAttribute('data-value', val);
        item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
        ampmCol.appendChild(item);
      });
      ampmWrapper.appendChild(ampmCol);
      container.appendChild(ampmWrapper);

      modal.appendChild(container);
      document.body.appendChild(modal);

      const emitter = new EventEmitter<TimepickerEventMap>();
      const r = new WheelRenderer(core, emitter);
      const d = new WheelDragHandler(r);
      const s = new WheelScrollHandler(r, core);
      s.setDragHandler(d);
      const e = new WheelEventHandler(emitter, s, core);

      r.init();
      d.init();
      s.init();
      e.init();

      const emitSpy = jest.spyOn(emitter, 'emit');

      jest.spyOn(r, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);
      s.scrollToValue('hours', '09');

      const capturedRef: { callback: ((col: string, val: string) => void) | null } = { callback: null };
      jest.spyOn(s, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedRef.callback = cb as (col: string, val: string) => void;
      });
      jest.spyOn(s, 'getCurrentSelection').mockReturnValue({
        hour: '09',
        minute: '00',
        ampm: 'AM',
      });

      e.destroy();
      e.init();

      capturedRef.callback?.('hours', '09');

      jest.advanceTimersByTime(500);

      expect(emitSpy).toHaveBeenCalledWith('confirm', expect.objectContaining({ autoCommit: true }));

      e.destroy();
      s.destroy();
      d.destroy();
      r.destroy();
    });
  });

  describe('arrow key at boundaries', () => {
    it('should not scroll beyond first item on ArrowUp', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);
      scrollHandler.scrollToValue('hours', '01');

      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) return;

      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');
      scrollSpy.mockClear();

      hoursCol.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      const callsToHoursScroll = scrollSpy.mock.calls.filter((call) => call[0] === 'hours');
      expect(callsToHoursScroll.length).toBe(0);
    });

    it('should not scroll beyond last item on ArrowDown', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);
      scrollHandler.scrollToValue('hours', '12');

      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) return;

      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');
      scrollSpy.mockClear();

      hoursCol.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      const callsToHoursScroll = scrollSpy.mock.calls.filter((call) => call[0] === 'hours');
      expect(callsToHoursScroll.length).toBe(0);
    });
  });

  describe('ampm column scroll end', () => {
    it('should emit select:am when ampm scrolls to AM', () => {
      const emitSpy = jest.spyOn(ctx.emitter, 'emit');
      const capturedRef: { callback: ((col: string, val: string) => void) | null } = { callback: null };

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedRef.callback = cb as (col: string, val: string) => void;
      });
      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '12',
        minute: '00',
        ampm: 'AM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      eventHandler.init();

      capturedRef.callback?.('ampm', 'AM');

      expect(emitSpy).toHaveBeenCalledWith('select:am', {});
    });

    it('should emit select:pm when ampm scrolls to PM', () => {
      const emitSpy = jest.spyOn(ctx.emitter, 'emit');
      const capturedRef: { callback: ((col: string, val: string) => void) | null } = { callback: null };

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedRef.callback = cb as (col: string, val: string) => void;
      });
      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '12',
        minute: '00',
        ampm: 'PM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      eventHandler.init();

      capturedRef.callback?.('ampm', 'PM');

      expect(emitSpy).toHaveBeenCalledWith('select:pm', {});
    });
  });

  describe('destroy clears commitOnScroll timer', () => {
    it('should not fire confirm event after destroy', () => {
      jest.useFakeTimers();

      const commitOpts = createWheelOptions({
        clock: { type: '12h' },
        ui: { mode: 'wheel', wheel: { commitOnScroll: true } },
      });
      ctx.core.setOptions(commitOpts);

      const emitSpy = jest.spyOn(ctx.emitter, 'emit');
      const capturedRef: { callback: ((col: string, val: string) => void) | null } = { callback: null };

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedRef.callback = cb as (col: string, val: string) => void;
      });
      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '06',
        minute: '15',
        ampm: 'PM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      eventHandler.init();

      capturedRef.callback?.('hours', '06');
      eventHandler.destroy();

      jest.advanceTimersByTime(1000);

      const confirmCalls = emitSpy.mock.calls.filter((call) => call[0] === 'confirm');
      expect(confirmCalls.length).toBe(0);
    });
  });
});

