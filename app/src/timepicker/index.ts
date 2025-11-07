import type { OptionTypes } from '../types/types';
import type { ITimepickerUI } from '../types/ITimepickerUI';
import TimepickerAPI from './TimepickerAPI';

const instanceRegistry = new Map<string, TimepickerUI>();

export default class TimepickerUI extends TimepickerAPI implements ITimepickerUI {
  constructor(selectorOrElement: string | HTMLElement, options?: OptionTypes) {
    super(selectorOrElement, options);

    if (this._isDestroyed) {
      return;
    }

    const customId = options?.id;
    if (customId && instanceRegistry.has(customId)) {
      console.error(`TimepickerUI: Instance with ID "${customId}" already exists`);
      this._isDestroyed = true;
      return;
    }

    instanceRegistry.set(this._instanceId, this);

    this.onDestroy = () => {
      instanceRegistry.delete(this._instanceId);
    };
  }

  static getById(id: string): TimepickerUI | undefined {
    return instanceRegistry.get(id);
  }

  static getAllInstances(): TimepickerUI[] {
    return Array.from(instanceRegistry.values());
  }

  static isAvailable(selectorOrElement: string | HTMLElement): boolean {
    if (typeof window === 'undefined') return false;

    if (typeof selectorOrElement === 'string') {
      return document.querySelector(selectorOrElement) !== null;
    } else if (selectorOrElement instanceof HTMLElement) {
      return document.contains(selectorOrElement);
    }
    return false;
  }

  static destroyAll(): void {
    const instances = Array.from(instanceRegistry.values());
    instances.forEach((instance) => instance.destroy());
    instanceRegistry.clear();
  }
}

