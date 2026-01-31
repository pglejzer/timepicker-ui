interface PluginManager {
  init(): void;
  destroy(): void;
}

interface PluginDefinition {
  name: string;
  factory: (core: never, emitter: never) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
}

export declare class TimezoneManager implements PluginManager {
  init(): void;
  destroy(): void;
  getSelectedTimezone(): string | null;
  setTimezone(timezoneId: string): void;
}

export declare const TimezonePlugin: PluginDefinition;

