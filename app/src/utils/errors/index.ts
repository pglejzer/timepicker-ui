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
  ELEMENT_NOT_FOUND: 'ELEMENT_NOT_FOUND',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  NO_INPUT_ELEMENT: 'NO_INPUT_ELEMENT',
  INSTANCE_DESTROYED: 'INSTANCE_DESTROYED',
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  INVALID_TIME_FORMAT: 'INVALID_TIME_FORMAT',
  INLINE_CONFIG_ERROR: 'INLINE_CONFIG_ERROR',
  CONTAINER_NOT_FOUND: 'CONTAINER_NOT_FOUND',
  SSR_ENVIRONMENT: 'SSR_ENVIRONMENT',
} as const;

