import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { isDocument } from '../../../utils/node';

const TP_POPOVER_GAP_PX = 4;
const TP_POPOVER_MIN_WIDTH_PX = 260;
const TP_POPOVER_MAX_WIDTH_PX = 328;
const TP_POPOVER_EDGE_MARGIN_PX = 4;
const TP_POPOVER_VIEWPORT_THRESHOLD_PX = 16;

type PopoverPlacement = 'top' | 'bottom';

export default class PopoverManager {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private resizeHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private clickOutsideHandler: ((e: MouseEvent) => void) | null = null;
  private rafId: number | null = null;
  private isAttached: boolean = false;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  isPopoverMode(): boolean {
    return this.core.options.ui.mode === 'compact-wheel' && !!this.core.options.wheel?.placement;
  }

  attach(): void {
    if (!this.isPopoverMode()) return;
    if (!isDocument()) return;
    if (this.isAttached) return;

    const modal = this.core.getModalElement();
    if (!modal) return;

    modal.classList.add('tp-ui-popover');
    this.positionPopover();
    this.addListeners();
    this.isAttached = true;
  }

  detach(): void {
    if (!this.isAttached) return;
    this.removeListeners();
    this.isAttached = false;
  }

  destroy(): void {
    this.detach();
  }

  private positionPopover(): void {
    const input = this.core.getInput();
    const modal = this.core.getModalElement();
    if (!input || !modal) return;

    const inputRect = input.getBoundingClientRect();
    const placement = this.core.options.wheel?.placement ?? 'auto';

    const width = Math.min(Math.max(inputRect.width, TP_POPOVER_MIN_WIDTH_PX), TP_POPOVER_MAX_WIDTH_PX);
    modal.style.width = `${width}px`;

    const pickerHeight = modal.offsetHeight;

    const resolved = this.resolvePlacement(placement, inputRect, pickerHeight);
    const top = this.computeTop(resolved, inputRect, pickerHeight);
    const left = this.clampHorizontal(inputRect.left, width);

    modal.style.top = `${top}px`;
    modal.style.left = `${left}px`;
    modal.setAttribute('data-popover-placement', resolved);
  }

  private resolvePlacement(
    placement: 'auto' | 'top' | 'bottom',
    inputRect: DOMRect,
    pickerHeight: number,
  ): PopoverPlacement {
    if (placement === 'top') return 'top';
    if (placement === 'bottom') return 'bottom';

    const viewportHeight = document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;
    const requiredSpace = pickerHeight + TP_POPOVER_GAP_PX + TP_POPOVER_VIEWPORT_THRESHOLD_PX;

    if (spaceBelow >= requiredSpace) return 'bottom';
    if (spaceAbove >= requiredSpace) return 'top';
    return spaceBelow >= spaceAbove ? 'bottom' : 'top';
  }

  private computeTop(resolved: PopoverPlacement, inputRect: DOMRect, pickerHeight: number): number {
    if (resolved === 'top') {
      return inputRect.top - pickerHeight - TP_POPOVER_GAP_PX;
    }
    return inputRect.bottom + TP_POPOVER_GAP_PX;
  }

  private clampHorizontal(idealLeft: number, width: number): number {
    const viewportWidth = document.documentElement.clientWidth;
    let left = idealLeft;
    if (left + width > viewportWidth) {
      left = viewportWidth - width - TP_POPOVER_EDGE_MARGIN_PX;
    }
    if (left < TP_POPOVER_EDGE_MARGIN_PX) {
      left = TP_POPOVER_EDGE_MARGIN_PX;
    }
    return left;
  }

  private addListeners(): void {
    if (!isDocument()) return;

    this.resizeHandler = (): void => {
      this.scheduleReposition();
    };

    this.scrollHandler = (): void => {
      this.scheduleReposition();
    };

    this.clickOutsideHandler = (e: MouseEvent): void => {
      this.handleClickOutside(e);
    };

    window.addEventListener('resize', this.resizeHandler, { passive: true });
    window.addEventListener('scroll', this.scrollHandler, { passive: true, capture: true });

    const clickHandler = this.clickOutsideHandler;
    setTimeout((): void => {
      if (clickHandler === this.clickOutsideHandler) {
        document.addEventListener('pointerdown', clickHandler);
      }
    }, 0);
  }

  private removeListeners(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler, true as unknown as EventListenerOptions);
      this.scrollHandler = null;
    }

    if (this.clickOutsideHandler) {
      document.removeEventListener('pointerdown', this.clickOutsideHandler);
      this.clickOutsideHandler = null;
    }
  }

  private scheduleReposition(): void {
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame((): void => {
      this.rafId = null;
      this.positionPopover();
    });
  }

  private handleClickOutside(e: MouseEvent): void {
    if (this.core.options.wheel?.ignoreOutsideClick) return;

    const modal = this.core.getModalElement();
    const input = this.core.getInput();
    const target = e.target as Node | null;
    if (!modal || !target) return;

    const isInsideModal = modal.contains(target);
    const isInsideInput = input ? input.contains(target) : false;

    if (!isInsideModal && !isInsideInput) {
      this.emitter.emit('cancel', {});
    }
  }
}
