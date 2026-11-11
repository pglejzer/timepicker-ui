export class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  readonly observe = jest.fn<void, [Element]>();
  readonly disconnect = jest.fn<void, []>();
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    FakeResizeObserver.instances.push(this);
  }

  fire(): void {
    this.callback([], this as unknown as ResizeObserver);
  }
}

const replaceResizeObserver = (value: unknown): (() => void) => {
  const original = window.ResizeObserver;
  Object.assign(window, { ResizeObserver: value });
  return () => {
    Object.assign(window, { ResizeObserver: original });
  };
};

export const installFakeResizeObserver = (): (() => void) => {
  FakeResizeObserver.instances = [];
  return replaceResizeObserver(FakeResizeObserver);
};

export const removeResizeObserver = (): (() => void) => replaceResizeObserver(undefined);

export const sizeOf = (element: Element, width: number, height: number = width): void => {
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({ width, height } as DOMRect);
};
