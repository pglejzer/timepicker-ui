interface PluginManager {
  init(): void;
  destroy(): void;
}

interface PluginDefinition {
  name: string;
  factory: (core: any, emitter: any) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
}

export declare class TimezoneManager implements PluginManager {
  init(): void;
  destroy(): void;
  getSelectedTimezone(): string | null;
  setTimezone(timezoneId: string): void;
}

export declare const TimezonePlugin: PluginDefinition;

export interface TimezoneInfo {
  readonly id: string;
  readonly label: string;
  readonly offset: string;
}

export declare const DEFAULT_TIMEZONES: readonly string[];

export declare function getTimezoneList(whitelist?: readonly string[]): TimezoneInfo[];
