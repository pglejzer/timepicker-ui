import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { isDocument } from '../../../utils/node';
import { isPopoverMode as hasPopoverPlacement } from '../../../utils/options/predicates';

export type PopoverSide = 'top' | 'bottom';

export type PopoverRequest = PopoverSide | 'auto';

export type PopoverAnchorRect = Pick<DOMRectReadOnly, 'top' | 'bottom' | 'left' | 'right' | 'width'>;

export interface PopoverViewport {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
}

export interface PopoverTokens {
  gap: number;
  minWidth: number;
  maxWidth: number;
  edgeMargin: number;
}

export interface PopoverLayoutInput {
  anchor: PopoverAnchorRect;
  contentWidth: number;
  pickerHeight: number;
  minHeight: number;
  layoutWidth: number;
  viewport: PopoverViewport;
  tokens: PopoverTokens;
  request: PopoverRequest;
  rtl: boolean;
  pixelRatio: number;
}

export interface PopoverLayout {
  top: number;
  left: number;
  width: number;
  placement: PopoverSide;
  availableHeight: number | null;
}

const PLACEMENT_ATTRIBUTE = 'data-popover-placement';
const DIRECTION_ATTRIBUTE = 'data-popover-dir';
const ANCHOR_NAME = 'anchor-name';
const TOKEN_PROBE_STYLE = 'position:absolute;visibility:hidden;pointer-events:none';

const snapToPixel = (value: number, pixelRatio: number): number =>
  Math.round(value * pixelRatio) / pixelRatio;

export function computePopoverLayout({
  anchor,
  contentWidth,
  pickerHeight,
  minHeight,
  layoutWidth,
  viewport,
  tokens,
  request,
  rtl,
  pixelRatio,
}: PopoverLayoutInput): PopoverLayout {
  const { gap, minWidth, maxWidth, edgeMargin } = tokens;
  const { offsetLeft, offsetTop } = viewport;
  const width = snapToPixel(
    Math.min(Math.max(anchor.width, minWidth, contentWidth), maxWidth, layoutWidth - 2 * edgeMargin),
    pixelRatio,
  );
  const minTop = offsetTop + edgeMargin;
  const spaceAbove = anchor.top - gap - minTop;
  const spaceBelow = offsetTop + viewport.height - edgeMargin - anchor.bottom - gap;
  const fitsBelow = pickerHeight <= spaceBelow;
  const fitsAbove = pickerHeight <= spaceAbove;
  const autoPlacement: PopoverSide = fitsBelow || (!fitsAbove && spaceBelow >= spaceAbove) ? 'bottom' : 'top';
  const isTopRequested = (request === 'auto' ? autoPlacement : request) === 'top';
  const requestedSpace = isTopRequested ? spaceAbove : spaceBelow;
  const otherSpace = isTopRequested ? spaceBelow : spaceAbove;
  const isCramped = requestedSpace < Math.min(pickerHeight, minHeight) && otherSpace > requestedSpace;
  const isTop = isCramped ? !isTopRequested : isTopRequested;
  const placement: PopoverSide = isTop ? 'top' : 'bottom';
  const space = isTop ? spaceAbove : spaceBelow;
  const availableHeight = pickerHeight > space ? Math.max(space, 0) : null;
  const height = availableHeight ?? pickerHeight;
  const top = isTop ? anchor.top - gap - height : anchor.bottom + gap;
  const preferredLeft = rtl ? anchor.right - width : anchor.left;
  const left = Math.max(
    Math.min(preferredLeft, offsetLeft + viewport.width - width - edgeMargin),
    offsetLeft + edgeMargin,
  );

  return {
    top: snapToPixel(Math.max(top, minTop), pixelRatio),
    left: snapToPixel(left, pixelRatio),
    width,
    placement,
    availableHeight,
  };
}

const supportsAnchoredPopover = (input: HTMLElement): boolean =>
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports(ANCHOR_NAME, '--tp-ui-a') &&
  CSS.supports('position-try-fallbacks', 'flip-block') &&
  typeof HTMLElement !== 'undefined' &&
  typeof HTMLElement.prototype.showPopover === 'function' &&
  input.getRootNode() === document;

function showAnchoredPopover(
  modal: HTMLElement,
  input: HTMLElement,
  anchorName: string,
  rtl: boolean,
): (() => void) | null {
  modal.setAttribute('popover', 'manual');
  try {
    modal.showPopover();
  } catch {
    modal.removeAttribute('popover');
    return null;
  }

  const { style } = input;
  const previousAnchorName = style.getPropertyValue(ANCHOR_NAME);
  style.setProperty(ANCHOR_NAME, anchorName);
  modal.style.setProperty('--tp-popover-anchor', anchorName);
  modal.setAttribute(DIRECTION_ATTRIBUTE, rtl ? 'rtl' : 'ltr');
  modal.classList.add('tp-ui-popover-anchored');
  return (): void => {
    style.setProperty(ANCHOR_NAME, previousAnchorName);
    modal.removeAttribute(DIRECTION_ATTRIBUTE);
  };
}

function resolveAnchoredPlacement(modal: HTMLElement, input: HTMLElement): void {
  const isAbove = modal.getBoundingClientRect().top < input.getBoundingClientRect().top;
  modal.setAttribute(PLACEMENT_ATTRIBUTE, isAbove ? 'top' : 'bottom');
}

const readToken = (probe: HTMLElement, name: string, fallback: number): number => {
  probe.style.setProperty('max-width', `var(--tp-${name})`);
  const resolved = getComputedStyle(probe).getPropertyValue('max-width');
  const value = resolved.endsWith('px') ? parseFloat(resolved) : NaN;
  return value >= 0 ? value : fallback;
};

function readPopoverTokens(modal: HTMLElement): PopoverTokens & { wheelItemHeight: number } {
  const probe = document.createElement('div');
  probe.style.cssText = TOKEN_PROBE_STYLE;
  modal.appendChild(probe);
  const tokens = {
    gap: readToken(probe, 'popover-gap', 4),
    minWidth: readToken(probe, 'popover-min-width', 260),
    maxWidth: readToken(probe, 'popover-max-width', 328),
    edgeMargin: readToken(probe, 'popover-edge-margin', 4),
    wheelItemHeight: readToken(probe, 'wheel-item-height', 44),
  };
  probe.remove();
  return tokens;
}

const measureWheelItemHeight = (modal: HTMLElement, fallback: number): number =>
  modal.querySelector<HTMLElement>('.tp-ui-wheel-item')?.offsetHeight || fallback;

function createFallbackPositioner(
  modal: HTMLElement,
  input: HTMLElement,
  wrapper: HTMLElement,
  request: PopoverRequest,
  rtl: boolean,
): () => void {
  const { wheelItemHeight, ...tokens } = readPopoverTokens(modal);
  const { style } = modal;

  return (): void => {
    const root = document.documentElement;
    style.width = 'max-content';
    const { top, left, width, placement, availableHeight } = computePopoverLayout({
      anchor: input.getBoundingClientRect(),
      contentWidth:
        (modal.querySelector('.tp-ui-wheel-container')?.scrollWidth ?? 0) +
        wrapper.offsetWidth -
        wrapper.clientWidth,
      pickerHeight: Math.max(
        modal.offsetHeight,
        wrapper.scrollHeight + wrapper.offsetHeight - wrapper.clientHeight,
      ),
      minHeight: 3 * measureWheelItemHeight(modal, wheelItemHeight),
      layoutWidth: root.clientWidth,
      viewport: window.visualViewport ?? {
        width: root.clientWidth,
        height: root.clientHeight,
        offsetLeft: 0,
        offsetTop: 0,
      },
      tokens,
      request,
      rtl,
      pixelRatio: window.devicePixelRatio || 1,
    });
    const isConstrained = availableHeight !== null;

    style.top = `${top}px`;
    style.left = `${left}px`;
    style.width = `${width}px`;
    style.setProperty('--tp-popover-available-height', isConstrained ? `${availableHeight}px` : '');
    modal.classList.toggle('tp-ui-popover-constrained', isConstrained);
    modal.setAttribute(PLACEMENT_ATTRIBUTE, placement);
  };
}

export default class PopoverManager {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private stopTracking: (() => void) | null = null;
  private restoreInputAnchor: (() => void) | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  isPopoverMode(): boolean {
    return hasPopoverPlacement(this.core.options);
  }

  attach(): void {
    if (this.stopTracking || !this.isPopoverMode() || !isDocument()) return;

    const { core } = this;
    const modal = core.getModalElement();
    const input = core.getInput();
    if (!modal || !input) return;

    const request = core.options.wheel?.placement ?? 'auto';
    const rtl = getComputedStyle(input).direction === 'rtl';
    modal.classList.add('tp-ui-popover');
    modal.setAttribute('data-popover-request', request);

    this.restoreInputAnchor?.();
    this.restoreInputAnchor = supportsAnchoredPopover(input)
      ? showAnchoredPopover(modal, input, `--tp-ui-anchor-${core.instanceId.replace(/[^\w-]/g, '-')}`, rtl)
      : null;
    this.stopTracking = this.trackPopover(modal, input, request, rtl);
  }

  detach(): void {
    this.stopTracking?.();
    this.stopTracking = null;
  }

  destroy(): void {
    this.detach();
    this.restoreInputAnchor?.();
    this.restoreInputAnchor = null;
  }

  private trackPopover(
    modal: HTMLElement,
    input: HTMLElement,
    request: PopoverRequest,
    rtl: boolean,
  ): () => void {
    const { core, emitter } = this;
    const isAnchored = !!this.restoreInputAnchor;
    const cleanups: Array<() => void> = [];
    const listen = (
      target: EventTarget | null,
      type: string,
      handler: EventListener,
      capture?: boolean,
    ): void => {
      target?.addEventListener(type, handler, capture);
      cleanups.push(() => target?.removeEventListener(type, handler, capture));
    };
    const update = isAnchored
      ? (): void => resolveAnchoredPlacement(modal, input)
      : createFallbackPositioner(modal, input, core.getWrapper() ?? modal, request, rtl);
    let frame = 0;
    const schedule = (): void => {
      frame ||= requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    listen(
      document,
      'pointerdown',
      (event) => {
        const path = event.composedPath();
        if (!core.options.wheel?.ignoreOutsideClick && !path.includes(modal) && !path.includes(input)) {
          emitter.emit('cancel', {});
        }
      },
      true,
    );
    listen(window, 'resize', schedule);

    if (isAnchored) {
      schedule();
    } else {
      const { visualViewport } = window;
      update();
      listen(
        window,
        'scroll',
        (event) => {
          if (!(event.target instanceof Node && modal.contains(event.target))) schedule();
        },
        true,
      );
      listen(visualViewport, 'resize', schedule);
      listen(visualViewport, 'scroll', schedule);
      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(schedule);
        observer.observe(input);
        observer.observe(modal);
        cleanups.push(() => observer.disconnect());
      }
    }

    return (): void => {
      cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }
}
