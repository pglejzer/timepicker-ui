import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import type {
  ConfirmEventData,
  OpenEventData,
  UpdateEventData,
  ClearEventData,
  SelectHourEventData,
  SelectMinuteEventData,
  TimezoneChangeEventData,
  RangeConfirmEventData,
  WheelScrollStartEventData,
  WheelScrollEndEventData,
  ErrorEventData,
} from '../../../src/types/types';

/**
 * Helper: extract the private emitter from a TimepickerUI instance
 * so we can emit events in tests without going through the full DOM flow.
 */
function getEmitter(instance: TimepickerUI): EventEmitter<TimepickerEventMap> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (instance as Record<string, any>)['emitter'] as EventEmitter<TimepickerEventMap>;
}

describe('TimepickerUI EventEmitter public API (v4.1.7 compat)', () => {
  let container: HTMLElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    container.appendChild(input);
    document.body.appendChild(container);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  // ── .on() typed data for every event type ────────────────────

  describe('.on() receives typed event data', () => {
    it('should pass ConfirmEventData to confirm handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ConfirmEventData]>();
      timepicker.on('confirm', handler);

      const emitter = getEmitter(timepicker);
      const payload: ConfirmEventData = { hour: '10', minutes: '30', type: 'AM' };
      emitter.emit('confirm', payload);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(payload);

      const received = handler.mock.calls[0][0];
      expect(received.hour).toBe('10');
      expect(received.minutes).toBe('30');
      expect(received.type).toBe('AM');

      timepicker.destroy();
    });

    it('should pass OpenEventData to open handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [OpenEventData]>();
      timepicker.on('open', handler);

      const emitter = getEmitter(timepicker);
      const payload: OpenEventData = {
        hour: '12',
        minutes: '00',
        type: 'PM',
        degreesHours: 360,
        degreesMinutes: 0,
      };
      emitter.emit('open', payload);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(payload);

      const received = handler.mock.calls[0][0];
      expect(received.hour).toBe('12');
      expect(received.degreesHours).toBe(360);

      timepicker.destroy();
    });

    it('should pass UpdateEventData to update handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [UpdateEventData]>();
      timepicker.on('update', handler);

      const emitter = getEmitter(timepicker);
      const payload: UpdateEventData = { hour: '08', minutes: '15', type: 'AM' };
      emitter.emit('update', payload);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(payload);
      expect(handler.mock.calls[0][0].hour).toBe('08');

      timepicker.destroy();
    });

    it('should pass ClearEventData to clear handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ClearEventData]>();
      timepicker.on('clear', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('clear', { previousValue: '10:30 AM' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].previousValue).toBe('10:30 AM');

      timepicker.destroy();
    });

    it('should pass SelectHourEventData to select:hour handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [SelectHourEventData]>();
      timepicker.on('select:hour', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('select:hour', { hour: '03' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].hour).toBe('03');

      timepicker.destroy();
    });

    it('should pass SelectMinuteEventData to select:minute handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [SelectMinuteEventData]>();
      timepicker.on('select:minute', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('select:minute', { minutes: '45' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].minutes).toBe('45');

      timepicker.destroy();
    });

    it('should pass TimezoneChangeEventData to timezone:change handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [TimezoneChangeEventData]>();
      timepicker.on('timezone:change', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('timezone:change', { timezone: 'America/New_York' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].timezone).toBe('America/New_York');

      timepicker.destroy();
    });

    it('should pass RangeConfirmEventData to range:confirm handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [RangeConfirmEventData]>();
      timepicker.on('range:confirm', handler);

      const emitter = getEmitter(timepicker);
      const payload: RangeConfirmEventData = { from: '09:00', to: '17:00', duration: 480 };
      emitter.emit('range:confirm', payload);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].from).toBe('09:00');
      expect(handler.mock.calls[0][0].to).toBe('17:00');
      expect(handler.mock.calls[0][0].duration).toBe(480);

      timepicker.destroy();
    });

    it('should pass WheelScrollStartEventData to wheel:scroll:start handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [WheelScrollStartEventData]>();
      timepicker.on('wheel:scroll:start', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('wheel:scroll:start', { column: 'hours' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].column).toBe('hours');

      timepicker.destroy();
    });

    it('should pass WheelScrollEndEventData to wheel:scroll:end handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [WheelScrollEndEventData]>();
      timepicker.on('wheel:scroll:end', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('wheel:scroll:end', { column: 'minutes', value: '30', previousValue: '15' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].column).toBe('minutes');
      expect(handler.mock.calls[0][0].value).toBe('30');
      expect(handler.mock.calls[0][0].previousValue).toBe('15');

      timepicker.destroy();
    });

    it('should pass ErrorEventData to error handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ErrorEventData]>();
      timepicker.on('error', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('error', { error: 'E_INVALID_TIME', rejectedHour: '25' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].error).toBe('E_INVALID_TIME');
      expect(handler.mock.calls[0][0].rejectedHour).toBe('25');

      timepicker.destroy();
    });

    it('should work with events that have empty payloads (cancel, show, hide, select:am, select:pm)', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const cancelHandler = jest.fn();
      const showHandler = jest.fn();
      const hideHandler = jest.fn();
      const amHandler = jest.fn();
      const pmHandler = jest.fn();
      const switchViewHandler = jest.fn();

      timepicker.on('cancel', cancelHandler);
      timepicker.on('show', showHandler);
      timepicker.on('hide', hideHandler);
      timepicker.on('select:am', amHandler);
      timepicker.on('select:pm', pmHandler);
      timepicker.on('switch:view', switchViewHandler);

      const emitter = getEmitter(timepicker);
      emitter.emit('cancel');
      emitter.emit('show');
      emitter.emit('hide');
      emitter.emit('select:am');
      emitter.emit('select:pm');
      emitter.emit('switch:view');

      expect(cancelHandler).toHaveBeenCalledTimes(1);
      expect(showHandler).toHaveBeenCalledTimes(1);
      expect(hideHandler).toHaveBeenCalledTimes(1);
      expect(amHandler).toHaveBeenCalledTimes(1);
      expect(pmHandler).toHaveBeenCalledTimes(1);
      expect(switchViewHandler).toHaveBeenCalledTimes(1);

      timepicker.destroy();
    });
  });

  // ── .once() with typed data ──────────────────────────────────

  describe('.once() fires exactly once with typed data', () => {
    it('should receive ConfirmEventData and auto-unsubscribe', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ConfirmEventData]>();
      timepicker.once('confirm', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '01', minutes: '00', type: 'PM' });
      emitter.emit('confirm', { hour: '02', minutes: '00', type: 'PM' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].hour).toBe('01');

      timepicker.destroy();
    });

    it('should receive OpenEventData once and auto-unsubscribe', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [OpenEventData]>();
      timepicker.once('open', handler);

      const emitter = getEmitter(timepicker);
      const payload: OpenEventData = {
        hour: '06',
        minutes: '30',
        degreesHours: 180,
        degreesMinutes: 180,
      };
      emitter.emit('open', payload);
      emitter.emit('open', payload);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].hour).toBe('06');

      timepicker.destroy();
    });

    it('should receive ErrorEventData once and auto-unsubscribe', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ErrorEventData]>();
      timepicker.once('error', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('error', { error: 'E_FIRST' });
      emitter.emit('error', { error: 'E_SECOND' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].error).toBe('E_FIRST');

      timepicker.destroy();
    });
  });

  // ── .off() ───────────────────────────────────────────────────

  describe('.off() correctly removes handlers', () => {
    it('should stop receiving events after off()', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ConfirmEventData]>();
      timepicker.on('confirm', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '10', minutes: '00' });
      expect(handler).toHaveBeenCalledTimes(1);

      timepicker.off('confirm', handler);
      emitter.emit('confirm', { hour: '11', minutes: '00' });
      expect(handler).toHaveBeenCalledTimes(1);

      timepicker.destroy();
    });

    it('should remove all handlers for event when no handler specified', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler1 = jest.fn();
      const handler2 = jest.fn();

      timepicker.on('confirm', handler1);
      timepicker.on('confirm', handler2);

      timepicker.off('confirm');

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '10', minutes: '00' });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();

      timepicker.destroy();
    });

    it('should be a no-op when removing a handler that was never registered', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const neverRegistered = jest.fn();
      expect(() => timepicker.off('confirm', neverRegistered)).not.toThrow();

      timepicker.destroy();
    });

    it('should be a no-op when removing all handlers for an event with no listeners', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      expect(() => timepicker.off('confirm')).not.toThrow();

      timepicker.destroy();
    });
  });

  // ── multiple handlers ───────────────────────────────────────

  describe('multiple handlers for the same event', () => {
    it('should call all registered confirm handlers with same data', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler1 = jest.fn<void, [ConfirmEventData]>();
      const handler2 = jest.fn<void, [ConfirmEventData]>();

      timepicker.on('confirm', handler1);
      timepicker.on('confirm', handler2);

      const emitter = getEmitter(timepicker);
      const payload: ConfirmEventData = { hour: '05', minutes: '45', type: 'PM' };
      emitter.emit('confirm', payload);

      expect(handler1).toHaveBeenCalledWith(payload);
      expect(handler2).toHaveBeenCalledWith(payload);

      timepicker.destroy();
    });

    it('should not add the same handler reference twice (Set behavior)', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ConfirmEventData]>();

      timepicker.on('confirm', handler);
      timepicker.on('confirm', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '10', minutes: '00' });

      expect(handler).toHaveBeenCalledTimes(1);

      timepicker.destroy();
    });
  });

  // ── mixed .on() + .once() ───────────────────────────────────

  describe('mixed .on() and .once() on the same event', () => {
    it('should keep .on() handler but remove .once() handler after first emit', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const persistentHandler = jest.fn<void, [ConfirmEventData]>();
      const oneTimeHandler = jest.fn<void, [ConfirmEventData]>();

      timepicker.on('confirm', persistentHandler);
      timepicker.once('confirm', oneTimeHandler);

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '01', minutes: '00' });
      emitter.emit('confirm', { hour: '02', minutes: '00' });

      expect(oneTimeHandler).toHaveBeenCalledTimes(1);
      expect(oneTimeHandler.mock.calls[0][0].hour).toBe('01');

      expect(persistentHandler).toHaveBeenCalledTimes(2);
      expect(persistentHandler.mock.calls[0][0].hour).toBe('01');
      expect(persistentHandler.mock.calls[1][0].hour).toBe('02');

      timepicker.destroy();
    });
  });

  // ── internal confirm handler sets input.value (v4.1.7 flow) ─

  describe('internal confirm handler sets input.value', () => {
    it('should update input value when confirm is emitted with hour and minutes', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '10', minutes: '30', type: 'AM' });

      expect(input.value).toBe('10:30 AM');

      timepicker.destroy();
    });

    it('should update input value without type suffix for matching payload', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '14', minutes: '00' });

      expect(input.value).toBe('14:00');

      timepicker.destroy();
    });

    it('should not update input when confirm has no hour/minutes', () => {
      input.value = 'original';

      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', {});

      expect(input.value).toBe('original');

      timepicker.destroy();
    });

    it('should still call user handler alongside internal handler', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const userHandler = jest.fn<void, [ConfirmEventData]>();
      timepicker.on('confirm', userHandler);

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '03', minutes: '15', type: 'PM' });

      expect(input.value).toBe('03:15 PM');
      expect(userHandler).toHaveBeenCalledTimes(1);
      expect(userHandler.mock.calls[0][0].hour).toBe('03');

      timepicker.destroy();
    });
  });

  // ── destroyed instance safety ───────────────────────────────

  describe('destroyed instance does not register events', () => {
    it('should silently ignore .on() after destroy', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      const handler = jest.fn();
      expect(() => timepicker.on('confirm', handler)).not.toThrow();
    });

    it('should silently ignore .once() after destroy', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      const handler = jest.fn();
      expect(() => timepicker.once('confirm', handler)).not.toThrow();
    });

    it('should silently ignore .off() after destroy', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      timepicker.destroy();

      const handler = jest.fn();
      expect(() => timepicker.off('confirm', handler)).not.toThrow();
    });

    it('should not call handler registered before destroy when emitting after destroy', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn();
      timepicker.on('confirm', handler);

      timepicker.destroy();

      // Internal emitter is cleared on destroy, so emit goes nowhere
      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '10', minutes: '00' });

      // Handler was called 0 times after destroy (emitter cleared)
      // but the internal confirm handler fires once during destroy unmount — check net calls
      // The key assertion: no NEW calls from the post-destroy emit
      const callCountAfterDestroy = handler.mock.calls.length;
      emitter.emit('confirm', { hour: '11', minutes: '00' });
      expect(handler.mock.calls.length).toBe(callCountAfterDestroy);
    });
  });

  // ── autoCommit flag ─────────────────────────────────────────

  describe('autoCommit flag on confirm event', () => {
    it('should pass autoCommit: true in confirm payload when auto-committed', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ConfirmEventData]>();
      timepicker.on('confirm', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '09', minutes: '00', autoCommit: true });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].autoCommit).toBe(true);

      timepicker.destroy();
    });

    it('should not have autoCommit when user confirms manually', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const handler = jest.fn<void, [ConfirmEventData]>();
      timepicker.on('confirm', handler);

      const emitter = getEmitter(timepicker);
      emitter.emit('confirm', { hour: '09', minutes: '00', type: 'AM' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].autoCommit).toBeUndefined();

      timepicker.destroy();
    });
  });

  // ── event ordering ──────────────────────────────────────────

  describe('event handler execution order', () => {
    it('should call handlers in registration order', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const order: number[] = [];

      const handler1 = jest.fn(() => order.push(1));
      const handler2 = jest.fn(() => order.push(2));
      const handler3 = jest.fn(() => order.push(3));

      timepicker.on('update', handler1);
      timepicker.on('update', handler2);
      timepicker.on('update', handler3);

      const emitter = getEmitter(timepicker);
      emitter.emit('update', { hour: '12', minutes: '00' });

      expect(order).toEqual([1, 2, 3]);

      timepicker.destroy();
    });
  });
});

