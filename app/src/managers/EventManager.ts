import type { ITimepickerUI } from '../types/ITimepickerUI';
import ButtonHandlers from './eventmanager/ButtonHandlers';
import DragHandlers from './eventmanager/DragHandlers';
import TypeModeHandlers from './eventmanager/TypeModeHandlers';
import InputHandlers from './eventmanager/InputHandlers';
import ClockHandPositionUpdater from './eventmanager/ClockHandPositionUpdater';
import MiscHandlers from './eventmanager/MiscHandlers';
import InlineHandlers from './eventmanager/InlineHandlers';

export default class EventManager {
  private _cleanupHandlers: Array<() => void> = [];
  private buttonHandlers: ButtonHandlers;
  private dragHandlers: DragHandlers;
  private typeModeHandlers: TypeModeHandlers;
  private inputHandlers: InputHandlers;
  private clockHandPositionUpdater: ClockHandPositionUpdater;
  private miscHandlers: MiscHandlers;
  private inlineHandlers: InlineHandlers;

  constructor(timepicker: ITimepickerUI) {
    this.clockHandPositionUpdater = new ClockHandPositionUpdater(timepicker);
    this.dragHandlers = new DragHandlers(timepicker, this.clockHandPositionUpdater.updateHandPosition);
    this.buttonHandlers = new ButtonHandlers(timepicker, this._cleanupHandlers);
    this.typeModeHandlers = new TypeModeHandlers(timepicker, this._cleanupHandlers);
    this.inputHandlers = new InputHandlers(timepicker, this._cleanupHandlers);
    this.miscHandlers = new MiscHandlers(timepicker, this._cleanupHandlers);
    this.inlineHandlers = new InlineHandlers(timepicker, this._cleanupHandlers);
  }

  public destroy(): void {
    this._cleanupHandlers.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error('EventManager cleanup error:', error);
      }
    });

    this._cleanupHandlers = [];
    this.dragHandlers.cleanup();
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
  handleEventToMoveHand = (event: TouchEvent) => this.dragHandlers.handleEventToMoveHand(event);
  handleMoveHand = () => this.dragHandlers.handleMoveHand();
  handleClickOnHourMobile = () => this.miscHandlers.handleClickOnHourMobile();
  handlerClickHourMinutes = (event: Event) => this.miscHandlers.handlerClickHourMinutes(event);
  handleIconChangeView = () => this.miscHandlers.handleIconChangeView();
  handleEscClick = () => this.miscHandlers.handleEscClick();
  focusTrapHandler = () => this.miscHandlers.focusTrapHandler();
  handleInlineAutoUpdate = () => this.inlineHandlers.handleInlineAutoUpdate();

  get _isDragging(): boolean {
    return this.dragHandlers.isDragging;
  }

  get _animationFrameId(): number | null {
    return this.dragHandlers.animationFrameId;
  }

  public _onDragStart = (event: MouseEvent | TouchEvent) => this.dragHandlers._onDragStart(event);
  public _onDragMove = (event: MouseEvent | TouchEvent) => this.dragHandlers._onDragMove(event);
  public _onDragEnd = (event: MouseEvent | TouchEvent) => this.dragHandlers._onDragEnd(event);
}

