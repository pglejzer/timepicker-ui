import type { TimeSlot, TimePoint, ParsedSlot } from './types';

const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

export function parseTime(timeStr: string): TimePoint | null {
  const match = TIME_REGEX.exec(timeStr);
  if (!match) return null;

  return {
    hour: parseInt(match[1], 10),
    minute: parseInt(match[2], 10),
  };
}

export function formatTime(point: TimePoint): string {
  const h = point.hour.toString().padStart(2, '0');
  const m = point.minute.toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function timeToMinutes(point: TimePoint): number {
  return point.hour * 60 + point.minute;
}

export function minutesToTime(minutes: number): TimePoint {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  return {
    hour: Math.floor(normalized / 60),
    minute: normalized % 60,
  };
}

export function parseSlot(slot: TimeSlot, status: 'available' | 'booked'): ParsedSlot | null {
  const start = parseTime(slot.start);
  const end = parseTime(slot.end);

  if (!start || !end) return null;

  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  const crossesMidnight = endMinutes <= startMinutes;

  return {
    start,
    end,
    label: slot.label,
    status,
    crossesMidnight,
  };
}

export function isTimeInSlot(time: TimePoint, slot: ParsedSlot): boolean {
  const t = timeToMinutes(time);
  const s = timeToMinutes(slot.start);
  const e = timeToMinutes(slot.end);

  if (slot.crossesMidnight) {
    return t >= s || t < e;
  }
  return t >= s && t < e;
}

export function isTimeSlotStart(time: TimePoint, slot: ParsedSlot): boolean {
  return time.hour === slot.start.hour && time.minute === slot.start.minute;
}

export function isTimeSlotEnd(time: TimePoint, slot: ParsedSlot): boolean {
  return time.hour === slot.end.hour && time.minute === slot.end.minute;
}

export function doSlotsOverlap(slotA: ParsedSlot, slotB: ParsedSlot): boolean {
  const aStart = timeToMinutes(slotA.start);
  const aEnd = timeToMinutes(slotA.end);
  const bStart = timeToMinutes(slotB.start);
  const bEnd = timeToMinutes(slotB.end);

  if (slotA.crossesMidnight || slotB.crossesMidnight) {
    return true;
  }

  return aStart < bEnd && bStart < aEnd;
}

export function rangeOverlapsSlot(rangeStart: TimePoint, rangeEnd: TimePoint, slot: ParsedSlot): boolean {
  const rStart = timeToMinutes(rangeStart);
  const rEnd = timeToMinutes(rangeEnd);
  const sStart = timeToMinutes(slot.start);
  const sEnd = timeToMinutes(slot.end);

  const rangeCrossesMidnight = rEnd <= rStart;

  if (rangeCrossesMidnight || slot.crossesMidnight) {
    return true;
  }

  return rStart < sEnd && sStart < rEnd;
}

export function getMinutesInRange(start: TimePoint, end: TimePoint): TimePoint[] {
  const points: TimePoint[] = [];
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  const crossesMidnight = endMinutes <= startMinutes;

  if (crossesMidnight) {
    for (let m = startMinutes; m < 1440; m++) {
      points.push(minutesToTime(m));
    }
    for (let m = 0; m < endMinutes; m++) {
      points.push(minutesToTime(m));
    }
  } else {
    for (let m = startMinutes; m < endMinutes; m++) {
      points.push(minutesToTime(m));
    }
  }

  return points;
}

export function hourToString(hour: number): string {
  return hour.toString().padStart(2, '0');
}

export function minuteToString(minute: number): string {
  return minute.toString().padStart(2, '0');
}

export function getHoursInSlot(slot: ParsedSlot): number[] {
  const hours: Set<number> = new Set();
  const startMinutes = timeToMinutes(slot.start);
  const endMinutes = timeToMinutes(slot.end);

  if (slot.crossesMidnight) {
    for (let m = startMinutes; m < 1440; m += 60) {
      hours.add(Math.floor(m / 60));
    }
    for (let m = 0; m < endMinutes; m += 60) {
      hours.add(Math.floor(m / 60));
    }
  } else {
    for (let m = startMinutes; m < endMinutes; m += 60) {
      hours.add(Math.floor(m / 60));
    }
    hours.add(slot.end.hour);
  }

  return Array.from(hours);
}

export function compareTimePoints(a: TimePoint, b: TimePoint): number {
  const aMinutes = timeToMinutes(a);
  const bMinutes = timeToMinutes(b);
  return aMinutes - bMinutes;
}

