import { prefersReducedMotion } from '../../../utils/accessibility';
import { TIMINGS } from '../../../constants/timings';

const findLabel = (labels: ReadonlyArray<string>, search: string, start: number): number => {
  for (let offset = 0; offset < labels.length; offset++) {
    const index = (start + offset) % labels.length;
    if (labels[index].toLowerCase().startsWith(search)) return index;
  }
  return -1;
};

export class TimezoneKeyboard {
  private focusedIndex: number = -1;
  private buffer = '';
  private bufferTimer: ReturnType<typeof setTimeout> | null = null;

  getFocusedIndex(): number {
    return this.focusedIndex;
  }

  setFocusedIndex(index: number): number {
    this.focusedIndex = index;
    return this.focusedIndex;
  }

  isTyping(): boolean {
    return this.buffer !== '';
  }

  matchTypedCharacter(character: string, labels: ReadonlyArray<string>): number {
    this.buffer += character.toLowerCase();
    this.restartBufferTimer();

    const isRepeated = [...this.buffer].every((char) => char === this.buffer[0]);
    const search = isRepeated ? this.buffer[0] : this.buffer;
    const start = isRepeated ? this.focusedIndex + 1 : Math.max(this.focusedIndex, 0);
    const match = findLabel(labels, search, start);

    if (match >= 0) {
      this.focusedIndex = match;
    }
    return match;
  }

  moveDown(optionsCount: number): number {
    this.focusedIndex = Math.min(this.focusedIndex + 1, optionsCount - 1);
    return this.focusedIndex;
  }

  moveUp(): number {
    this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
    return this.focusedIndex;
  }

  moveToFirst(): number {
    this.focusedIndex = 0;
    return this.focusedIndex;
  }

  moveToLast(optionsCount: number): number {
    this.focusedIndex = optionsCount - 1;
    return this.focusedIndex;
  }

  reset(): void {
    this.focusedIndex = -1;
    this.clearBuffer();
  }

  updateVisualFocus(options: HTMLElement[], combobox?: HTMLElement | null): void {
    options.forEach((option, index) => {
      option.setAttribute('data-focused', String(index === this.focusedIndex));
    });

    const focused = this.focusedIndex >= 0 ? options[this.focusedIndex] : null;

    if (combobox) {
      if (focused?.id) {
        combobox.setAttribute('aria-activedescendant', focused.id);
      } else {
        combobox.removeAttribute('aria-activedescendant');
      }
    }

    if (focused) {
      focused.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  }

  private restartBufferTimer(): void {
    if (this.bufferTimer !== null) clearTimeout(this.bufferTimer);
    this.bufferTimer = setTimeout(() => {
      this.bufferTimer = null;
      this.buffer = '';
    }, TIMINGS.TYPEAHEAD_RESET);
  }

  private clearBuffer(): void {
    if (this.bufferTimer !== null) clearTimeout(this.bufferTimer);
    this.bufferTimer = null;
    this.buffer = '';
  }
}
