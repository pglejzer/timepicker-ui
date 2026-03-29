import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import type { TimepickerOptions } from '../types/options';

export interface PluginManager {
  init(): void;
  destroy(): void;
}

export type PluginFactory = (core: CoreState, emitter: EventEmitter<TimepickerEventMap>) => PluginManager;

export type TemplateProvider = (options: Required<TimepickerOptions>, instanceId: string) => string;

export type ClearHandler = (core: CoreState, emitter: EventEmitter<TimepickerEventMap>) => void;

export interface Plugin {
  name: string;
  factory: PluginFactory;
  optionsExtender?: (options: Record<string, unknown>) => void;
  templateProvider?: TemplateProvider;
  clearHandler?: ClearHandler;
}

class PluginRegistryClass {
  private plugins: Map<string, Plugin> = new Map();

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      return;
    }
    this.plugins.set(plugin.name, plugin);
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

  getTemplateProvider(name: string): TemplateProvider | undefined {
    return this.plugins.get(name)?.templateProvider;
  }

  getClearHandler(name: string): ClearHandler | undefined {
    return this.plugins.get(name)?.clearHandler;
  }
}

export const PluginRegistry = new PluginRegistryClass();
