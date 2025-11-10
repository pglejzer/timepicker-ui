import type { ITimepickerUI } from '../types/ITimepickerUI';
import ButtonHandlers from './eventmanager/ButtonHandlers';
import TypeModeHandlers from './eventmanager/TypeModeHandlers';
import InputHandlers from './eventmanager/InputHandlers';
import MiscHandlers from './eventmanager/MiscHandlers';
import InlineHandlers from './eventmanager/InlineHandlers';

export default class EventManager {
  private _cleanupHandlers: Array<() => void> = [];
  private buttonHandlers: ButtonHandlers;
  private typeModeHandlers: TypeModeHandlers;
  private inputHandlers: InputHandlers;
  private miscHandlers: MiscHandlers;
  private inlineHandlers: InlineHandlers;

  constructor(timepicker: ITimepickerUI) {
    this.buttonHandlers = new ButtonHandlers(timepicker, this._cleanupHandlers);
    this.typeModeHandlers = new TypeModeHandlers(timepicker, this._cleanupHandlers);
    this.inputHandlers = new InputHandlers(timepicker, this._cleanupHandlers);
    this.miscHandlers = new MiscHandlers(timepicker, this._cleanupHandlers);
    this.inlineHandlers = new InlineHandlers(timepicker, this._cleanupHandlers);
  }

  public destroy(): void {
    this._cleanupHandlers.forEach((cleanup) => cleanup());
    this._cleanupHandlers = [];
    this.inputHandlers.destroy();
  }

  handleOpenOnClick = () => this.miscHandlers.handleOpenOnClick();
  handleOpenOnEnterFocus = () => this.miscHandlers.handleOpenOnEnterFocus();
  handleCancelButton = () => this.buttonHandlers.handleCancelButton();
  handleOkButton = () => this.buttonHandlers.handleOkButton();
  handleBackdropClick = () => this.buttonHandlers.handleBackdropClick();
  handleAmClick = () => this.typeModeHandlers.handleAmClick();
  handlePmClick = () => this.typeModeHandlers.handlePmClick();
  handleHourEvents = () => this.inputHandlers.handleHourEvents();
  handleMinutesEvents = () => this.inputHandlers.handleMinutesEvents();
  handleClickOnHourMobile = () => this.miscHandlers.handleClickOnHourMobile();
  handlerClickHourMinutes = (event: Event) => this.miscHandlers.handlerClickHourMinutes(event);
  handleIconChangeView = () => this.miscHandlers.handleIconChangeView();
  handleEscClick = () => this.miscHandlers.handleEscClick();
  focusTrapHandler = () => this.miscHandlers.focusTrapHandler();
  handleInlineAutoUpdate = () => this.inlineHandlers.handleInlineAutoUpdate();
  handleMoveHand = () => {};
  handleEventToMoveHand = (event: TouchEvent) => {};

  get _isDragging(): boolean {
    return false;
  }

  get _animationFrameId(): number | null {
    return null;
  }

  public _onDragStart = (event: MouseEvent | TouchEvent) => {};
  public _onDragMove = (event: MouseEvent | TouchEvent) => {};
  public _onDragEnd = (event: MouseEvent | TouchEvent) => {};
}
