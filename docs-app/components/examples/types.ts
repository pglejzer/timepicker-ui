export interface TimepickerEventData {
  hour?: string | null;
  minutes?: string | null;
  type?: string | null;
  degreesHours?: number | null;
  degreesMinutes?: number | null;
  hourNotAccepted?: string | null;
  minutesNotAccepted?: string | null;
  eventType?: unknown;
  error?: string;
  currentHour?: string | number;
  currentMin?: string | number;
  currentType?: string;
  currentLength?: string | number;
}

export type TimepickerCallback = (data: TimepickerEventData) => void;
