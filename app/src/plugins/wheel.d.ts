interface PluginManager {
  init(): void;
  destroy(): void;
}

interface PluginDefinition {
  name: string;
  factory: (core: any, emitter: any) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
}

export declare class WheelManager implements PluginManager {
  init(): void;
  destroy(): void;
  scrollToValue(hour: string, minute: string, type?: string, second?: string): void;
  getSelection(): { hour: string; minutes: string; seconds?: string; type?: string } | null;
  updateDisabledItems(): void;
}

export declare const WheelPlugin: PluginDefinition;
