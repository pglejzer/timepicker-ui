import type { CoreState } from './CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import AnimationManager from '../managers/AnimationManager';
import ModalManager from '../managers/ModalManager';
import ConfigManager from '../managers/ConfigManager';
import ThemeManager from '../managers/ThemeManager';
import ValidationManager from '../managers/ValidationManager';
import EventManager from '../managers/EventManager';
import ClockManager from '../managers/ClockManager';

export class Managers {
  public readonly animation: AnimationManager;
  public readonly modal: ModalManager;
  public readonly config: ConfigManager;
  public readonly theme: ThemeManager;
  public readonly validation: ValidationManager;
  public readonly events: EventManager;
  public readonly clock: ClockManager;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.animation = new AnimationManager(core, emitter);
    this.modal = new ModalManager(core, emitter);
    this.config = new ConfigManager(core, emitter);
    this.theme = new ThemeManager(core, emitter);
    this.validation = new ValidationManager(core, emitter);
    this.events = new EventManager(core, emitter);
    this.clock = new ClockManager(core, emitter);
  }

  destroy(): void {
    this.animation.destroy();
    this.modal.destroy();
    this.config.destroy();
    this.theme.destroy();
    this.validation.destroy();
    this.events.destroy();
    this.clock.destroy();
  }
}

