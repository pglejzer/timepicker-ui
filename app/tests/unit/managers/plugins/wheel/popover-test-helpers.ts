import PopoverManager from '@/managers/plugins/wheel/PopoverManager';
import { CoreState } from '@/timepicker/CoreState';
import type { TimepickerOptions } from '@/types/options';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { mergeOptions } from '@/utils/options/defaults';

export interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

type Metric = 'offsetWidth' | 'offsetHeight' | 'clientWidth' | 'clientHeight' | 'scrollWidth' | 'scrollHeight';

export class GlobalStubs {
  private readonly restores: Array<() => void> = [];

  set(target: object, key: PropertyKey, value: unknown): void {
    const record = target as Record<PropertyKey, unknown>;
    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    if (descriptor && !descriptor.configurable) {
      record[key] = value;
      this.restores.push(() => {
        record[key] = descriptor.value;
      });
      return;
    }

    Object.defineProperty(target, key, { configurable: true, enumerable: true, writable: true, value });
    this.restores.push(() => {
      if (descriptor) {
        Object.defineProperty(target, key, descriptor);
      } else {
        delete record[key];
      }
    });
  }

  restore(): void {
    this.restores
      .splice(0)
      .reverse()
      .forEach((restore) => restore());
  }
}

export interface AnimationFrames {
  request: jest.Mock<number, [FrameRequestCallback]>;
  cancel: jest.Mock<void, [number]>;
  pending: () => number;
  flush: () => void;
}

export function stubAnimationFrames(stubs: GlobalStubs): AnimationFrames {
  const callbacks = new Map<number, FrameRequestCallback>();
  let lastId = 0;
  const request = jest.fn((callback: FrameRequestCallback): number => {
    lastId += 1;
    callbacks.set(lastId, callback);
    return lastId;
  });
  const cancel = jest.fn((id: number): void => {
    callbacks.delete(id);
  });

  stubs.set(window, 'requestAnimationFrame', request);
  stubs.set(window, 'cancelAnimationFrame', cancel);

  return {
    request,
    cancel,
    pending: () => callbacks.size,
    flush: () => {
      const queued = [...callbacks.values()];
      callbacks.clear();
      queued.forEach((callback) => callback(0));
    },
  };
}

export class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  readonly observe = jest.fn<void, [Element]>();
  readonly unobserve = jest.fn<void, [Element]>();
  readonly disconnect = jest.fn<void, []>();
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    FakeResizeObserver.instances.push(this);
  }

  trigger(): void {
    this.callback([], this as unknown as ResizeObserver);
  }
}

export function stubResizeObserver(stubs: GlobalStubs): FakeResizeObserver[] {
  FakeResizeObserver.instances = [];
  stubs.set(window, 'ResizeObserver', FakeResizeObserver);
  return FakeResizeObserver.instances;
}

export type FakeVisualViewport = EventTarget & {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
};

export function stubVisualViewport(
  stubs: GlobalStubs,
  size: Partial<Omit<FakeVisualViewport, keyof EventTarget>> = {},
): FakeVisualViewport {
  const viewport: FakeVisualViewport = Object.assign(new EventTarget(), {
    width: 1024,
    height: 768,
    offsetLeft: 0,
    offsetTop: 0,
    ...size,
  });
  stubs.set(window, 'visualViewport', viewport);
  return viewport;
}

export function stubLayoutViewport(stubs: GlobalStubs, width: number, height: number): void {
  stubs.set(document.documentElement, 'clientWidth', width);
  stubs.set(document.documentElement, 'clientHeight', height);
}

export function stubCssSupports(
  stubs: GlobalStubs,
  supportedProperties: string[],
): jest.Mock<boolean, [string, string]> {
  const supports = jest.fn((property: string, _value: string): boolean =>
    supportedProperties.includes(property),
  );
  stubs.set(globalThis, 'CSS', { supports });
  return supports;
}

export interface PopoverApiStub {
  showPopover: jest.Mock<void, []>;
  hidePopover: jest.Mock<void, []>;
}

export function stubPopoverApi(stubs: GlobalStubs): PopoverApiStub {
  const showPopover = jest.fn<void, []>();
  const hidePopover = jest.fn<void, []>();
  stubs.set(HTMLElement.prototype, 'showPopover', showPopover);
  stubs.set(HTMLElement.prototype, 'hidePopover', hidePopover);
  return { showPopover, hidePopover };
}

export const POPOVER_TOKENS = [
  '--tp-popover-gap',
  '--tp-popover-min-width',
  '--tp-popover-max-width',
  '--tp-popover-edge-margin',
  '--tp-wheel-item-height',
] as const;

const TOKEN_PROBE_VALUE = /^var\((--tp-[\w-]+)\)$/;

export interface TokenRead {
  token: string;
  probe: HTMLElement;
  scope: Element | null;
}

export interface PopoverTokensStub {
  computedStyle: jest.SpyInstance<CSSStyleDeclaration, Parameters<typeof window.getComputedStyle>>;
  reads: TokenRead[];
}

export function stubPopoverTokens(resolved: Record<string, string> = {}): PopoverTokensStub {
  const realGetComputedStyle = window.getComputedStyle.bind(window);
  const reads: TokenRead[] = [];
  const computedStyle = jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation((element: Element, pseudoElt?: string | null): CSSStyleDeclaration => {
      const style = realGetComputedStyle(element, pseudoElt);
      const probe = element as HTMLElement;
      const token = TOKEN_PROBE_VALUE.exec(probe.style.getPropertyValue('max-width'))?.[1];
      if (token) {
        reads.push({ token, probe, scope: probe.parentElement });
        style.setProperty('max-width', resolved[token] ?? 'none');
      }
      return style;
    });

  return { computedStyle, reads };
}

export function rectOf({ top, left, width, height }: Box): DOMRect {
  return {
    top,
    left,
    width,
    height,
    x: left,
    y: top,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect;
}

export function placeBox(element: Element, box: Box): jest.Mock<DOMRect, []> {
  const getBoundingClientRect = jest.fn((): DOMRect => rectOf(box));
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: getBoundingClientRect,
  });
  return getBoundingClientRect;
}

export function setMetrics(element: Element, metrics: Partial<Record<Metric, number>>): void {
  Object.entries(metrics).forEach(([key, value]) => {
    Object.defineProperty(element, key, { configurable: true, value });
  });
}

export interface PopoverFixture {
  container: HTMLDivElement;
  input: HTMLInputElement;
  modal: HTMLDivElement;
  wrapper: HTMLDivElement;
  wheel: HTMLDivElement;
  core: CoreState;
  emitter: EventEmitter<TimepickerEventMap>;
  manager: PopoverManager;
}

export interface PopoverFixtureOptions {
  instanceId?: string;
  options?: TimepickerOptions;
  host?: ParentNode;
}

export function createPopoverFixture({
  instanceId = 'popover-test',
  options = {},
  host = document.body,
}: PopoverFixtureOptions = {}): PopoverFixture {
  const container = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'text';
  container.appendChild(input);
  host.appendChild(container);

  const modal = document.createElement('div');
  modal.className = 'tp-ui-modal tp-ui-compact-wheel-mode';
  modal.setAttribute('data-owner-id', instanceId);
  const wrapper = document.createElement('div');
  wrapper.className = 'tp-ui-wrapper';
  const wheel = document.createElement('div');
  wheel.className = 'tp-ui-wheel-container';
  wrapper.appendChild(wheel);
  modal.appendChild(wrapper);
  document.body.appendChild(modal);

  const core = new CoreState(
    container,
    mergeOptions({
      ...options,
      ui: { mode: 'compact-wheel', ...options.ui },
      wheel: { placement: 'auto', ...options.wheel },
    }),
    instanceId,
  );
  core.setIsOpen(true);
  const emitter = new EventEmitter<TimepickerEventMap>();
  const manager = new PopoverManager(core, emitter);

  return { container, input, modal, wrapper, wheel, core, emitter, manager };
}
