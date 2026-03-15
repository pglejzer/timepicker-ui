import type { WheelRenderer } from './WheelRenderer';
import type { WheelColumnType } from './WheelTypes';
import { ColumnDragState } from './ColumnDragState';
import { isDocument } from '../../../utils/node';

const MOMENTUM_FRICTION = 0.92;
const MOMENTUM_MIN_VELOCITY = 0.3;
const MOMENTUM_MAX_VELOCITY = 8;
const WHEEL_ITEM_SNAP_THRESHOLD = 30;

type SnapCallback = (columnType: WheelColumnType) => void;
type VisualUpdateCallback = (columnType: WheelColumnType) => void;

export class WheelDragHandler {
  private readonly renderer: WheelRenderer;
  private readonly columnStates: Map<WheelColumnType, ColumnDragState> = new Map();
  private onSnap: SnapCallback | null = null;
  private onVisualUpdate: VisualUpdateCallback | null = null;
  private onScrollStart: ((columnType: WheelColumnType) => void) | null = null;

  private activeDragColumn: WheelColumnType | null = null;
  private visualUpdateRaf: number | null = null;
  private pendingVisualColumns: Set<WheelColumnType> = new Set();
  private wheelAccumulator: Map<WheelColumnType, number> = new Map();
  private readonly pointerMoveHandler: (e: PointerEvent) => void;
  private readonly pointerUpHandler: (e: PointerEvent) => void;
  private documentListenerController: AbortController | null = null;

  constructor(renderer: WheelRenderer) {
    this.renderer = renderer;
    this.pointerMoveHandler = (e: PointerEvent): void => this.handlePointerMove(e);
    this.pointerUpHandler = (e: PointerEvent): void => this.handlePointerUp(e);
  }

  setSnapCallback(callback: SnapCallback): void {
    this.onSnap = callback;
  }

  setVisualUpdateCallback(callback: VisualUpdateCallback): void {
    this.onVisualUpdate = callback;
  }

  setScrollStartCallback(callback: ((columnType: WheelColumnType) => void) | null): void {
    this.onScrollStart = callback;
  }

  init(): void {
    this.cleanupPreviousInit();

    if (!isDocument()) return;

    const columnTypes: readonly WheelColumnType[] = ['hours', 'minutes', 'ampm'];
    columnTypes.forEach((type) => {
      const col = this.renderer.getColumnElement(type);
      if (!col) return;

      const state = new ColumnDragState(col, type);
      this.columnStates.set(type, state);

      col.addEventListener(
        'pointerdown',
        (e: PointerEvent): void => {
          this.handlePointerDown(type, e);
        },
        { signal: state.signal },
      );

      col.addEventListener(
        'wheel',
        (e: WheelEvent): void => {
          this.handleWheel(type, e);
        },
        { passive: false, signal: state.signal },
      );
    });

    this.documentListenerController = new AbortController();
    document.addEventListener('pointermove', this.pointerMoveHandler, {
      signal: this.documentListenerController.signal,
    });
    document.addEventListener('pointerup', this.pointerUpHandler, {
      signal: this.documentListenerController.signal,
    });
  }

  getScrollOffset(columnType: WheelColumnType): number {
    const col = this.renderer.getColumnElement(columnType);
    return col ? col.scrollTop : 0;
  }

  setScrollOffset(columnType: WheelColumnType, offset: number): void {
    const state = this.columnStates.get(columnType);
    if (state) {
      state.stopMomentum();
    }

    const col = this.renderer.getColumnElement(columnType);
    if (col) {
      col.scrollTop = offset;
    }
  }

  getMaxOffset(columnType: WheelColumnType): number {
    const itemHeight = this.renderer.getItemHeight();
    if (itemHeight <= 0) return 0;

    const itemCount = this.renderer.getItemCount(columnType);
    return Math.max(0, (itemCount - 1) * itemHeight);
  }

  destroy(): void {
    this.cleanupPreviousInit();
    this.onSnap = null;
    this.onVisualUpdate = null;
    this.onScrollStart = null;
  }

  private cleanupPreviousInit(): void {
    if (this.visualUpdateRaf !== null) {
      cancelAnimationFrame(this.visualUpdateRaf);
      this.visualUpdateRaf = null;
    }
    this.pendingVisualColumns.clear();
    this.wheelAccumulator.clear();
    this.activeDragColumn = null;

    if (this.documentListenerController) {
      this.documentListenerController.abort();
      this.documentListenerController = null;
    }

    this.columnStates.forEach((state) => state.destroy());
    this.columnStates.clear();
  }

  private handlePointerDown(columnType: WheelColumnType, e: PointerEvent): void {
    const state = this.columnStates.get(columnType);
    if (!state) return;

    e.preventDefault();
    this.activeDragColumn = columnType;
    state.startDrag(e.clientY, e.pointerId);
    state.element.classList.add('is-dragging');
    state.element.setPointerCapture(e.pointerId);

    if (this.onScrollStart) {
      this.onScrollStart(columnType);
    }
  }

  private handlePointerMove(e: PointerEvent): void {
    if (this.activeDragColumn === null) return;

    const state = this.columnStates.get(this.activeDragColumn);
    if (!state || !state.isDragging || state.pointerId !== e.pointerId) return;

    const delta = state.lastY - e.clientY;
    state.addVelocitySample(e.clientY);

    const maxOffset = this.getMaxOffset(state.columnType);
    const newOffset = clamp(state.element.scrollTop + delta, 0, maxOffset);

    state.element.scrollTop = newOffset;
    state.updateLastY(e.clientY);

    this.scheduleVisualUpdate(state.columnType);
  }

  private handlePointerUp(e: PointerEvent): void {
    if (this.activeDragColumn === null) return;

    const state = this.columnStates.get(this.activeDragColumn);
    if (!state || !state.isDragging || state.pointerId !== e.pointerId) return;

    state.element.classList.remove('is-dragging');
    state.element.releasePointerCapture(e.pointerId);
    this.activeDragColumn = null;

    const velocity = state.computeReleaseVelocity();
    state.endDrag();

    if (Math.abs(velocity) > MOMENTUM_MIN_VELOCITY) {
      this.startMomentum(state, velocity);
    } else {
      this.snapColumn(state.columnType);
    }
  }

  private handleWheel(columnType: WheelColumnType, e: WheelEvent): void {
    e.preventDefault();

    const state = this.columnStates.get(columnType);
    if (!state) return;

    const wasScrolling = state.hasMomentum();
    state.stopMomentum();

    if (!wasScrolling && this.onScrollStart) {
      this.onScrollStart(columnType);
    }

    const itemHeight = this.renderer.getItemHeight();
    if (itemHeight <= 0) return;

    const accumulated = (this.wheelAccumulator.get(columnType) ?? 0) + e.deltaY;
    this.wheelAccumulator.set(columnType, accumulated);

    if (Math.abs(accumulated) >= WHEEL_ITEM_SNAP_THRESHOLD) {
      const direction = accumulated > 0 ? 1 : -1;
      this.wheelAccumulator.set(columnType, 0);

      const maxOffset = this.getMaxOffset(columnType);
      const currentIndex = Math.round(state.element.scrollTop / itemHeight);
      const nextIndex = currentIndex + direction;
      const targetOffset = clamp(nextIndex * itemHeight, 0, maxOffset);

      state.animateToOffset(targetOffset, (): void => {
        this.emitVisualUpdate(columnType);
        if (this.onSnap) {
          this.onSnap(columnType);
        }
      });

      this.scheduleVisualUpdate(columnType);
    }
  }

  private startMomentum(state: ColumnDragState, initialVelocity: number): void {
    let velocity = clamp(initialVelocity, -MOMENTUM_MAX_VELOCITY, MOMENTUM_MAX_VELOCITY);
    let lastTime = performance.now();
    const maxOffset = this.getMaxOffset(state.columnType);

    const step = (): void => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      velocity *= MOMENTUM_FRICTION;
      const displacement = velocity * dt;
      const currentTop = state.element.scrollTop;
      const newOffset = clamp(currentTop + displacement, 0, maxOffset);

      state.element.scrollTop = newOffset;
      this.emitVisualUpdate(state.columnType);

      if (Math.abs(velocity) < MOMENTUM_MIN_VELOCITY || newOffset <= 0 || newOffset >= maxOffset) {
        state.setMomentumRaf(null);
        this.snapColumn(state.columnType);
        return;
      }

      state.setMomentumRaf(requestAnimationFrame(step));
    };

    state.setMomentumRaf(requestAnimationFrame(step));
  }

  private snapColumn(columnType: WheelColumnType): void {
    const state = this.columnStates.get(columnType);
    if (!state) return;

    const itemHeight = this.renderer.getItemHeight();
    if (itemHeight <= 0) return;

    const maxOffset = this.getMaxOffset(columnType);
    const snappedIndex = Math.round(state.element.scrollTop / itemHeight);
    const snappedOffset = clamp(snappedIndex * itemHeight, 0, maxOffset);

    state.animateToOffset(snappedOffset, (): void => {
      this.emitVisualUpdate(columnType);
      if (this.onSnap) {
        this.onSnap(columnType);
      }
    });
  }

  private scheduleVisualUpdate(columnType: WheelColumnType): void {
    this.pendingVisualColumns.add(columnType);

    if (this.visualUpdateRaf !== null) return;

    this.visualUpdateRaf = requestAnimationFrame((): void => {
      this.visualUpdateRaf = null;
      this.pendingVisualColumns.forEach((col) => {
        this.emitVisualUpdate(col);
      });
      this.pendingVisualColumns.clear();
    });
  }

  private emitVisualUpdate(columnType: WheelColumnType): void {
    if (this.onVisualUpdate) {
      this.onVisualUpdate(columnType);
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

