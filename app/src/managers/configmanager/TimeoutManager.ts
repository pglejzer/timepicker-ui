export class TimeoutManager {
  private timeouts: NodeJS.Timeout[] = [];
  private animationFrame?: number;

  runWithTimeout(callback: () => void, delay: number) {
    const t = setTimeout(callback, delay);
    this.timeouts.push(t);
  }

  clearAll() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }

  setAnimationFrame(frame: number) {
    this.animationFrame = frame;
  }
}

