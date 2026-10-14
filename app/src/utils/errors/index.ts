export class TimepickerError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(`[TimepickerUI] ${message}`);
    this.name = 'TimepickerError';
    Object.setPrototypeOf(this, TimepickerError.prototype);
  }
}

export const ERROR_CODES = {
  INVALID_PARAMETER: 'INVALID_PARAMETER',
} as const;
