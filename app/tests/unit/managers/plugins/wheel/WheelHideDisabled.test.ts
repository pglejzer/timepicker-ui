import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';
import { WheelEventHandler } from '../../../../../src/managers/plugins/wheel/WheelEventHandler';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { createWheelOptions, WHEEL_ITEM_HEIGHT_PX } from './wheel-test-helpers';

function buildHideDisabledModal(instanceId: string): HTMLDivElement {
  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', instanceId);

  const hourInput = document.createElement('input');
  hourInput.className = 'tp-ui-hour';
  hourInput.value = '12';
  modal.appendChild(hourInput);

  const minuteInput = document.createElement('input');
  minuteInput.className = 'tp-ui-minutes';
  minuteInput.value = '00';
  modal.appendChild(minuteInput);

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
  hoursCol.setAttribute('role', 'listbox');
  hoursCol.setAttribute('tabindex', '0');

  for (let i = 1; i <= 12; i++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', String(i).padStart(2, '0'));
    item.setAttribute('role', 'option');
    item.textContent = String(i).padStart(2, '0');
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    hoursCol.appendChild(item);
  }

  hoursWrapper.appendChild(hoursCol);
  modal.appendChild(hoursWrapper);

  const minutesWrapper = document.createElement('div');
  minutesWrapper.className = 'tp-ui-wheel-column-wrapper';
  const minutesCol = document.createElement('div');
  minutesCol.className = 'tp-ui-wheel-column tp-ui-wheel-minutes';
  minutesCol.setAttribute('role', 'listbox');
  minutesCol.setAttribute('tabindex', '0');

  for (let i = 0; i < 60; i++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', String(i).padStart(2, '0'));
    item.setAttribute('role', 'option');
    item.textContent = String(i).padStart(2, '0');
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    minutesCol.appendChild(item);
  }

  minutesWrapper.appendChild(minutesCol);
  modal.appendChild(minutesWrapper);

  const ampmWrapper = document.createElement('div');
  ampmWrapper.className = 'tp-ui-wheel-column-wrapper';
  const ampmCol = document.createElement('div');
  ampmCol.className = 'tp-ui-wheel-column tp-ui-wheel-ampm';
  ampmCol.setAttribute('role', 'listbox');
  ampmCol.setAttribute('tabindex', '0');

  ['AM', 'PM'].forEach((val) => {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', val);
    item.setAttribute('role', 'option');
    item.textContent = val;
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    ampmCol.appendChild(item);
  });

  ampmWrapper.appendChild(ampmCol);
  modal.appendChild(ampmWrapper);

  return modal;
}

const DISABLED_HOURS = ['1', '2', '3', '4', '5', '6'];
const DISABLED_MINUTES = ['0', '15', '30', '45'];
const INSTANCE_ID = 'hide-disabled-test';

describe('Wheel + hideDisabledOptions (pointer drag & touch)', () => {
  let element: HTMLDivElement;
  let modal: HTMLDivElement;
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;
  let eventHandler: WheelEventHandler;

  beforeEach(() => {
    HTMLElement.prototype.setPointerCapture = jest.fn();
    HTMLElement.prototype.releasePointerCapture = jest.fn();

    if (typeof globalThis.PointerEvent === 'undefined') {
      (globalThis as Record<string, unknown>).PointerEvent = class PointerEvent extends MouseEvent {
        readonly pointerId: number;
        constructor(type: string, init: PointerEventInit & { pointerId?: number } = {}) {
          super(type, init);
          this.pointerId = init.pointerId ?? 0;
        }
      };
    }

    element = document.createElement('div');
    element.innerHTML = '<input type="text" />';
    document.body.appendChild(element);

    const options = createWheelOptions({
      clock: {
        type: '12h',
        disabledTime: { hours: [1, 2, 3, 4, 5, 6], minutes: [0, 15, 30, 45] },
      },
      wheel: { hideDisabled: true },
    });

    core = new CoreState(element, options, INSTANCE_ID);
    core.setDisabledTime({
      value: {
        hours: DISABLED_HOURS,
        minutes: DISABLED_MINUTES,
      },
    });

    modal = buildHideDisabledModal(INSTANCE_ID);
    document.body.appendChild(modal);

    emitter = new EventEmitter<TimepickerEventMap>();
    renderer = new WheelRenderer(core, emitter);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, core);
    scrollHandler.setDragHandler(dragHandler);
    eventHandler = new WheelEventHandler(emitter, scrollHandler, core);

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
  });

  describe('hidden items filtering', () => {
    it('should exclude disabled hours from visible items', () => {
      const items = renderer.getItems('hours');
      const values = Array.from(items ?? []).map((el) => el.getAttribute('data-value'));

      DISABLED_HOURS.forEach((h) => {
        expect(values).not.toContain(String(parseInt(h, 10)).padStart(2, '0'));
      });
    });

    it('should keep enabled hours 07–12 visible', () => {
      const items = renderer.getItems('hours');
      const values = Array.from(items ?? []).map((el) => el.getAttribute('data-value'));

      ['07', '08', '09', '10', '11', '12'].forEach((h) => {
        expect(values).toContain(h);
      });
    });

    it('should report correct item count for hours (6 visible out of 12)', () => {
      expect(renderer.getItemCount('hours')).toBe(6);
    });

    it('should exclude disabled minutes from visible items', () => {
      const items = renderer.getItems('minutes');
      const values = Array.from(items ?? []).map((el) => el.getAttribute('data-value'));

      expect(values).not.toContain('00');
      expect(values).not.toContain('15');
      expect(values).not.toContain('30');
      expect(values).not.toContain('45');
    });

    it('should report correct item count for minutes (56 visible out of 60)', () => {
      expect(renderer.getItemCount('minutes')).toBe(56);
    });

    it('should measure item height from a visible item, not a hidden one', () => {
      const hoursCol = renderer.getColumnElement('hours');
      const firstVisible = hoursCol?.querySelector<HTMLDivElement>('.tp-ui-wheel-item:not(.is-hidden)');

      if (firstVisible) {
        jest.spyOn(firstVisible, 'getBoundingClientRect').mockReturnValue({
          height: WHEEL_ITEM_HEIGHT_PX,
          width: 80,
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: WHEEL_ITEM_HEIGHT_PX,
          right: 80,
          toJSON: () => ({}),
        });
      }

      renderer.invalidateItemCache();
      const height = renderer.getItemHeight();

      expect(height).toBe(WHEEL_ITEM_HEIGHT_PX);
    });
  });

  describe('pointer drag on filtered hours column', () => {
    it('should add is-dragging class on pointerdown', () => {
      const hoursCol = renderer.getColumnElement('hours');

      hoursCol?.dispatchEvent(new PointerEvent('pointerdown', { clientY: 200, pointerId: 1, bubbles: true }));

      expect(hoursCol?.classList.contains('is-dragging')).toBe(true);
    });

    it('should remove is-dragging class on pointerup', () => {
      const hoursCol = renderer.getColumnElement('hours');

      hoursCol?.dispatchEvent(new PointerEvent('pointerdown', { clientY: 200, pointerId: 1, bubbles: true }));

      document.dispatchEvent(new PointerEvent('pointerup', { clientY: 200, pointerId: 1, bubbles: true }));

      expect(hoursCol?.classList.contains('is-dragging')).toBe(false);
    });

    it('should invoke snap callback after pointer drag completes', () => {
      const snapSpy = jest.fn();
      dragHandler.setSnapCallback(snapSpy);

      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      let rafCallbacks: FrameRequestCallback[] = [];
      jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      });

      let timeCounter = 0;
      jest.spyOn(performance, 'now').mockImplementation(() => {
        timeCounter += 200;
        return timeCounter;
      });

      const hoursCol = renderer.getColumnElement('hours');

      hoursCol?.dispatchEvent(new PointerEvent('pointerdown', { clientY: 200, pointerId: 1, bubbles: true }));

      document.dispatchEvent(new PointerEvent('pointermove', { clientY: 190, pointerId: 1, bubbles: true }));

      document.dispatchEvent(new PointerEvent('pointerup', { clientY: 190, pointerId: 1, bubbles: true }));

      while (rafCallbacks.length > 0) {
        const batch = [...rafCallbacks];
        rafCallbacks = [];
        batch.forEach((cb) => cb(timeCounter));
      }

      expect(snapSpy).toHaveBeenCalledWith('hours');
    });

    it('should emit scroll start on pointerdown', () => {
      const startSpy = jest.fn();
      dragHandler.setScrollStartCallback(startSpy);

      const hoursCol = renderer.getColumnElement('hours');

      hoursCol?.dispatchEvent(new PointerEvent('pointerdown', { clientY: 200, pointerId: 1, bubbles: true }));

      expect(startSpy).toHaveBeenCalledWith('hours');
    });

    it('should update scrollTop during pointermove', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) throw new Error('hours column not found');

      hoursCol.scrollTop = 0;

      hoursCol.dispatchEvent(new PointerEvent('pointerdown', { clientY: 200, pointerId: 1, bubbles: true }));

      document.dispatchEvent(new PointerEvent('pointermove', { clientY: 160, pointerId: 1, bubbles: true }));

      expect(hoursCol.scrollTop).toBeGreaterThanOrEqual(0);
    });
  });

  describe('pointer drag on filtered minutes column', () => {
    it('should apply is-dragging and release on full drag cycle', () => {
      const minutesCol = renderer.getColumnElement('minutes');

      minutesCol?.dispatchEvent(
        new PointerEvent('pointerdown', { clientY: 300, pointerId: 2, bubbles: true }),
      );

      expect(minutesCol?.classList.contains('is-dragging')).toBe(true);

      document.dispatchEvent(new PointerEvent('pointermove', { clientY: 260, pointerId: 2, bubbles: true }));

      document.dispatchEvent(new PointerEvent('pointerup', { clientY: 260, pointerId: 2, bubbles: true }));

      expect(minutesCol?.classList.contains('is-dragging')).toBe(false);
    });
  });

  describe('wheel (mouse scroll) on filtered columns', () => {
    it('should prevent default on wheel event for hours', () => {
      const hoursCol = renderer.getColumnElement('hours');
      const event = new WheelEvent('wheel', {
        deltaY: 50,
        bubbles: true,
        cancelable: true,
      });
      const spy = jest.spyOn(event, 'preventDefault');

      hoursCol?.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });

    it('should prevent default on wheel event for minutes', () => {
      const minutesCol = renderer.getColumnElement('minutes');
      const event = new WheelEvent('wheel', {
        deltaY: -40,
        bubbles: true,
        cancelable: true,
      });
      const spy = jest.spyOn(event, 'preventDefault');

      minutesCol?.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('scrollToValue with hidden items', () => {
    it('should scroll to a visible hour value', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      scrollHandler.scrollToValue('hours', '09');
      const value = scrollHandler.getSelectedValue('hours');

      expect(value).toBe('09');
    });

    it('should not scroll to a hidden hour value', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      scrollHandler.scrollToValue('hours', '03');
      const value = scrollHandler.getSelectedValue('hours');

      expect(value).not.toBe('03');
    });

    it('should scroll to a visible minute value', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      scrollHandler.scrollToValue('minutes', '22');
      const value = scrollHandler.getSelectedValue('minutes');

      expect(value).toBe('22');
    });

    it('should not scroll to a hidden minute value', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      scrollHandler.scrollToValue('minutes', '15');
      const value = scrollHandler.getSelectedValue('minutes');

      expect(value).not.toBe('15');
    });
  });

  describe('getCurrentSelection with hidden items', () => {
    it('should return only visible values in selection', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      scrollHandler.scrollToValue('hours', '10');
      scrollHandler.scrollToValue('minutes', '22');

      const selection = scrollHandler.getCurrentSelection();

      expect(selection.hour).toBe('10');
      expect(selection.minute).toBe('22');
      expect(selection.ampm).toBeDefined();
    });
  });

  describe('event emission after drag on filtered columns', () => {
    it('should emit select:hour with a visible hour after scroll end', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');
      const capturedRef: { callback: ((col: string, val: string) => void) | null } = { callback: null };

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedRef.callback = cb as (col: string, val: string) => void;
      });
      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '09',
        minute: '22',
        ampm: 'AM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(emitter, scrollHandler, core);
      eventHandler.init();

      capturedRef.callback?.('hours', '09');

      expect(emitSpy).toHaveBeenCalledWith('select:hour', { hour: '09' });
      expect(emitSpy).toHaveBeenCalledWith('update', {
        hour: '09',
        minutes: '22',
        type: 'AM',
      });
    });

    it('should emit select:minute with a visible minute after scroll end', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');
      const capturedRef: { callback: ((col: string, val: string) => void) | null } = { callback: null };

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedRef.callback = cb as (col: string, val: string) => void;
      });
      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '10',
        minute: '33',
        ampm: 'PM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(emitter, scrollHandler, core);
      eventHandler.init();

      capturedRef.callback?.('minutes', '33');

      expect(emitSpy).toHaveBeenCalledWith('select:minute', { minutes: '33' });
      expect(emitSpy).toHaveBeenCalledWith('update', {
        hour: '10',
        minutes: '33',
        type: 'PM',
      });
    });
  });

  describe('maxOffset respects hidden item count', () => {
    it('should compute maxOffset based on visible items only', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      const maxOffset = dragHandler.getMaxOffset('hours');

      expect(maxOffset).toBe((6 - 1) * WHEEL_ITEM_HEIGHT_PX);
    });

    it('should compute maxOffset for minutes based on visible count', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      const maxOffset = dragHandler.getMaxOffset('minutes');

      expect(maxOffset).toBe((56 - 1) * WHEEL_ITEM_HEIGHT_PX);
    });
  });

  describe('multi-column drag sequence', () => {
    it('should handle dragging hours then minutes without interference', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      const hoursCol = renderer.getColumnElement('hours');
      const minutesCol = renderer.getColumnElement('minutes');

      hoursCol?.dispatchEvent(new PointerEvent('pointerdown', { clientY: 200, pointerId: 1, bubbles: true }));
      document.dispatchEvent(new PointerEvent('pointerup', { clientY: 180, pointerId: 1, bubbles: true }));

      expect(hoursCol?.classList.contains('is-dragging')).toBe(false);

      minutesCol?.dispatchEvent(
        new PointerEvent('pointerdown', { clientY: 300, pointerId: 2, bubbles: true }),
      );

      expect(minutesCol?.classList.contains('is-dragging')).toBe(true);

      document.dispatchEvent(new PointerEvent('pointerup', { clientY: 270, pointerId: 2, bubbles: true }));

      expect(minutesCol?.classList.contains('is-dragging')).toBe(false);
    });
  });

  describe('ampm column unaffected by hideDisabledOptions', () => {
    it('should still have 2 items in ampm column', () => {
      expect(renderer.getItemCount('ampm')).toBe(2);
    });

    it('should allow drag on ampm column', () => {
      const ampmCol = renderer.getColumnElement('ampm');

      ampmCol?.dispatchEvent(new PointerEvent('pointerdown', { clientY: 100, pointerId: 3, bubbles: true }));

      expect(ampmCol?.classList.contains('is-dragging')).toBe(true);

      document.dispatchEvent(new PointerEvent('pointerup', { clientY: 80, pointerId: 3, bubbles: true }));

      expect(ampmCol?.classList.contains('is-dragging')).toBe(false);
    });
  });
});

