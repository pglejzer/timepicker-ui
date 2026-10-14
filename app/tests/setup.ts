import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid-1234-5678-9abc-def012345678',
    },
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  });

  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(window, 'DOMMatrix', {
    writable: true,
    value: class {
      a = 1;
      b = 0;
      c = 0;
      d = 1;
      e = 0;
      f = 0;

      constructor(transform = '') {
        const rotation = /rotateZ\((-?[\d.]+)deg\)/.exec(transform);
        if (!rotation) return;

        const radians = (Number(rotation[1]) * Math.PI) / 180;
        this.a = Math.cos(radians);
        this.b = Math.sin(radians);
        this.c = -Math.sin(radians);
        this.d = Math.cos(radians);
      }
    },
  });
}

beforeEach(() => {
  if (typeof document !== 'undefined') document.body.innerHTML = '';
  jest.clearAllMocks();
});
