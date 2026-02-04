export interface TimeSlot {
  start: string;
  end: string;
  label?: string;
}

export interface SlotsConfig {
  enabled: boolean;
  available?: TimeSlot[];
  booked?: TimeSlot[];
  overlap?: 'allow' | 'warn' | 'deny';
  slotDuration?: number;
}

export type SlotStatus = 'available' | 'booked' | 'disabled' | 'none';

export interface TimePoint {
  hour: number;
  minute: number;
}

export interface ParsedSlot {
  start: TimePoint;
  end: TimePoint;
  label?: string;
  status: 'available' | 'booked';
  crossesMidnight: boolean;
}

export interface SlotStateEntry {
  status: SlotStatus;
  label?: string;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
}

export interface DisabledTimeResult {
  hours: string[];
  minutes: string[];
}

export interface OverlapResult {
  hasOverlap: boolean;
  overlappingSlots: ParsedSlot[];
  overlapType: 'none' | 'partial' | 'full';
}

export interface SlotConflictEventData {
  overlap: OverlapResult;
  selectedRange: {
    from: TimePoint;
    to: TimePoint;
  };
  action: 'warn' | 'deny';
}

export interface SlotHoverEventData {
  slot: ParsedSlot;
  element: HTMLElement;
}

export interface SlotsDisabledTimeEventData {
  hours: string[];
  minutes: string[];
}

