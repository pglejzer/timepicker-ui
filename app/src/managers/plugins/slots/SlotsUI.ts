import type { CoreState } from '../../../timepicker/CoreState';
import type { SlotsState } from './SlotsState';
import type { ParsedSlot } from './types';
import { timeToMinutes } from './utils';
import { isDocument } from '../../../utils/node';

const SLOT_OVERLAY_CLASS = 'tp-ui-slots-overlay';
const SLOT_SVG_CLASS = 'tp-ui-slots-svg';

export class SlotsUI {
  private readonly core: CoreState;
  private readonly state: SlotsState;
  private overlayContainer: HTMLElement | null = null;
  private svgElement: SVGSVGElement | null = null;
  private currentMode: 'hours' | 'minutes' = 'hours';
  private currentHour: number = 0;

  private static readonly SVG_SIZE = 256;
  private static readonly CENTER = 128;
  private static readonly OUTER_RADIUS = 118;
  private static readonly ARC_WIDTH = 14;

  constructor(core: CoreState, state: SlotsState) {
    this.core = core;
    this.state = state;
  }

  init(): void {
    if (!isDocument()) return;

    console.log('[SlotsUI] init called');
    this.createOverlayContainer();
    this.renderHourOverlay();
  }

  private createOverlayContainer(): void {
    const clockFace = this.core.getClockFace();
    console.log('[SlotsUI] createOverlayContainer: clockFace =', clockFace);
    if (!clockFace) return;

    const existing = clockFace.querySelector(`.${SLOT_OVERLAY_CLASS}`);
    if (existing) {
      existing.remove();
    }

    const container = document.createElement('div');
    container.className = SLOT_OVERLAY_CLASS;
    container.setAttribute('aria-hidden', 'true');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', SLOT_SVG_CLASS);
    svg.setAttribute('viewBox', `0 0 ${SlotsUI.SVG_SIZE} ${SlotsUI.SVG_SIZE}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    container.appendChild(svg);
    clockFace.appendChild(container);

    this.overlayContainer = container;
    this.svgElement = svg;
  }

  renderHourOverlay(): void {
    if (!this.svgElement) {
      console.warn('[SlotsUI] renderHourOverlay: no svgElement');
      return;
    }

    this.currentMode = 'hours';
    this.clearArcs();

    const slots = this.state.getAllSlots();
    console.log('[SlotsUI] renderHourOverlay: rendering', slots.length, 'slots');

    for (const slot of slots) {
      this.renderSlotArc(slot, 'hours');
    }
  }

  updateMinuteOverlay(): void {
    if (!this.svgElement) {
      console.warn('[SlotsUI] updateMinuteOverlay: no svgElement');
      return;
    }

    this.currentMode = 'minutes';
    this.clearArcs();

    this.currentHour = this.getCurrentHour24();
    console.log('[SlotsUI] updateMinuteOverlay: currentHour =', this.currentHour);

    const slots = this.state.getAllSlots();

    for (const slot of slots) {
      this.renderSlotArc(slot, 'minutes');
    }
  }

  /**
   * Get the current hour in 24h format, accounting for AM/PM mode
   */
  private getCurrentHour24(): number {
    const hourInput = this.core.getHour();
    if (!hourInput) return 0;

    let hour = parseInt(hourInput.value, 10) || 0;
    const clockType = this.core.options.clock.type as '12h' | '24h';

    if (clockType === '12h') {
      const activeTypeMode = this.core.getActiveTypeMode();
      const isPM = activeTypeMode?.textContent?.toUpperCase() === 'PM';

      if (isPM && hour < 12) {
        hour += 12;
      } else if (!isPM && hour === 12) {
        hour = 0;
      }
    }

    return hour;
  }

  private clearArcs(): void {
    if (this.svgElement) {
      this.svgElement.innerHTML = '';
    }
  }

  private renderSlotArc(slot: ParsedSlot, mode: 'hours' | 'minutes'): void {
    if (!this.svgElement) return;

    const { startAngle, endAngle, arcLength } = this.calculateArcAngles(slot, mode);
    console.log(
      `[SlotsUI] renderSlotArc (${mode}):`,
      slot.status,
      'start:',
      startAngle,
      'end:',
      endAngle,
      'len:',
      arcLength,
    );

    if (arcLength < 1) return;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `tp-ui-slot-arc tp-ui-slot-arc--${slot.status}`);
    group.setAttribute('data-status', slot.status);
    if (slot.label) {
      group.setAttribute('data-label', slot.label);
    }

    const arcPath = this.createArcPath(startAngle, endAngle, SlotsUI.OUTER_RADIUS, SlotsUI.ARC_WIDTH);
    const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fillPath.setAttribute('d', arcPath);
    fillPath.setAttribute('class', 'tp-ui-slot-arc__fill');
    group.appendChild(fillPath);

    const capRadius = SlotsUI.OUTER_RADIUS - SlotsUI.ARC_WIDTH / 2;
    const startCap = this.createCapCircle(startAngle, capRadius);
    startCap.setAttribute('class', 'tp-ui-slot-arc__cap tp-ui-slot-arc__cap--start');
    group.appendChild(startCap);

    const endCap = this.createCapCircle(endAngle, capRadius);
    endCap.setAttribute('class', 'tp-ui-slot-arc__cap tp-ui-slot-arc__cap--end');
    group.appendChild(endCap);

    this.svgElement.appendChild(group);
  }

  private calculateArcAngles(
    slot: ParsedSlot,
    mode: 'hours' | 'minutes',
  ): { startAngle: number; endAngle: number; arcLength: number } {
    let startAngle: number;
    let endAngle: number;

    if (mode === 'hours') {
      startAngle = this.timeToAngle(slot.start.hour, slot.start.minute);
      endAngle = this.timeToAngle(slot.end.hour, slot.end.minute);
    } else {
      const minuteRange = this.getMinuteRangeForSlot(slot, this.currentHour);
      if (!minuteRange) {
        return { startAngle: 0, endAngle: 0, arcLength: 0 };
      }
      startAngle = this.minuteToAngle(minuteRange.startMinute);

      endAngle = this.minuteToAngle(minuteRange.endMinute === 60 ? 0 : minuteRange.endMinute);

      if (minuteRange.startMinute === 0 && minuteRange.endMinute === 60) {
        return { startAngle: -90, endAngle: 270, arcLength: 360 };
      }
    }

    let arcLength = endAngle - startAngle;
    if (arcLength <= 0) {
      arcLength += 360;
    }

    return { startAngle, endAngle, arcLength };
  }

  /**
   * Convert time (hour + minute) to angle on clock face.
   * This gives smooth arc positioning that accounts for minutes.
   */
  private timeToAngle(hour: number, minute: number): number {
    const normalizedHour = hour % 12;

    const hourAngle = (normalizedHour / 12) * 360;
    const minuteOffset = (minute / 60) * 30; // 30 degrees per hour
    return hourAngle + minuteOffset - 90; // -90 to put 12:00 at top
  }

  private hourToAngle(hour: number): number {
    const normalizedHour = hour % 12;

    return (normalizedHour / 12) * 360 - 90;
  }

  private minuteToAngle(minute: number): number {
    return (minute / 60) * 360 - 90;
  }

  /**
   * Check if a slot is relevant for displaying minute arcs for a given hour.
   * A slot is relevant if the selected hour falls within the slot's time range.
   */
  private isSlotRelevantForHour(slot: ParsedSlot, hour: number): boolean {
    const slotStartTotal = timeToMinutes(slot.start);
    const slotEndTotal = timeToMinutes(slot.end);
    const hourStartTotal = hour * 60;
    const hourEndTotal = hour * 60 + 59;

    if (slot.crossesMidnight) {
      return hourStartTotal >= slotStartTotal || hourEndTotal < slotEndTotal;
    }

    return hourStartTotal < slotEndTotal && hourEndTotal >= slotStartTotal;
  }

  /**
   * Calculate the minute range to display for a given slot and hour.
   * Returns start and end minutes that should be highlighted.
   */
  private getMinuteRangeForSlot(
    slot: ParsedSlot,
    hour: number,
  ): { startMinute: number; endMinute: number } | null {
    if (!this.isSlotRelevantForHour(slot, hour)) {
      return null;
    }

    const startHour = slot.start.hour;
    const endHour = slot.end.hour;
    const slotStartMinute = slot.start.minute;
    const slotEndMinute = slot.end.minute;

    let startMinute = 0;
    let endMinute = 60; // 60 means end of hour (exclusive)

    if (hour === startHour) {
      startMinute = slotStartMinute;
    }

    if (hour === endHour) {
      endMinute = slotEndMinute;
    }

    if (hour === endHour && slotEndMinute === 0) {
      return null;
    }

    return { startMinute, endMinute };
  }

  private createArcPath(startAngle: number, endAngle: number, outerRadius: number, width: number): string {
    const innerRadius = outerRadius - width;
    const cx = SlotsUI.CENTER;
    const cy = SlotsUI.CENTER;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    let actualEndRad = endRad;
    if (endAngle <= startAngle) {
      actualEndRad = endRad + 2 * Math.PI;
    }

    const outerStartX = cx + outerRadius * Math.cos(startRad);
    const outerStartY = cy + outerRadius * Math.sin(startRad);
    const outerEndX = cx + outerRadius * Math.cos(actualEndRad);
    const outerEndY = cy + outerRadius * Math.sin(actualEndRad);

    const innerStartX = cx + innerRadius * Math.cos(actualEndRad);
    const innerStartY = cy + innerRadius * Math.sin(actualEndRad);
    const innerEndX = cx + innerRadius * Math.cos(startRad);
    const innerEndY = cy + innerRadius * Math.sin(startRad);

    const arcSpan = actualEndRad - startRad;
    const largeArcFlag = arcSpan > Math.PI ? 1 : 0;

    return [
      `M ${outerStartX} ${outerStartY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerStartX} ${innerStartY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY}`,
      'Z',
    ].join(' ');
  }

  private createCapCircle(angle: number, radius: number): SVGCircleElement {
    const rad = (angle * Math.PI) / 180;
    const cx = SlotsUI.CENTER + radius * Math.cos(rad);
    const cy = SlotsUI.CENTER + radius * Math.sin(rad);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(cx));
    circle.setAttribute('cy', String(cy));
    circle.setAttribute('r', '5');

    return circle;
  }

  hasOverlay(): boolean {
    return this.overlayContainer !== null && this.svgElement !== null;
  }

  refresh(): void {
    if (this.currentMode === 'hours') {
      this.renderHourOverlay();
    } else {
      this.updateMinuteOverlay();
    }
  }

  destroy(): void {
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer);
    }
    this.overlayContainer = null;
    this.svgElement = null;
  }
}

