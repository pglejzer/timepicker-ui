export const clampValue = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const clampHourValue = (value: string, is12h: boolean): string => {
  if (value === '') return '';

  const numValue = parseInt(value, 10);
  if (Number.isNaN(numValue)) return '';

  const min = is12h ? 1 : 0;
  const max = is12h ? 12 : 23;

  const clamped = clampValue(numValue, min, max);
  return clamped.toString().padStart(2, '0');
};

export const clampMinuteValue = (value: string): string => {
  if (value === '') return '';

  const numValue = parseInt(value, 10);
  if (Number.isNaN(numValue)) return '';

  const clamped = clampValue(numValue, 0, 59);
  return clamped.toString().padStart(2, '0');
};

