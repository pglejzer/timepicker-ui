import type {
  OpenEventData,
  CancelEventData,
  ConfirmEventData,
  ShowEventData,
  HideEventData,
  UpdateEventData,
  SelectHourEventData,
  SelectMinuteEventData,
  SelectSecondEventData,
  SelectAMEventData,
  SelectPMEventData,
  SwitchViewEventData,
  SelectPeriodEventData,
  SwitchFaceEventData,
  TimezoneChangeEventData,
  RangeConfirmEventData,
  RangeSwitchEventData,
  RangeValidationEventData,
  RangeMinuteCommitEventData,
  RangeGetDisabledTimeEventData,
  RangeUpdateDisabledEventData,
  WheelScrollStartEventData,
  WheelScrollEndEventData,
  ErrorEventData,
  ClearEventData,
} from '../types/types';

type EventHandler<T = unknown> = (data: T) => void;

export interface TimepickerEventMap {
  open: OpenEventData;
  cancel: CancelEventData;
  confirm: ConfirmEventData;
  clear: ClearEventData;
  show: ShowEventData;
  /**
   * @internal Emitted right after `show` when the user activates an open element or presses Enter in the input; the picker mounts on it, so every `show` listener runs before render. Not bridged to a callback.
   */
  'open:request': Record<string, never>;
  /**
   * @deprecated Never emitted. Removed in 5.0.
   */
  hide: HideEventData;
  update: UpdateEventData;
  'select:hour': SelectHourEventData;
  'select:minute': SelectMinuteEventData;
  'select:second': SelectSecondEventData;
  'select:am': SelectAMEventData;
  'select:pm': SelectPMEventData;
  'select:period': SelectPeriodEventData;
  'switch:view': SwitchViewEventData;
  'switch:face': SwitchFaceEventData;
  'timezone:change': TimezoneChangeEventData;
  'range:confirm': RangeConfirmEventData;
  'range:switch': RangeSwitchEventData;
  'range:validation': RangeValidationEventData;
  'range:minute:commit': RangeMinuteCommitEventData;
  /**
   * @deprecated Never emitted or read. Removed in 5.0.
   */
  'range:get-disabled-time': RangeGetDisabledTimeEventData;
  /**
   * @deprecated Never emitted or read. Removed in 5.0.
   */
  'range:update-disabled': RangeUpdateDisabledEventData;
  'wheel:scroll:start': WheelScrollStartEventData;
  'wheel:scroll:end': WheelScrollEndEventData;
  'animation:clock': Record<string, never>;
  'animation:start': Record<string, never>;
  'animation:end': Record<string, never>;
  error: ErrorEventData;
  [key: string]: unknown;
}

type TaggedHandler = EventHandler<unknown> & { __originalHandler?: EventHandler<unknown> };

/** @remarks This API changes in 5.0.0; see the roadmap. */
export class EventEmitter<EventMap extends Record<string, unknown> = TimepickerEventMap> {
  private events = new Map<keyof EventMap, Set<EventHandler<unknown>>>();

  /**
   * Subscribe to an event.
   * @returns A function that removes this handler. Calling it more than once is a no-op.
   */
  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    const registered = handler as EventHandler<unknown>;
    this.events.get(event)!.add(registered);
    return () => {
      this.events.get(event)?.delete(registered);
    };
  }

  /**
   * Subscribe to an event for one call.
   * @returns A function that removes the handler before it runs. Calling it more than once is a no-op.
   */
  once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    const wrapped: TaggedHandler = ((data: unknown) => {
      handler(data as EventMap[K]);
      this.events.get(event)?.delete(wrapped);
    }) as TaggedHandler;
    wrapped.__originalHandler = handler as EventHandler<unknown>;
    return this.on(event, wrapped as EventHandler<EventMap[K]>);
  }

  off<K extends keyof EventMap>(event: K, handler?: EventHandler<EventMap[K]>): void {
    if (!handler) {
      this.events.delete(event);
      return;
    }
    const set = this.events.get(event);
    if (!set) return;
    set.forEach((registered) => {
      if (registered === handler || (registered as TaggedHandler).__originalHandler === handler) {
        set.delete(registered);
      }
    });
  }

  emit<K extends keyof EventMap>(event: K, data?: EventMap[K]): void {
    const set = this.events.get(event);
    if (!set) return;
    [...set].forEach((handler) => {
      handler(data as EventMap[K]);
    });
  }

  clear(): void {
    this.events.clear();
  }

  hasListeners<K extends keyof EventMap>(event: K): boolean {
    return (this.events.get(event)?.size ?? 0) > 0;
  }
}
