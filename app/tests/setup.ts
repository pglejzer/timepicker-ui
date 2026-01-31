import '@testing-library/jest-dom';

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

beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

