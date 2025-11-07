import type { CallbackData } from '../types/types';

type EventHandler<T = CallbackData> = (data: T) => void;

export interface TimepickerEventMap {
  open: CallbackData;
  cancel: CallbackData;
  confirm: CallbackData;
  show: CallbackData;
  hide: CallbackData;
  update: CallbackData;
  'select:hour': CallbackData;
  'select:minute': CallbackData;
  'select:am': CallbackData;
  'select:pm': CallbackData;
  error: CallbackData;
}

export class EventEmitter<EventMap extends Record<string, any> = TimepickerEventMap> {
  private events = new Map<keyof EventMap, Set<EventHandler<any>>>();

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler as EventHandler<any>);
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
      this.events.get(event)?.delete(handler as EventHandler<any>);
    }
  }

  emit<K extends keyof EventMap>(event: K, data?: EventMap[K]): void {
    this.events.get(event)?.forEach((handler) => {
      try {
        handler(data as EventMap[K]);
      } catch (error) {
        console.error(`EventEmitter: Error in handler for "${String(event)}":`, error);
      }
    });
  }

  clear(): void {
    this.events.clear();
  }

  hasListeners<K extends keyof EventMap>(event: K): boolean {
    return (this.events.get(event)?.size ?? 0) > 0;
  }
}

