import { prefersReducedMotion } from '../../../utils/accessibility';

export class TimezoneKeyboard {
  private focusedIndex: number = -1;

  getFocusedIndex(): number {
    return this.focusedIndex;
  }

  setFocusedIndex(index: number): void {
    this.focusedIndex = index;
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
  }

  updateVisualFocus(options: HTMLElement[], dropdown?: HTMLElement | null): void {
    options.forEach((option, index) => {
      option.setAttribute('data-focused', String(index === this.focusedIndex));
    });

    const focused = this.focusedIndex >= 0 ? options[this.focusedIndex] : null;

    if (dropdown) {
      if (focused?.id) {
        dropdown.setAttribute('aria-activedescendant', focused.id);
      } else {
        dropdown.removeAttribute('aria-activedescendant');
      }
    }

    if (focused) {
      focused.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  }
}
