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

  updateVisualFocus(options: HTMLElement[]): void {
    options.forEach((option, index) => {
      option.setAttribute('data-focused', String(index === this.focusedIndex));
    });

    if (this.focusedIndex >= 0 && options[this.focusedIndex]) {
      options[this.focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
}
