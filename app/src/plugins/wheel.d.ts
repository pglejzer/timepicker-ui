interface PluginManager {
  init(): void;
  destroy(): void;
}

interface PluginDefinition {
  name: string;
  factory: (core: never, emitter: never) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
}

export declare class WheelManager implements PluginManager {
  init(): void;
  destroy(): void;
  scrollToValue(hour: string, minute: string, type?: string): void;
  updateDisabledItems(): void;
}

export declare const WheelPlugin: PluginDefinition;

