import '@testing-library/jest-dom';

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const errorString = args.join(' ');

  if (
    errorString.includes('Uncaught') ||
    errorString.includes('Cannot read properties of null') ||
    errorString.includes('Cannot read properties of undefined')
  ) {
    return;
  }

  originalConsoleError.call(console, ...args);
};

Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => '12345678-1234-4abc-8abc-123456789012',
  },
});

Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  writable: true,
});

global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(Date.now()), 0) as unknown as number;
};

global.cancelAnimationFrame = (id: number): void => {
  clearTimeout(id);
};

HTMLElement.prototype.scrollIntoView = jest.fn();

global.Touch = class Touch {
  identifier: number;
  target: EventTarget;
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
  pageX: number;
  pageY: number;
  radiusX: number;
  radiusY: number;
  rotationAngle: number;
  force: number;

  constructor(touchInit: TouchInit) {
    this.identifier = touchInit.identifier;
    this.target = touchInit.target;
    this.clientX = touchInit.clientX || 0;
    this.clientY = touchInit.clientY || 0;
    this.screenX = touchInit.screenX || 0;
    this.screenY = touchInit.screenY || 0;
    this.pageX = touchInit.pageX || 0;
    this.pageY = touchInit.pageY || 0;
    this.radiusX = touchInit.radiusX || 0;
    this.radiusY = touchInit.radiusY || 0;
    this.rotationAngle = touchInit.rotationAngle || 0;
    this.force = touchInit.force || 0;
  }
} as unknown as typeof Touch;

global.TouchEvent = class TouchEvent extends UIEvent {
  touches: TouchList;
  targetTouches: TouchList;
  changedTouches: TouchList;

  constructor(type: string, eventInit?: TouchEventInit) {
    super(type, eventInit);
    this.touches = (eventInit?.touches as unknown as TouchList) || ([] as unknown as TouchList);
    this.targetTouches = (eventInit?.targetTouches as unknown as TouchList) || ([] as unknown as TouchList);
    this.changedTouches = (eventInit?.changedTouches as unknown as TouchList) || ([] as unknown as TouchList);
  }
} as unknown as typeof TouchEvent;

