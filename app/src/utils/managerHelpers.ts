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

export function runCleanups(cleanupHandlers: Array<() => void>): void {
  cleanupHandlers.splice(0).forEach((cleanup) => cleanup());
}

export function requestOpen(emitter: EventEmitter<TimepickerEventMap>): void {
  try {
    emitter.emit('show', {});
  } finally {
    emitter.emit('open:request', {});
  }
}
