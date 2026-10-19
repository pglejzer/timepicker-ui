import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { ButtonHandlers } from './events/ButtonHandlers';
import { InputHandlers } from './events/InputHandlers';
import { KeyboardHandlers } from './events/KeyboardHandlers';
import { ModalHandlers } from './events/ModalHandlers';

export default class EventManager {
  private buttonHandlers: ButtonHandlers;
  private inputHandlers: InputHandlers;
  private keyboardHandlers: KeyboardHandlers;
  private modalHandlers: ModalHandlers;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.buttonHandlers = new ButtonHandlers(core, emitter);
    this.inputHandlers = new InputHandlers(core, emitter);
    this.keyboardHandlers = new KeyboardHandlers(core, emitter);
    this.modalHandlers = new ModalHandlers(core, emitter);
  }

  handleOpenOnClick(): void {
    this.buttonHandlers.handleOpenOnClick();
  }

  handleOpenOnEnterFocus(): void {
    this.keyboardHandlers.handleOpenOnEnterFocus();
  }

  handleCancelButton(): void {
    this.buttonHandlers.handleCancelButton();
  }

  handleOkButton(): void {
    this.buttonHandlers.handleOkButton();
  }

  syncOkButton(): void {
    this.buttonHandlers.syncOkButton();
  }

  handleBackdropClick(): void {
    this.modalHandlers.handleBackdropClick();
  }

  handlePointerModality(): void {
    this.modalHandlers.handlePointerModality();
  }

  handleEscClick(): void {
    this.keyboardHandlers.handleEscClick();
  }

  handleAmClick(): void {
    this.buttonHandlers.handleAmClick();
  }

  handlePmClick(): void {
    this.buttonHandlers.handlePmClick();
  }

  handleHourEvents(): void {
    this.inputHandlers.handleHourEvents();
  }

  handleMinutesEvents(): void {
    this.inputHandlers.handleMinutesEvents();
  }

  handleSecondsEvents(): void {
    this.inputHandlers.handleSecondsEvents();
  }

  handleKeyboardInput(): void {
    this.keyboardHandlers.handleKeyboardInput();
  }

  focusTrapHandler(): void {
    this.keyboardHandlers.focusTrapHandler();
  }

  handleSwitchViewButton(): void {
    this.buttonHandlers.handleSwitchViewButton();
  }

  detach(): void {
    this.buttonHandlers.detach();
    this.inputHandlers.detach();
    this.keyboardHandlers.detach();
    this.modalHandlers.detach();
  }

  destroy(): void {
    this.buttonHandlers.destroy();
    this.inputHandlers.destroy();
    this.keyboardHandlers.destroy();
    this.modalHandlers.destroy();
  }
}
