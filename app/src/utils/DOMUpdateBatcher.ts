export class DOMUpdateBatcher {
  private updates: Array<() => void> = [];
  private rafId: number | null = null;

  schedule(update: () => void): void {
    this.updates.push(update);
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }

  private flush(): void {
    this.updates.forEach((update) => update());
    this.updates = [];
    this.rafId = null;
  }

  destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.updates = [];
  }
}

