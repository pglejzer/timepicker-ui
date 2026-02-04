import type {
  SlotsConfig,
  ParsedSlot,
  TimePoint,
  SlotStatus,
  SlotStateEntry,
  DisabledTimeResult,
  OverlapResult,
} from './types';
import {
  parseSlot,
  isTimeInSlot,
  isTimeSlotStart,
  isTimeSlotEnd,
  rangeOverlapsSlot,
  hourToString,
  minuteToString,
  timeToMinutes,
} from './utils';

export class SlotsState {
  private readonly config: SlotsConfig;
  private readonly clockType: '12h' | '24h';
  private availableSlots: ParsedSlot[] = [];
  private bookedSlots: ParsedSlot[] = [];
  private hourStateCache: Map<number, SlotStateEntry> = new Map();
  private minuteStateCache: Map<string, SlotStateEntry> = new Map();

  constructor(config: SlotsConfig, clockType: '12h' | '24h') {
    this.config = config;
    this.clockType = clockType;
    this.parseSlots();
  }

  private parseSlots(): void {
    this.availableSlots = [];
    this.bookedSlots = [];

    if (this.config.available) {
      for (const slot of this.config.available) {
        const parsed = parseSlot(slot, 'available');
        if (parsed) {
          this.availableSlots.push(parsed);
        }
      }
    }

    if (this.config.booked) {
      for (const slot of this.config.booked) {
        const parsed = parseSlot(slot, 'booked');
        if (parsed) {
          this.bookedSlots.push(parsed);
        }
      }
    }

    this.invalidateCache();
  }

  private invalidateCache(): void {
    this.hourStateCache.clear();
    this.minuteStateCache.clear();
  }

  getAvailableSlots(): ReadonlyArray<ParsedSlot> {
    return this.availableSlots;
  }

  getBookedSlots(): ReadonlyArray<ParsedSlot> {
    return this.bookedSlots;
  }

  getAllSlots(): ReadonlyArray<ParsedSlot> {
    return [...this.bookedSlots, ...this.availableSlots];
  }

  getHourStatus(hour: number): SlotStateEntry {
    const cached = this.hourStateCache.get(hour);
    if (cached) return cached;

    const time: TimePoint = { hour, minute: 0 };
    const entry = this.computeStatusForTime(time, true);
    this.hourStateCache.set(hour, entry);
    return entry;
  }

  getMinuteStatus(hour: number, minute: number): SlotStateEntry {
    const key = `${hour}:${minute}`;
    const cached = this.minuteStateCache.get(key);
    if (cached) return cached;

    const time: TimePoint = { hour, minute };
    const entry = this.computeStatusForTime(time, false);
    this.minuteStateCache.set(key, entry);
    return entry;
  }

  private computeStatusForTime(time: TimePoint, isHourMode: boolean): SlotStateEntry {
    let status: SlotStatus = 'disabled';
    let label: string | undefined;
    let isStart = false;
    let isEnd = false;
    let inRange = false;

    for (const slot of this.bookedSlots) {
      if (isTimeInSlot(time, slot)) {
        status = 'booked';
        label = slot.label;
        inRange = true;
      }
      if (isTimeSlotStart(time, slot)) {
        isStart = true;
      }
      if (isTimeSlotEnd(time, slot)) {
        isEnd = true;
      }
    }

    if (status !== 'booked') {
      for (const slot of this.availableSlots) {
        if (isTimeInSlot(time, slot)) {
          status = 'available';
          inRange = true;
        }
        if (isTimeSlotStart(time, slot)) {
          isStart = true;
        }
        if (isTimeSlotEnd(time, slot)) {
          isEnd = true;
        }
      }
    }

    if (status === 'disabled' && !isHourMode) {
      status = 'none';
    }

    return { status, label, isStart, isEnd, inRange };
  }

  generateDisabledTime(currentHour: number | null): DisabledTimeResult {
    const disabledHours: Set<string> = new Set();
    const disabledMinutes: Set<string> = new Set();

    const maxHour = this.clockType === '24h' ? 24 : 12;

    for (let h = 0; h < maxHour; h++) {
      const hourToCheck = this.clockType === '12h' ? (h === 0 ? 12 : h) : h;
      const state = this.getHourStatus(hourToCheck);

      if (state.status === 'booked') {
        disabledHours.add(hourToString(hourToCheck));
      }
    }

    if (currentHour !== null) {
      for (let m = 0; m < 60; m++) {
        const state = this.getMinuteStatus(currentHour, m);

        if (state.status === 'booked') {
          disabledMinutes.add(minuteToString(m));
        }
      }
    }

    return {
      hours: Array.from(disabledHours),
      minutes: Array.from(disabledMinutes),
    };
  }

  checkRangeOverlap(from: TimePoint, to: TimePoint): OverlapResult {
    const overlappingSlots: ParsedSlot[] = [];

    for (const slot of this.bookedSlots) {
      if (rangeOverlapsSlot(from, to, slot)) {
        overlappingSlots.push(slot);
      }
    }

    if (overlappingSlots.length === 0) {
      return {
        hasOverlap: false,
        overlappingSlots: [],
        overlapType: 'none',
      };
    }

    const rangeStart = timeToMinutes(from);
    const rangeEnd = timeToMinutes(to);
    const rangeDuration = rangeEnd > rangeStart ? rangeEnd - rangeStart : 1440 - rangeStart + rangeEnd;

    let totalOverlapMinutes = 0;
    for (const slot of overlappingSlots) {
      const slotStart = timeToMinutes(slot.start);
      const slotEnd = timeToMinutes(slot.end);

      const overlapStart = Math.max(rangeStart, slotStart);
      const overlapEnd = Math.min(rangeEnd, slotEnd);

      if (overlapEnd > overlapStart) {
        totalOverlapMinutes += overlapEnd - overlapStart;
      }
    }

    const overlapType = totalOverlapMinutes >= rangeDuration ? 'full' : 'partial';

    return {
      hasOverlap: true,
      overlappingSlots,
      overlapType,
    };
  }

  getOverlapMode(): 'allow' | 'warn' | 'deny' {
    return this.config.overlap || 'warn';
  }

  getSlotDuration(): number | undefined {
    return this.config.slotDuration;
  }

  isEnabled(): boolean {
    return this.config.enabled === true;
  }

  updateConfig(newConfig: Partial<SlotsConfig>): void {
    Object.assign(this.config, newConfig);
    this.parseSlots();
  }
}

