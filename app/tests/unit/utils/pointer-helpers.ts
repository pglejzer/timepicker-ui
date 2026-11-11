type PointerInit = MouseEventInit & {
  pointerId?: number;
  pointerType?: string;
  isPrimary?: boolean;
};

type PointerScope = { PointerEvent?: unknown };

class PointerEventPolyfill extends MouseEvent {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly isPrimary: boolean;

  constructor(type: string, init: PointerInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
    this.pointerType = init.pointerType ?? 'mouse';
    this.isPrimary = init.isPrimary ?? true;
  }
}

export const installPointerEvents = (): (() => void) => {
  const scope = globalThis as unknown as PointerScope;
  const original = scope.PointerEvent;
  const { setPointerCapture, releasePointerCapture } = HTMLElement.prototype;

  if (typeof original === 'undefined') {
    scope.PointerEvent = PointerEventPolyfill;
  }
  HTMLElement.prototype.setPointerCapture = jest.fn();
  HTMLElement.prototype.releasePointerCapture = jest.fn();

  return () => {
    scope.PointerEvent = original;
    HTMLElement.prototype.setPointerCapture = setPointerCapture;
    HTMLElement.prototype.releasePointerCapture = releasePointerCapture;
  };
};

export const dispatchPointer = (target: EventTarget, type: string, init: PointerInit = {}): void => {
  const Ctor = (globalThis as unknown as PointerScope).PointerEvent as new (
    type: string,
    init: PointerInit,
  ) => Event;
  target.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, button: 0, ...init }));
};
