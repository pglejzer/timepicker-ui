interface PluginManager {
  init(): void;
  destroy(): void;
}

interface PluginDefinition {
  name: string;
  factory: (core: unknown, emitter: unknown) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
}

interface RangeEndValue {
  hour: string;
  minutes: string;
  seconds?: string;
  type?: string;
}

export declare class RangeManager implements PluginManager {
  init(): void;
  destroy(): void;
  getActivePart(): 'from' | 'to';
  setActivePart(part: 'from' | 'to', options?: { focus?: boolean }): boolean;
  setRange(from: string, to: string, updateInput: boolean): boolean;
  getRange(): { from: RangeEndValue | null; to: RangeEndValue | null };
  getFromValue(): RangeEndValue | null;
  getToValue(): RangeEndValue | null;
  reset(): void;
}

export declare const RangePlugin: PluginDefinition;
