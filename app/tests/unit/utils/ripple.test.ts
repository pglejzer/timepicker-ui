import { initMd3Ripple } from '@/utils/ripple';

type PointerInit = MouseEventInit & { pointerType?: string; isPrimary?: boolean };
type ListenerCall = [string, unknown, (boolean | AddEventListenerOptions)?];

const RECT = { left: 10, top: 20, width: 100, height: 40, right: 110, bottom: 60, x: 10, y: 20 } as DOMRect;
const FRAME_MS = 16;

const pointer = (type: string, init: PointerInit = {}): MouseEvent => {
  const { pointerType = 'mouse', isPrimary = true, ...mouseInit } = init;
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, ...mouseInit });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: pointerType },
    isPrimary: { value: isPrimary },
  });
  return event;
};

const press = (target: Element, init: PointerInit = {}): void => {
  target.dispatchEvent(pointer('pointerdown', { clientX: 60, clientY: 70, ...init }));
};

const release = (target: Element, type: 'pointerup' | 'pointercancel' = 'pointerup'): void => {
  target.dispatchEvent(pointer(type, { button: type === 'pointerup' ? 0 : -1 }));
};

const leave = (host: Element): void => {
  host.dispatchEvent(pointer('pointerleave', { bubbles: false, button: -1 }));
};

const animationEnd = (host: Element, animationName: string): void => {
  const event = new Event('animationend', { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: animationName });
  host.dispatchEvent(event);
};

const createRoot = () => {
  const root = document.createElement('div');
  const host = document.createElement('div');
  const label = document.createElement('span');
  const plain = document.createElement('div');
  host.setAttribute('data-md3-ripple', '');
  host.appendChild(label);
  root.append(host, plain);
  document.body.appendChild(root);
  jest.spyOn(host, 'getBoundingClientRect').mockReturnValue(RECT);
  return { root, host, label, plain };
};

const cleanups: Array<() => void> = [];

const init = (root: Document | HTMLElement): (() => void) => {
  const cleanup = initMd3Ripple(root);
  cleanups.push(cleanup);
  return cleanup;
};

const runCleanups = (): void => {
  cleanups.splice(0).forEach((cleanup) => {
    if (typeof cleanup === 'function') cleanup();
  });
};

const captureOf = (options: ListenerCall[2]): boolean =>
  typeof options === 'boolean' ? options : Boolean(options?.capture);

const isDetached = ([type, listener, options]: ListenerCall, removed: ListenerCall[]): boolean => {
  if (typeof options === 'object' && options.signal?.aborted) return true;
  return removed.some(
    ([removedType, removedListener, removedOptions]) =>
      removedType === type && removedListener === listener && captureOf(removedOptions) === captureOf(options),
  );
};

let frames = new Map<number, FrameRequestCallback>();
let lastFrameId = 0;

const queueFrames = (): void => {
  frames = new Map();
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    lastFrameId += 1;
    frames.set(lastFrameId, callback);
    return lastFrameId;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id);
  });
};

const flushFrame = (): void => {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(0));
};

describe('initMd3Ripple', () => {
  beforeEach(queueFrames);

  afterEach(() => {
    runCleanups();
    jest.restoreAllMocks();
  });

  describe('listeners', () => {
    it('should listen for pointerdown, pointerup and pointercancel on the root', () => {
      const { root } = createRoot();
      const added = jest.spyOn(root, 'addEventListener');

      init(root);

      const types = added.mock.calls.map(([type]) => type);
      expect(types).toEqual(expect.arrayContaining(['pointerdown', 'pointerup', 'pointercancel']));
    });

    it('should add no listeners to hosts or their children at init', () => {
      const { root, host, label } = createRoot();
      const hostListeners = jest.spyOn(host, 'addEventListener');
      const labelListeners = jest.spyOn(label, 'addEventListener');

      init(root);

      expect(hostListeners).not.toHaveBeenCalled();
      expect(labelListeners).not.toHaveBeenCalled();
    });

    it('should add no listeners on a second init of the same root', () => {
      const { root } = createRoot();
      init(root);
      const added = jest.spyOn(root, 'addEventListener');

      init(root);

      expect(added).not.toHaveBeenCalled();
    });

    it('should return a cleanup that detaches every listener it added to the root', () => {
      const { root } = createRoot();
      const added = jest.spyOn(root, 'addEventListener');
      const removed = jest.spyOn(root, 'removeEventListener');

      init(root)();

      const addedCalls = added.mock.calls as unknown as ListenerCall[];
      const removedCalls = removed.mock.calls as unknown as ListenerCall[];
      const stillAttached = addedCalls.filter((call) => !isDetached(call, removedCalls)).map(([type]) => type);
      expect(addedCalls.length).toBeGreaterThan(0);
      expect(stillAttached).toEqual([]);
    });

    it('should stop reacting to presses after cleanup', () => {
      const { root, host } = createRoot();

      init(root)();
      press(host);
      flushFrame();

      expect(host).not.toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');
      expect(host.style.getPropertyValue('--ripple-x')).toBe('');
    });

    it('should attach again to a root after cleanup', () => {
      const { root, host } = createRoot();

      init(root)();
      init(root);
      press(host);

      expect(host).toHaveClass('is-pressed');
    });

    it('should accept the document as the root', () => {
      const { host } = createRoot();

      init(document);
      press(host);

      expect(host).toHaveClass('is-pressed');
    });
  });

  describe('press', () => {
    it('should set --ripple-x and --ripple-y to the press point inside the host', () => {
      const { root, host } = createRoot();
      init(root);

      press(host);

      expect(host.style.getPropertyValue('--ripple-x')).toBe('50px');
      expect(host.style.getPropertyValue('--ripple-y')).toBe('50px');
    });

    it('should set --ripple-size to twice the longer side of the host', () => {
      const { root, host } = createRoot();
      init(root);

      press(host);

      expect(host.style.getPropertyValue('--ripple-size')).toBe('200px');
    });

    it('should add is-pressed to the host', () => {
      const { root, host } = createRoot();
      init(root);

      press(host);

      expect(host).toHaveClass('is-pressed');
    });

    it('should add is-rippling only on the next animation frame', () => {
      const { root, host } = createRoot();
      init(root);

      press(host);
      expect(host).not.toHaveClass('is-rippling');

      flushFrame();
      expect(host).toHaveClass('is-rippling');
    });

    it('should restart the wave without reading offsetWidth or offsetHeight', () => {
      const { root, host } = createRoot();
      const offsetWidth = jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get');
      const offsetHeight = jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get');
      init(root);

      press(host);
      flushFrame();
      release(host);
      press(host);
      flushFrame();

      expect(offsetWidth).not.toHaveBeenCalled();
      expect(offsetHeight).not.toHaveBeenCalled();
    });

    it('should resolve the host from a nested child', () => {
      const { root, host, label } = createRoot();
      init(root);

      press(label);

      expect(host).toHaveClass('is-pressed');
      expect(label).not.toHaveClass('is-pressed');
    });

    it('should ignore presses outside any host', () => {
      const { root, host, plain } = createRoot();
      init(root);

      press(plain);
      flushFrame();

      expect(plain.className).toBe('');
      expect(host).not.toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');
    });

    it.each([
      { name: 'middle', button: 1 },
      { name: 'right', button: 2 },
    ])('should ignore the $name mouse button', ({ button }) => {
      const { root, host } = createRoot();
      init(root);

      press(host, { button });
      flushFrame();

      expect(host).not.toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');
      expect(host.style.getPropertyValue('--ripple-x')).toBe('');
    });

    it.each([
      {
        name: 'aria-disabled="true"',
        disable: (host: HTMLElement) => host.setAttribute('aria-disabled', 'true'),
      },
      { name: 'the disabled class', disable: (host: HTMLElement) => host.classList.add('disabled') },
    ])('should ignore a host disabled by $name', ({ disable }) => {
      const { root, host } = createRoot();
      disable(host);
      init(root);

      press(host);
      flushFrame();

      expect(host).not.toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');
    });

    it('should still ripple a host with aria-disabled="false"', () => {
      const { root, host } = createRoot();
      host.setAttribute('aria-disabled', 'false');
      init(root);

      press(host);
      flushFrame();

      expect(host).toHaveClass('is-pressed');
      expect(host).toHaveClass('is-rippling');
    });

    it('should show no wave or pressed state on keyboard activation', () => {
      const { root, host } = createRoot();
      host.setAttribute('tabindex', '0');
      init(root);

      host.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      host.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      host.click();
      flushFrame();

      expect(host).not.toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');
    });
  });

  describe('reduced motion', () => {
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
      window.matchMedia = jest.fn((query: string) => ({
        matches: /prefers-reduced-motion:\s*reduce/.test(query),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })) as unknown as typeof window.matchMedia;
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('should add is-pressed but never is-rippling', () => {
      const { root, host } = createRoot();
      init(root);

      press(host);
      flushFrame();

      expect(host).toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');
    });
  });

  describe('release', () => {
    it.each(['pointerup', 'pointercancel'] as const)('should remove is-pressed on %s', (type) => {
      const { root, host } = createRoot();
      init(root);
      press(host);
      flushFrame();
      expect(host).toHaveClass('is-pressed');

      release(host, type);

      expect(host).not.toHaveClass('is-pressed');
    });

    it('should remove is-pressed when the pointer leaves the pressed host', () => {
      const { root, host } = createRoot();
      init(root);
      press(host);
      flushFrame();
      expect(host).toHaveClass('is-pressed');

      leave(host);

      expect(host).not.toHaveClass('is-pressed');
    });

    it('should keep is-rippling after release so the wave can fade out', () => {
      const { root, host } = createRoot();
      init(root);
      press(host);
      flushFrame();

      release(host);

      expect(host).toHaveClass('is-rippling');
    });

    it('should keep is-rippling when an animation other than tp-ripple-fade ends', () => {
      const { root, host } = createRoot();
      init(root);
      press(host);
      flushFrame();
      release(host);

      animationEnd(host, 'tp-ripple-expand');

      expect(host).toHaveClass('is-rippling');
    });

    it('should remove is-rippling when tp-ripple-fade ends', () => {
      const { root, host } = createRoot();
      init(root);
      press(host);
      flushFrame();
      release(host);

      animationEnd(host, 'tp-ripple-fade');

      expect(host).not.toHaveClass('is-rippling');
    });

    it('should still play the wave for a tap released before the next frame', () => {
      const { root, host } = createRoot();
      init(root);

      press(host);
      release(host);
      flushFrame();

      expect(host).not.toHaveClass('is-pressed');
      expect(host).toHaveClass('is-rippling');
    });
  });

  describe('separate roots', () => {
    it.each(['pointerup', 'pointercancel'] as const)(
      'should never release a host of another root on %s',
      (type) => {
        const first = createRoot();
        const second = createRoot();
        init(first.root);
        init(second.root);
        press(first.host);
        flushFrame();
        expect(first.host).toHaveClass('is-pressed');

        release(second.plain, type);

        expect(first.host).toHaveClass('is-pressed');
        expect(first.host).toHaveClass('is-rippling');
      },
    );
  });

  describe('repeated presses', () => {
    it('should drop is-rippling at once on a new press and add it back on the next frame', () => {
      const { root, host } = createRoot();
      init(root);
      press(host);
      flushFrame();
      release(host);

      press(host);

      expect(host).toHaveClass('is-pressed');
      expect(host).not.toHaveClass('is-rippling');

      flushFrame();

      expect(host).toHaveClass('is-rippling');
    });
  });
});

describe('initMd3Ripple timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    runCleanups();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should leave no timer or animation frame pending after press, release and fade', () => {
    const { root, host } = createRoot();
    init(root);

    press(host);
    jest.advanceTimersByTime(FRAME_MS);
    release(host);
    animationEnd(host, 'tp-ripple-fade');

    expect(jest.getTimerCount()).toBe(0);
  });

  it('should not let a previous press cut the next wave short', () => {
    const { root, host } = createRoot();
    init(root);
    press(host);
    jest.advanceTimersByTime(FRAME_MS);
    release(host);

    press(host);
    jest.advanceTimersByTime(FRAME_MS);
    jest.advanceTimersByTime(5000);

    expect(host).toHaveClass('is-pressed');
    expect(host).toHaveClass('is-rippling');
  });
});
