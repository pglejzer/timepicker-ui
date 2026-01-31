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
  ErrorEventData,
} from '../types/types';

type EventHandler<T = unknown> = (data: T) => void;

export interface TimepickerEventMap {
  open: OpenEventData;
  cancel: CancelEventData;
  confirm: ConfirmEventData;
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
  'animation:clock': Record<string, never>;
  'animation:start': Record<string, never>;
  'animation:end': Record<string, never>;
  error: ErrorEventData;
  [key: string]: unknown;
}

export class EventEmitter<EventMap extends Record<string, unknown> = TimepickerEventMap> {
  private events = new Map<keyof EventMap, Set<EventHandler<unknown>>>();

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler as EventHandler<unknown>);
  }

  once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const wrappedHandler = (data: EventMap[K]) => {
      handler(data);
      this.off(event, wrappedHandler);
    };
    this.on(event, wrappedHandler);
  }

  off<K extends keyof EventMap>(event: K, handler?: EventHandler<EventMap[K]>): void {
    if (!handler) {
      this.events.delete(event);
    } else {
      this.events.get(event)?.delete(handler as EventHandler<unknown>);
    }
  }

  emit<K extends keyof EventMap>(event: K, data?: EventMap[K]): void {
    this.events.get(event)?.forEach((handler) => {
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
