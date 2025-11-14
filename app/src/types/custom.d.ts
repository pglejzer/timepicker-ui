// Legacy DOM Event Types (DEPRECATED - will be removed in v4.0.0)
// Use EventEmitter API instead: picker.on('confirm', handler)

declare global {
  interface HTMLElementEventMap {
    /**
     * @deprecated Use EventEmitter API instead: `picker.on('open', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:open': CustomEvent<import('./types').CallbackData>;

    /**
     * @deprecated Use EventEmitter API instead: `picker.on('cancel', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:cancel': CustomEvent<import('./types').CallbackData>;

    /**
     * @deprecated Use EventEmitter API instead: `picker.on('confirm', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:confirm': CustomEvent<import('./types').CallbackData>;

    /**
     * @deprecated Use EventEmitter API instead: `picker.on('update', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:update': CustomEvent<import('./types').CallbackData>;

    /**
     * @deprecated Use EventEmitter API instead: `picker.on('select:hour', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:select-hour': CustomEvent<import('./types').CallbackData>;

    /**
     * @deprecated Use EventEmitter API instead: `picker.on('select:minute', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:select-minute': CustomEvent<import('./types').CallbackData>;

    /**
     * @deprecated Use EventEmitter API instead: `picker.on('select:am', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:select-am': CustomEvent<import('./types').CallbackData>;

    /**
     * @deprecated Use EventEmitter API instead: `picker.on('select:pm', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:select-pm': CustomEvent<import('./types').CallbackData>;

    /**
     * @deprecated Use EventEmitter API instead: `picker.on('error', handler)`
     * Legacy DOM event - will be removed in v4.0.0
     */
    'timepicker:error': CustomEvent<import('./types').CallbackData>;
  }
}

export {};
