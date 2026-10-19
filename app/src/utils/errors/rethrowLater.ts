export function rethrowLater(error: unknown): void {
  queueMicrotask(() => {
    throw error;
  });
}
