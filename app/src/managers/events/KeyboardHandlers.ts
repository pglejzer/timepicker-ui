import { isDocument } from '../../utils/node';
import { isActivationKey, setSpinbuttonValue, syncClockSlider } from '../../utils/accessibility';
import { requestOpen, runCleanups } from '../../utils/managerHelpers';
import { pad } from '../../utils/time/parse';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';
import {
  TIME_FIELD_NAMES,
  activateField,
  announceField,
  buildUpdatePayload,
  disabledCheckFor,
  emitSelect,
  fieldBounds,
  getActiveField,
  getTimeInput,
  type TimeField,
} from './timeFields';

interface SpinRange {
  min: number;
  last: number;
  step: number;
  pageSteps: number;
}

type SpinMove = readonly [
  direction: 1 | -1,
  wraps: boolean,
  target: (current: number, range: SpinRange) => number,
];

const STEP_UP: SpinMove = [1, true, (current, { step }) => Math.floor(current / step) * step + step];
const STEP_DOWN: SpinMove = [-1, true, (current, { step }) => Math.ceil(current / step) * step - step];

const SPIN_MOVES: Readonly<Record<string, SpinMove>> = {
  ArrowUp: STEP_UP,
  ArrowDown: STEP_DOWN,
  Home: [1, false, (_, { min }) => min],
  End: [-1, false, (_, { last }) => last],
  PageUp: [
    1,
    false,
    (current, { last, step, pageSteps }) =>
      Math.min(last, Math.floor(current / step) * step + step * pageSteps),
  ],
  PageDown: [
    -1,
    false,
    (current, { min, step, pageSteps }) => Math.max(min, Math.ceil(current / step) * step - step * pageSteps),
  ],
};

const DIAL_MOVES: Readonly<Record<string, SpinMove>> = {
  ...SPIN_MOVES,
  ArrowRight: STEP_UP,
  ArrowLeft: STEP_DOWN,
};

const findSpinValue = (
  [direction, wraps, target]: SpinMove,
  current: number,
  range: SpinRange,
  isDisabled: (value: number) => boolean,
): number | null => {
  const { min, last, step } = range;
  let value = target(current, range);

  for (let remaining = (last - min) / step; remaining >= 0; remaining--) {
    if (value < min || value > last) {
      if (!wraps) return null;
      value = value < min ? last : min;
    }
    if (!isDisabled(value)) return value;
    value += direction * step;
  }

  return null;
};

export class KeyboardHandlers {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];
  private persistentCleanups: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  handleOpenOnEnterFocus(): void {
    this.onKeydown(
      this.core.getInput(),
      (e) => {
        if (e.key === 'Enter' && !this.core.isOpen && this.core.isModalRemove) {
          requestOpen(this.emitter);
        }
      },
      this.persistentCleanups,
    );
  }

  handleEscClick(): void {
    if (isDocument() === false) {
      return;
    }

    this.onKeydown(document, (e) => {
      if (this.core.isOpen && e.key === 'Escape') {
        this.emitter.emit('cancel', {});
      }
    });
  }

  handleKeyboardInput(): void {
    TIME_FIELD_NAMES.forEach((field) =>
      this.onKeydown(getTimeInput(this.core, field), (e) =>
        this.stepField(field, SPIN_MOVES[e.key], e, true),
      ),
    );

    this.onKeydown(this.core.getClockFace(), (e) => {
      const field = getActiveField(this.core);
      if (isActivationKey(e.key)) {
        e.preventDefault();
        this.advanceFace(field);
      } else {
        this.stepField(field, DIAL_MOVES[e.key], e, false);
      }
    });

    syncClockSlider(this.core.getModalElement());
  }

  private advanceFace(field: TimeField): void {
    const next = TIME_FIELD_NAMES[TIME_FIELD_NAMES.indexOf(field) + 1];
    const autoSwitch = next === 'minutes' ? 'autoSwitchToMinutes' : 'autoSwitchToSeconds';
    if (!next || this.core.options.clock[autoSwitch] === false) return;
    getTimeInput(this.core, next)?.click();
    announceField(this.core, next);
  }

  private onKeydown(
    target: GlobalEventHandlers | null,
    handler: (e: KeyboardEvent) => void,
    cleanups: Array<() => void> = this.cleanupHandlers,
  ): void {
    if (!target) return;
    const listener = (e: KeyboardEvent): void => {
      if (!this.core.isDestroyed) handler(e);
    };

    target.addEventListener('keydown', listener);
    cleanups.push(() => target.removeEventListener('keydown', listener));
  }

  private spinRange(field: TimeField): SpinRange {
    const [min, max] = fieldBounds(this.core, field);
    const { incrementHours, incrementMinutes, incrementSeconds } = this.core.options.clock;
    const step = { hour: incrementHours, minutes: incrementMinutes, seconds: incrementSeconds }[field] || 1;
    return {
      min: Math.ceil(min / step) * step,
      last: Math.floor(max / step) * step,
      step,
      pageSteps: field === 'hour' ? 3 : 5,
    };
  }

  private stepField(field: TimeField, move: SpinMove | undefined, e: KeyboardEvent, announce: boolean): void {
    const input = getTimeInput(this.core, field);
    if (!move || !input) return;

    e.preventDefault();
    const next = findSpinValue(
      move,
      parseInt(input.value) || 0,
      this.spinRange(field),
      disabledCheckFor(this.core, field),
    );
    if (next === null) return;

    const value = pad(next);
    activateField(this.core, field);
    setSpinbuttonValue(input, value);
    if (announce) announceField(this.core, field);

    emitSelect(this.emitter, field, value);
    this.emitter.emit('update', buildUpdatePayload(this.core));
  }

  focusTrapHandler(): void {
    const wrapper = this.core.getWrapper();
    if (!wrapper) return;

    this.onKeydown(wrapper, (e) => {
      if (e.key !== 'Tab') return;

      const candidates = wrapper.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      const focusableElements: HTMLElement[] = [];
      candidates.forEach((el) => {
        if (el.getAttribute('aria-disabled') === 'true') return;
        if (el.hasAttribute('disabled')) return;
        if (el.hidden) return;
        if (el.getAttribute('aria-hidden') === 'true') return;
        if (el.offsetParent === null && el.getClientRects().length === 0) return;
        focusableElements.push(el);
      });

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    });
  }

  detach(): void {
    runCleanups(this.cleanupHandlers);
  }

  destroy(): void {
    this.detach();
    runCleanups(this.persistentCleanups);
  }
}
