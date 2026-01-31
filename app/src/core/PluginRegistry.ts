import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';

export interface PluginManager {
  init(): void;
  destroy(): void;
}

export type PluginFactory = (core: CoreState, emitter: EventEmitter<TimepickerEventMap>) => PluginManager;

export interface Plugin {
  name: string;
  factory: PluginFactory;
  optionsExtender?: (options: Record<string, unknown>) => void;
}

interface PluginInput {
  name: string;
  factory: (core: never, emitter: never) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
}

class PluginRegistryClass {
  private plugins: Map<string, Plugin> = new Map();

  register(plugin: Plugin | PluginInput): void {
    if (this.plugins.has(plugin.name)) {
      return;
    }
    this.plugins.set(plugin.name, plugin as Plugin);
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  has(name: string): boolean {
    return this.plugins.has(name);
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }
}

export const PluginRegistry = new PluginRegistryClass();
