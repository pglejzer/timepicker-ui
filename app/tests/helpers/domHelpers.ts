export const createTimepickerInput = (value = ''): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  input.classList.add('tp-input');
  return input;
};

export const createTimepickerWrapper = (input?: HTMLInputElement): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('tp-ui');
  if (input) {
    wrapper.appendChild(input);
  }
  document.body.appendChild(wrapper);
  return wrapper;
};

export const createInlineContainer = (id: string): HTMLDivElement => {
  const container = document.createElement('div');
  container.id = id;
  document.body.appendChild(container);
  return container;
};

export const cleanupDOM = (): void => {
  const modals = document.querySelectorAll('[data-owner-id]');
  modals.forEach((modal) => modal.remove());

  const backdrops = document.querySelectorAll('.tp-ui-backdrop');
  backdrops.forEach((backdrop) => backdrop.remove());

  document.body.innerHTML = '';

  if (jest.isMockFunction(setTimeout)) {
    jest.clearAllTimers();
  }
};

export const waitForModalClose = async (timeout = 1000): Promise<void> => {
  const start = Date.now();
  while (document.querySelector('[data-owner-id]')) {
    if (Date.now() - start > timeout) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

export const openTimepickerWithTimers = (timepicker: { open: () => void }): void => {
  timepicker.open();
  if (typeof jest !== 'undefined' && jest.isMockFunction(setTimeout)) {
    jest.runAllTimers();
  }
};

export const flushTimers = (): void => {
  if (typeof jest !== 'undefined' && jest.isMockFunction(setTimeout)) {
    jest.runAllTimers();
  }
};

export const waitForElement = (selector: string, timeout = 1000): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
};

export const triggerEvent = (
  element: HTMLElement,
  eventType: string,
  options: Record<string, unknown> = {},
): void => {
  const event = new Event(eventType, { bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
};

export const triggerMouseEvent = (
  element: HTMLElement,
  eventType: string,
  clientX = 0,
  clientY = 0,
): void => {
  const event = new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
  });
  element.dispatchEvent(event);
};

export const triggerTouchEvent = (
  element: HTMLElement,
  eventType: string,
  clientX = 0,
  clientY = 0,
): void => {
  const touch = new Touch({
    identifier: Date.now(),
    target: element,
    clientX,
    clientY,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });

  const event = new TouchEvent(eventType, {
    bubbles: true,
    cancelable: true,
    touches: [touch],
    targetTouches: [touch],
    changedTouches: [touch],
  });

  element.dispatchEvent(event);
};

export const mockBoundingClientRect = (element: HTMLElement, rect: Partial<DOMRect>): void => {
  const defaultRect: DOMRect = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    top: 0,
    right: 100,
    bottom: 100,
    left: 0,
    toJSON: () => ({}),
  };

  element.getBoundingClientRect = (() => ({
    ...defaultRect,
    ...rect,
  })) as () => DOMRect;
};
