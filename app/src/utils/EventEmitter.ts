import type {
  OpenEventData,
  CancelEventData,
  ConfirmEventData,
  ShowEventData,
  HideEventData,
  UpdateEventData,
  SelectHourEventData,
  SelectMinuteEventData,
  SelectAMEventData,
  SelectPMEventData,
  SwitchViewEventData,
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
  hide: HideEventData;
  update: UpdateEventData;
  'select:hour': SelectHourEventData;
  'select:minute': SelectMinuteEventData;
  'select:am': SelectAMEventData;
  'select:pm': SelectPMEventData;
  'switch:view': SwitchViewEventData;
  'timezone:change': TimezoneChangeEventData;
  'range:confirm': RangeConfirmEventData;
  'range:switch': RangeSwitchEventData;
  'range:validation': RangeValidationEventData;
  'range:minute:commit': RangeMinuteCommitEventData;
  'range:get-disabled-time': RangeGetDisabledTimeEventData;
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

export class EventEmitter<EventMap extends Record<string, unknown> = TimepickerEventMap> {
  private events = new Map<keyof EventMap, Set<EventHandler<unknown>>>();

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler as EventHandler<unknown>);
  }

  once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const wrapped: TaggedHandler = ((data: unknown) => {
      handler(data as EventMap[K]);
      this.events.get(event)?.delete(wrapped);
    }) as TaggedHandler;
    wrapped.__originalHandler = handler as EventHandler<unknown>;
    this.on(event, wrapped as EventHandler<EventMap[K]>);
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
