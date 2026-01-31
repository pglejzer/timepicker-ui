interface PluginManager {
  init(): void;
  destroy(): void;
}

interface PluginDefinition {
  name: string;
  factory: (core: never, emitter: never) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
}

export declare class RangeManager implements PluginManager {
  init(): void;
  destroy(): void;
  getActivePart(): 'from' | 'to';
  getFromValue(): { hour: string; minutes: string; type?: string | null } | null;
  getToValue(): { hour: string; minutes: string; type?: string | null } | null;
  reset(): void;
}

export declare const RangePlugin: PluginDefinition;

