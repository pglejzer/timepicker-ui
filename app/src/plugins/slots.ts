import { SlotsManager } from '../managers/plugins/slots';
import type { Plugin } from '../core/PluginRegistry';

export const SlotsPlugin: Plugin = {
  name: 'slots',
  factory: (core, emitter) => new SlotsManager(core, emitter),
};

export { SlotsManager };
export type {
  SlotsConfig,
  TimeSlot,
  SlotStatus,
  ParsedSlot,
  SlotConflictEventData,
  SlotHoverEventData,
} from '../managers/plugins/slots/types';

