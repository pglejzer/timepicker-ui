import type { EventEmitter, TimepickerEventMap } from './EventEmitter';

export function bindEmitter<K extends keyof TimepickerEventMap>(
  emitter: EventEmitter<TimepickerEventMap>,
  cleanupHandlers: Array<() => void>,
  event: K,
  handler: (data: TimepickerEventMap[K]) => void,
): void {
  emitter.on(event, handler);
  cleanupHandlers.push(() => emitter.off(event, handler));
}
